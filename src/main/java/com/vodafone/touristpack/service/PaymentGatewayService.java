package com.vodafone.touristpack.service;

import com.vodafone.touristpack.config.PaymentProperties;
import com.vodafone.touristpack.dto.ConfirmPaymentRequest;
import com.vodafone.touristpack.dto.ConfirmPaymentRequest.PaymentOutcome;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * FLAGGED: no real payment gateway is integrated. This is the seam a real
 * one would replace — e.g. a StripeWebhookController that verifies an
 * incoming webhook's signature and then calls
 * OrderService.confirmPayment(orderId, SUCCESS/FAILURE) the same way this
 * mock resolves its outcome today. Do not treat auto-succeed as
 * production-ready; it exists purely so the rest of the flow (QR + email)
 * is testable end-to-end before a provider is chosen.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentGatewayService {

    private final PaymentProperties paymentProperties;

    public PaymentOutcome resolveOutcome(ConfirmPaymentRequest request) {
        if (request != null && request.getOutcome() != null) {
            return request.getOutcome();
        }

        if (paymentProperties.isMockEnabled()) {
            log.info("[payment.mock-enabled=true] Auto-succeeding payment confirmation — "
                    + "no real gateway is integrated yet.");
            return PaymentOutcome.SUCCESS;
        }

        throw new IllegalStateException(
                "No payment gateway is integrated and payment.mock-enabled=false: "
                        + "either enable the mock flag, pass an explicit outcome, or wire up a real "
                        + "provider's webhook to call this endpoint.");
    }
}
