package com.mynewsapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;                          // JPA (Jakarta)
import jakarta.validation.constraints.Email;          // Bean Validation (Jakarta)
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;

@Entity
@Table(
    name = "users",
    uniqueConstraints = @UniqueConstraint(name = "uk_users_email", columnNames = "email"),
    indexes = @Index(name = "ix_users_email", columnList = "email")
)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 2, max = 80)
    private String name;

    @Email
    @NotBlank
    private String email;

    @JsonIgnore
    @NotBlank
    @Size(min = 60, max = 100)   // bcrypt hash length
    private String password;

    @NotBlank
    @Size(max = 20)
    private String role = "USER";

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    /* --- Timestamps without auditing --- */
    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    /* --- Getters / Setters --- */
    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}