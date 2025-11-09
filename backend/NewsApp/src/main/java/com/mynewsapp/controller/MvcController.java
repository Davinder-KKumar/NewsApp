// src/main/java/com/mynewsapp/controller/MvcController.java
package com.mynewsapp.controller;

import com.mynewsapp.model.User;
import com.mynewsapp.repository.UserRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Optional;

@Controller
public class MvcController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public MvcController(UserRepository userRepository,
                         PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ---------------------------- Helpers ----------------------------

    /** Try repo.existsByEmailIgnoreCase / findByEmailIgnoreCase / findByEmail; else scan all. */
    private boolean repoEmailExists(String email) {
        try {
            Method m = userRepository.getClass().getMethod("existsByEmailIgnoreCase", String.class);
            return (boolean) m.invoke(userRepository, email);
        } catch (Exception ignored) { }
        try {
            Method m = userRepository.getClass().getMethod("findByEmailIgnoreCase", String.class);
            Optional<?> o = (Optional<?>) m.invoke(userRepository, email);
            return o != null && o.isPresent();
        } catch (Exception ignored) { }
        try {
            Method m = userRepository.getClass().getMethod("findByEmail", String.class);
            Optional<?> o = (Optional<?>) m.invoke(userRepository, email);
            return o != null && o.isPresent();
        } catch (Exception ignored) { }
        // Fallback: scan
        return userRepository.findAll().stream().anyMatch(u -> {
            String e = (String) readProp(u, "getEmail", "email");
            return e != null && e.trim().equalsIgnoreCase(email);
        });
    }

    /** Try repo.findByEmailIgnoreCase / findByEmail; else scan all. */
    private Optional<User> repoFindByEmail(String email) {
        try {
            Method m = userRepository.getClass().getMethod("findByEmailIgnoreCase", String.class);
            @SuppressWarnings("unchecked") Optional<User> o = (Optional<User>) m.invoke(userRepository, email);
            if (o != null && o.isPresent()) return o;
        } catch (Exception ignored) { }
        try {
            Method m = userRepository.getClass().getMethod("findByEmail", String.class);
            @SuppressWarnings("unchecked") Optional<User> o = (Optional<User>) m.invoke(userRepository, email);
            if (o != null && o.isPresent()) return o;
        } catch (Exception ignored) { }
        return userRepository.findAll().stream()
                .filter(u -> {
                    String e = (String) readProp(u, "getEmail", "email");
                    return e != null && e.trim().equalsIgnoreCase(email);
                })
                .findFirst();
    }

    private static Object readProp(Object target, String getter, String field) {
        if (target == null) return null;
        try { Method m = target.getClass().getMethod(getter); return m.invoke(target); }
        catch (Exception ignored) {}
        try {
            Field f = target.getClass().getDeclaredField(field);
            f.setAccessible(true);
            return f.get(target);
        } catch (Exception ignored) {}
        return null;
    }

    private static void writeString(Object target, String setter, String field, String value) {
        if (target == null) return;
        try { Method m = target.getClass().getMethod(setter, String.class); m.invoke(target, value); return; }
        catch (Exception ignored) {}
        try {
            Field f = target.getClass().getDeclaredField(field);
            f.setAccessible(true);
            f.set(target, value);
        } catch (Exception ignored) {}
    }

    // ---------------------------- Views ----------------------------

    @GetMapping("/view/login")
    public String showLoginForm() {
        return "login";     // /WEB-INF/views/login.jsp
    }

    @GetMapping("/view/register")
    public String showRegistrationForm() {
        return "register";  // /WEB-INF/views/register.jsp
    }

    // ---------------------------- Form posts ----------------------------

    @PostMapping("/web/auth/register")
    public String registerUser(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "phone", required = false) String phone,
            RedirectAttributes redirect
    ) {
        String normEmail   = email == null ? "" : email.trim().toLowerCase();
        String rawPassword = password == null ? "" : password.trim();

        if (normEmail.isEmpty() || rawPassword.isEmpty()) {
            redirect.addFlashAttribute("message", "Email and password are required.");
            redirect.addFlashAttribute("success", false);
            return "redirect:/view/register";
        }

        if (repoEmailExists(normEmail)) {
            redirect.addFlashAttribute("message", "Registration failed: Email is already taken.");
            redirect.addFlashAttribute("success", false);
            return "redirect:/view/register";
        }

        User u = new User();
        writeString(u, "setEmail", "email", normEmail);
        writeString(u, "setPassword", "password", passwordEncoder.encode(rawPassword));
        if (name != null && !name.trim().isEmpty()) {
            // your entity uses fullName
            writeString(u, "setFullName", "fullName", name.trim());
        }
        if (phone != null && !phone.trim().isEmpty()) {
            writeString(u, "setPhone", "phone", phone.trim());
        }
        userRepository.save(u);

        redirect.addFlashAttribute("message", "Registration successful! Please log in.");
        redirect.addFlashAttribute("success", true);
        return "redirect:/view/login";
    }

    @PostMapping("/web/auth/login")
    public String authenticateUser(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            RedirectAttributes redirect
    ) {
        String normEmail   = email == null ? "" : email.trim().toLowerCase();
        String rawPassword = password == null ? "" : password;

        if (normEmail.isEmpty() || rawPassword.isEmpty()) {
            redirect.addFlashAttribute("error", "Login failed: Email and password are required.");
            return "redirect:/view/login";
        }

        Optional<User> userOpt = repoFindByEmail(normEmail);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            String storedHash;
            try { storedHash = (String) user.getClass().getMethod("getPassword").invoke(user); }
            catch (Exception e) {
                try {
                    Field f = user.getClass().getDeclaredField("password");
                    f.setAccessible(true);
                    storedHash = (String) f.get(user);
                } catch (Exception ex) {
                    storedHash = null;
                }
            }

            if (storedHash != null && passwordEncoder.matches(rawPassword, storedHash)) {
                redirect.addFlashAttribute("message", "Login successful.");
                redirect.addFlashAttribute("success", true);
                return "redirect:/"; // hand off to React app
            }
        }

        redirect.addFlashAttribute("error", "Login failed: Invalid email or password.");
        return "redirect:/view/login";
    }
}
