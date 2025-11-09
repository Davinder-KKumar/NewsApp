package com.mynewsapp.repository;

import com.mynewsapp.model.AdminNewsletter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminNewsletterRepository extends JpaRepository<AdminNewsletter, Long> {
    Optional<AdminNewsletter> findByEmail(String email);
    boolean existsByEmail(String email);
}