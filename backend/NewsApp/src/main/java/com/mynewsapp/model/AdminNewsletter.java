package com.mynewsapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_newsletters")
public class AdminNewsletter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private LocalDateTime subscribedAt;

    @Column(nullable = false)
    private boolean active;

    public AdminNewsletter() {
        this.subscribedAt = LocalDateTime.now();
        this.active = true;
    }

    public AdminNewsletter(String email) {
        this.email = email;
        this.subscribedAt = LocalDateTime.now();
        this.active = true;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getSubscribedAt() {
        return subscribedAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}