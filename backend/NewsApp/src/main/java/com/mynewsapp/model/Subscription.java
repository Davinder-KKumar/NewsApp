package com.mynewsapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    private LocalDateTime subscriptionDate;

    @PrePersist
    protected void onCreate() {
        if (subscriptionDate == null) {
            subscriptionDate = LocalDateTime.now();
        }
    }
}
