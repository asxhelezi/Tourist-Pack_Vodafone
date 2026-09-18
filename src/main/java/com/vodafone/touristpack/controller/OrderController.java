package com.vodafone.touristpack.controller;

import com.vodafone.touristpack.dto.ConfirmPaymentRequest;
import com.vodafone.touristpack.dto.CreateOrderRequest;
import com.vodafone.touristpack.dto.OrderResponse;
import com.vodafone.touristpack.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(request));
    }

    /**
     * Marks the order PAID/FAILED. Body is optional: with no gateway
     * integrated yet, omitting it (with payment.mock-enabled=true) auto-
     * succeeds — see PaymentGatewayService. A real gateway's webhook
     * handler would call OrderService.confirmPayment directly instead of
     * going through this HTTP endpoint.
     */
    @PostMapping("/{orderId}/confirm-payment")
    public ResponseEntity<OrderResponse> confirmPayment(
            @PathVariable Long orderId,
            @RequestBody(required = false) ConfirmPaymentRequest request) {
        return ResponseEntity.ok(orderService.confirmPayment(orderId, request));
    }
}
