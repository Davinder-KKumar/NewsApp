package com.mynewsapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class NewsletterCreateRequest {
    @NotBlank @Size(max = 200)
    private String title;
    @NotBlank
    private String content;
    @NotBlank @Size(max = 60)
    private String author;
    @NotBlank @Size(max = 40)
    private String category;
    @PastOrPresent
    private LocalDate date;

    // getters / setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
}
