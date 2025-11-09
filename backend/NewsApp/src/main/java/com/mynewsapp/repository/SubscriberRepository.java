package com.mynewsapp.repository;

import com.mynewsapp.model.NewsletterSubscriber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Transactional(readOnly = true)
public interface SubscriberRepository extends JpaRepository<NewsletterSubscriber, Long> {
  Optional<NewsletterSubscriber> findByEmail(String email);
  boolean existsByEmail(String email);
}
