package com.vodafone.touristpack.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * FLAGGED: no payment gateway is integrated yet. See PaymentService for the
 * seam where a real provider's webhook handler would call OrderService's
 * confirmPayment instead of this mock.
 */
@Getter
@Setter
@ConfigurationProperties(prefix = "payment")
public class PaymentProperties {
    private boolean mockEnabled;
}
