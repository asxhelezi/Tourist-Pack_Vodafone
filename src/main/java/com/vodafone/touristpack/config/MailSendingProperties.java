package com.vodafone.touristpack.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * FLAGGED: no email provider is configured yet. Named distinctly from
 * Spring's own "spring.mail.*" MailProperties to avoid confusion — this only
 * toggles whether EmailService actually sends (vs. logs) the message.
 */
@Getter
@Setter
@ConfigurationProperties(prefix = "mail-sending")
public class MailSendingProperties {
    private boolean mockEnabled;
}
