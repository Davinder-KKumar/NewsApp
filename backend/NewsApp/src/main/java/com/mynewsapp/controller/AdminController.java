package com.mynewsapp.controller;

import com.mynewsapp.model.AdminNewsletter;
import com.mynewsapp.repository.AdminNewsletterRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/newsletters")
public class AdminController {

    private final AdminNewsletterRepository repo;

    public AdminController(AdminNewsletterRepository repo) {
        this.repo = repo;
    }

    // ----------------------- reflection helpers -----------------------

    private static Field findField(Class<?> type, String name) {
        Class<?> t = type;
        while (t != null && t != Object.class) {
            try { return t.getDeclaredField(name); }
            catch (NoSuchFieldException ignored) {}
            t = t.getSuperclass();
        }
        return null;
    }

    private static Object getProp(Object target, String getter, String fieldName) {
        if (target == null) return null;
        try {
            Method m = target.getClass().getMethod(getter);
            return m.invoke(target);
        } catch (Exception ignored) {}
        try {
            Field f = findField(target.getClass(), fieldName);
            if (f != null) { f.setAccessible(true); return f.get(target); }
        } catch (Exception ignored) {}
        return null;
    }

    private static void setStringProp(Object target, String setter, String fieldName, String value) {
        if (target == null) return;
        try {
            Method m = target.getClass().getMethod(setter, String.class);
            m.invoke(target, value);
            return;
        } catch (Exception ignored) {}
        try {
            Field f = findField(target.getClass(), fieldName);
            if (f != null) { f.setAccessible(true); f.set(target, value); }
        } catch (Exception ignored) {}
    }

    private static void setLongProp(Object target, String setter, String fieldName, Long value) {
        if (target == null) return;
        try {
            Method m = target.getClass().getMethod(setter, Long.class);
            m.invoke(target, value);
            return;
        } catch (Exception ignored) {}
        try {
            Method m = target.getClass().getMethod(setter, long.class);
            m.invoke(target, value == null ? 0L : value);
            return;
        } catch (Exception ignored) {}
        try {
            Field f = findField(target.getClass(), fieldName);
            if (f != null) { f.setAccessible(true); f.set(target, value); }
        } catch (Exception ignored) {}
    }

    private static String getString(Object target, String getter, String fieldName) {
        Object v = getProp(target, getter, fieldName);
        return v == null ? null : String.valueOf(v);
    }

    /** Try common date fields: date, createdAt, created_on. */
    private static Instant getInstant(Object target) {
        Object v = getProp(target, "getDate", "date");
        if (v == null) v = getProp(target, "getCreatedAt", "createdAt");
        if (v == null) v = getProp(target, "getCreated_on", "created_on");
        if (v == null) return null;

        try {
            if (v instanceof Instant) return (Instant) v;
            if (v instanceof Date) return ((Date) v).toInstant();
            if (v instanceof LocalDateTime) return ((LocalDateTime) v).toInstant(ZoneOffset.UTC);
            if (v instanceof LocalDate) return ((LocalDate) v).atStartOfDay().toInstant(ZoneOffset.UTC);
            if (v instanceof Number) return Instant.ofEpochMilli(((Number) v).longValue());
            if (v instanceof CharSequence) {
                String s = v.toString().trim();
                try { return Instant.parse(s); } catch (Exception ignored) {}
                try { return Instant.ofEpochMilli(Long.parseLong(s)); } catch (Exception ignored) {}
            }
        } catch (Exception ignored) {}
        return null;
    }

    // ----------------------------- endpoints -----------------------------

    /**
     * List newsletters.
     * Optional filter: /api/admin/newsletters?category=technology
     * Use category=all or omit parameter for everything.
     * If a date/createdAt field exists, results are sorted DESC by that.
     */
    @GetMapping
    public List<AdminNewsletter> list(@RequestParam(value = "category", required = false) String category) {
        List<AdminNewsletter> items = repo.findAll();

        // filter by category if provided and not "all"
        if (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category)) {
            String wanted = category.trim().toLowerCase(Locale.ROOT);
            items = items.stream()
                    .filter(nl -> {
                        String cat = getString(nl, "getCategory", "category");
                        return cat != null && cat.trim().equalsIgnoreCase(wanted);
                    })
                    .collect(Collectors.toList());
        }

        // sort by date/createdAt if available
        items.sort((a, b) -> {
            Instant ia = getInstant(a);
            Instant ib = getInstant(b);
            if (ia == null && ib == null) return 0;
            if (ia == null) return 1;
            if (ib == null) return -1;
            return ib.compareTo(ia); // DESC
        });

        return items;
    }

    /** Get one newsletter by id. */
    @GetMapping("/{id}")
    public ResponseEntity<AdminNewsletter> getOne(@PathVariable Long id) {
        return repo.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    /** Create a newsletter (id forced null; category normalized to lowercase if present). */
    @PostMapping
    public ResponseEntity<AdminNewsletter> create(@RequestBody AdminNewsletter newsletter) {
        // force id = null (works whether setId exists or not)
        setLongProp(newsletter, "setId", "id", null);

        // normalize category if present
        String cat = getString(newsletter, "getCategory", "category");
        if (cat != null) setStringProp(newsletter, "setCategory", "category",
                cat.toLowerCase(Locale.ROOT));

        AdminNewsletter saved = repo.save(newsletter);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /** Update a newsletter (404 if missing). Id from path is authoritative. */
    @PutMapping("/{id}")
    public ResponseEntity<AdminNewsletter> update(@PathVariable Long id,
                                                  @RequestBody AdminNewsletter newsletter) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        // set id from path
        setLongProp(newsletter, "setId", "id", id);

        // normalize category if present
        String cat = getString(newsletter, "getCategory", "category");
        if (cat != null) setStringProp(newsletter, "setCategory", "category",
                cat.toLowerCase(Locale.ROOT));

        AdminNewsletter saved = repo.save(newsletter);
        return ResponseEntity.ok(saved);
    }

    /** Delete a newsletter (404 if not found). */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
