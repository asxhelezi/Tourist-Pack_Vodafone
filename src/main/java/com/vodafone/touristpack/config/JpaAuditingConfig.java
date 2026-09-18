package com.vodafone.touristpack.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/** Enables the @CreatedDate/@LastModifiedDate hooks on User/Order. */
@Configuration
@EnableJpaAuditing
public class JpaAuditingConfig {
}
