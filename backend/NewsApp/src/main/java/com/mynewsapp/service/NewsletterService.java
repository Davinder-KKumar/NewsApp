package com.mynewsapp.service;

import com.mynewsapp.model.AdminNewsletter;
import com.mynewsapp.repository.AdminNewsletterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class NewsletterService {
    
    @Autowired
    private AdminNewsletterRepository newsletterRepository;

    @Transactional
    public AdminNewsletter subscribe(String email) {
        if (newsletterRepository.existsByEmail(email)) {
            throw new RuntimeException("This email is already subscribed to the newsletter");
        }
        AdminNewsletter newsletter = new AdminNewsletter(email);
        return newsletterRepository.save(newsletter);
    }

    @Transactional
    public void unsubscribe(String email) {
        AdminNewsletter newsletter = newsletterRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Email not found in newsletter subscribers"));
        newsletter.setActive(false);
        newsletterRepository.save(newsletter);
    }

    public Page<AdminNewsletter> getAllSubscribers(Pageable pageable) {
        return newsletterRepository.findAll(pageable);
    }

    public long getActiveSubscribersCount() {
        return newsletterRepository.count();
    }
}