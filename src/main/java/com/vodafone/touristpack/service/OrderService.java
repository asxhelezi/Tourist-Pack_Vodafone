package com.vodafone.touristpack.service;

import com.vodafone.touristpack.dto.ConfirmPaymentRequest;
import com.vodafone.touristpack.dto.ConfirmPaymentRequest.PaymentOutcome;
import com.vodafone.touristpack.dto.CreateOrderRequest;
import com.vodafone.touristpack.dto.OrderResponse;
import com.vodafone.touristpack.entity.Order;
import com.vodafone.touristpack.entity.TravelPackage;
import com.vodafone.touristpack.entity.User;
import com.vodafone.touristpack.entity.enums.OrderStatus;
import com.vodafone.touristpack.exception.OrderNotFoundException;
import com.vodafone.touristpack.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;
    private final PackageService packageService;
    private final PaymentGatewayService paymentGatewayService;
    private final ActivePackageService activePackageService;

    /** POST /api/orders — creates a PENDING order; price is always taken from the catalogue, never the client. */
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        User user = userService.findOrCreateByEmail(request);
        TravelPackage travelPackage = packageService.getById(request.getPackageId());

        Order order = Order.builder()
                .user(user)
                .travelPackage(travelPackage)
                .amount(travelPackage.getPrice())
                .currency(travelPackage.getCurrency())
                .paymentMethod(request.getPaymentMethod())
                .status(OrderStatus.PENDING)
                .build();

        return OrderResponse.from(orderRepository.save(order));
    }

    /**
     * POST /api/orders/{orderId}/confirm-payment — marks the order PAID or
     * FAILED. On success, issues the ActivePackage (QR + email); see
     * PaymentGatewayService for how the (currently mocked) outcome is
     * resolved.
     *
     * Maps to OrderResponse before returning, inside this @Transactional
     * method: Order.user/travelPackage are lazy associations, and with
     * open-in-view disabled (correctly — see application.yml) they can only
     * be read here, not later in the controller after the session closes.
     */
    @Transactional
    public OrderResponse confirmPayment(Long orderId, ConfirmPaymentRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        PaymentOutcome outcome = paymentGatewayService.resolveOutcome(request);

        if (outcome == PaymentOutcome.SUCCESS) {
            order.setStatus(OrderStatus.PAID);
            order = orderRepository.save(order);
            activePackageService.issueForOrder(order);
        } else {
            order.setStatus(OrderStatus.FAILED);
            order = orderRepository.save(order);
            log.info("Order {} payment failed", orderId);
        }

        return OrderResponse.from(order);
    }
}
