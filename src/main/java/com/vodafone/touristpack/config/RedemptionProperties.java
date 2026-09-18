package com.vodafone.touristpack.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * FLAGGED business rule: confirm the correct expiry window for unscanned
 * purchases. 0 (or negative) disables expiry entirely.
 */
@Getter
@Setter
@ConfigurationProperties(prefix = "redemption")
public class RedemptionProperties {
    private int expiryDays;
}
