package com.mynewsapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient newsApiClient() {
        return WebClient.builder()
                .baseUrl("https://newsapi.org/v2")
                .build();
    }
}
