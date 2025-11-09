package com.mynewsapp.controller;

import com.mynewsapp.model.NewsletterSubscriber;
import com.mynewsapp.repository.SubscriberRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/subscribers")
public class SubscriberController {

    private final SubscriberRepository repo;

    public SubscriberController(SubscriberRepository repo) {
        this.repo = repo;
    }

    /** Plain POJO (no record) so it works on any Java level */
    public static class SubscribeRequest {
        @Email @NotBlank
        private String email;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> subscribe(@Valid @RequestBody SubscribeRequest req) {
        final String email = req.getEmail();

        if (repo.existsByEmail(email)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "ALREADY_SUBSCRIBED"));
        }

        NewsletterSubscriber s = new NewsletterSubscriber();
        s.setEmail(email);
        repo.save(s);

        // Avoid calling getId() in case your entity doesn't expose it yet
        return ResponseEntity.status(201)
                .body(Map.of("status", "SUBSCRIBED"));
    }
}
