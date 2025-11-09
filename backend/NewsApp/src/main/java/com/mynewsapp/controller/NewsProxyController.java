package com.mynewsapp.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

@RestController
@RequestMapping("/api/news")
public class NewsProxyController {

    private final RestClient http = RestClient.create();

    // NOTE the default ":" → empty string if missing (prevents bean creation failure)
    private final String apiKey;

    public NewsProxyController(@Value("${news.api.key:}") String apiKey) {
        this.apiKey = apiKey == null ? "" : apiKey.trim();
    }

    private boolean keyMissing() {
        return this.apiKey.isEmpty();
    }

    private ResponseEntity<String> noKeyResponse() {
        return ResponseEntity.status(503)
                .body("{\"error\":\"NEWS_API_KEY not configured\"}");
    }

    @GetMapping("/search")
    public ResponseEntity<String> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "en") String language,
            @RequestParam(defaultValue = "publishedAt") String sortBy,
            @RequestParam(defaultValue = "30") int pageSize
    ) {
        if (keyMissing()) return noKeyResponse();

        var resp = http.get()
                .uri("https://newsapi.org/v2/everything?q={q}&language={lang}&sortBy={sort}&pageSize={size}",
                        q, language, sortBy, Math.min(pageSize, 50))
                .header("X-Api-Key", apiKey)
                .retrieve()
                .toEntity(String.class);

        return ResponseEntity.status(resp.getStatusCode()).body(resp.getBody());
    }

    @GetMapping("/top")
    public ResponseEntity<String> top(
            @RequestParam String q,
            @RequestParam(defaultValue = "in") String country,
            @RequestParam(defaultValue = "30") int pageSize
    ) {
        if (keyMissing()) return noKeyResponse();

        var resp = http.get()
                .uri("https://newsapi.org/v2/top-headlines?q={q}&country={c}&pageSize={s}",
                        q, country, Math.min(pageSize, 50))
                .header("X-Api-Key", apiKey)
                .retrieve()
                .toEntity(String.class);

        return ResponseEntity.status(resp.getStatusCode()).body(resp.getBody());
    }
}
