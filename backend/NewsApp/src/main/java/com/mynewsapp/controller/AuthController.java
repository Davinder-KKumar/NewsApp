package com.mynewsapp.controller;

import com.mynewsapp.dto.*;
import com.mynewsapp.model.User;
import com.mynewsapp.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController @RequestMapping("/api/auth")
public class AuthController {
  private final UserRepository users; private final PasswordEncoder encoder;
  public AuthController(UserRepository u, PasswordEncoder e){ this.users=u; this.encoder=e; }

  @PostMapping("/register")
  public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req){
    if (users.existsByEmail(req.email())) {
      return ResponseEntity.badRequest().body(java.util.Map.of("error","EMAIL_ALREADY_EXISTS"));
    }
    User u = new User();
    u.setName(req.name());
    u.setEmail(req.email());
    u.setPassword(encoder.encode(req.password()));
    u.setRole("USER");
    users.save(u);
    return ResponseEntity.created(URI.create("/api/users/"+u.getId()))
      .body(new AuthResponse(u.getId(), u.getName(), u.getEmail(), u.getRole()));
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req){
    var u = users.findByEmail(req.email()).orElseThrow(() -> new IllegalArgumentException("INVALID_CREDENTIALS"));
    if (!encoder.matches(req.password(), u.getPassword())) throw new IllegalArgumentException("INVALID_CREDENTIALS");
    return ResponseEntity.ok(new AuthResponse(u.getId(), u.getName(), u.getEmail(), u.getRole()));
  }
}
