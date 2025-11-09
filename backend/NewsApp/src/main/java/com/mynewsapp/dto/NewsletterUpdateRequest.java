package com.mynewsapp.dto;

import jakarta.validation.constraints.Size;

public class NewsletterUpdateRequest {
    @Size(max = 200)
    private String title;
    private String content;
    @Size(max = 60)
    private String author;
    @Size(max = 40)
    private String category;

    // getters / setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
