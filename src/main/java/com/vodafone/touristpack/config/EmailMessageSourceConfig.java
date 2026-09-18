package com.vodafone.touristpack.config;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;

/**
 * Minimal, backend-local translation set for the activation email (see
 * src/main/resources/i18n/email*.properties). This is NOT the frontend's
 * React/JSON i18n system — that's client-side only and unreachable from
 * Java at runtime — but the keys are deliberately kept close to the
 * frontend's messages/*.json "activation.*" namespace so the two can be
 * kept in sync by hand. Only "en" and "sq" are populated; other locales
 * fall back to the base (English) bundle — see email.properties.
 */
@Configuration
public class EmailMessageSourceConfig {

    @Bean
    public MessageSource emailMessageSource() {
        ResourceBundleMessageSource source = new ResourceBundleMessageSource();
        source.setBasenames("i18n/email");
        source.setDefaultEncoding("UTF-8");
        source.setUseCodeAsDefaultMessage(true);
        return source;
    }
}
