package com.vodafone.touristpack.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Spring Security is wired in per the task's tech-stack requirement, but
 * deliberately left permissive for this pass — see the "Auth strategy"
 * decision: the frontend has no real login yet (no password field, just a
 * demo localStorage profile), so there's nothing to authenticate against.
 *
 * FLAGGED before any public/production deploy:
 *  - GET /api/users/{userId}/active-packages currently trusts the path
 *    variable with no check that the caller owns that userId.
 *  - The redeem endpoint has no rate limiting, so a token could in
 *    principle be brute-forced (UUIDs make this astronomically unlikely,
 *    but it's not defended against explicitly).
 *  - CSRF is disabled because this is a stateless JSON API with no cookie
 *    based session; re-enable if that ever changes.
 */
@Configuration
public class SecurityConfig {

    @Value("${app.frontend-base-url}")
    private String frontendBaseUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Origin *patterns* (not setAllowedOrigins, which requires an exact
        // match): "http://localhost:*" tolerates `next dev` falling back to
        // 3001/3002/... whenever the configured port is already taken by
        // another running instance, which otherwise fails as an opaque CORS
        // rejection the browser reports as a generic network error.
        configuration.setAllowedOriginPatterns(List.of(frontendBaseUrl, "http://localhost:*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
