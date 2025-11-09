package com.mynewsapp.controller;

import com.mynewsapp.service.NewsletterService;
import com.mynewsapp.dto.SubscriptionRequest;
import com.mynewsapp.model.AdminNewsletter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/newsletters")
public class NewsletterController {

    @Autowired
    private NewsletterService newsletterService;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@Valid @RequestBody SubscriptionRequest request) {
        try {
            newsletterService.subscribe(request.getEmail());
            return ResponseEntity.ok().body(Map.of(
                "message", "Successfully subscribed to newsletter"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<?> unsubscribe(@Valid @RequestBody SubscriptionRequest request) {
        try {
            newsletterService.unsubscribe(request.getEmail());
            return ResponseEntity.ok().body(Map.of(
                "message", "Successfully unsubscribed from newsletter"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/subscribers")
    public ResponseEntity<Page<AdminNewsletter>> getAllSubscribers(Pageable pageable) {
        return ResponseEntity.ok(newsletterService.getAllSubscribers(pageable));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return ResponseEntity.ok(Map.of(
            "activeSubscribers", newsletterService.getActiveSubscribersCount()
        ));
    }
}