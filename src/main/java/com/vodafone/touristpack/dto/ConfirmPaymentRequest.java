package com.vodafone.touristpack.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Body for POST /api/orders/{orderId}/confirm-payment.
 *
 * With no real gateway integrated yet (see PaymentService), this doubles as
 * the mock's manual trigger: omit `outcome` (or leave payment.mock-enabled
 * on) to auto-succeed, or pass SUCCESS/FAILURE explicitly to simulate either
 * path in tests/demos. A real gateway integration would instead populate
 * this from an incoming webhook payload after verifying its signature.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConfirmPaymentRequest {
    private PaymentOutcome outcome;

    public enum PaymentOutcome {
        SUCCESS,
        FAILURE
    }
}
