package com.vodafone.touristpack.dto;

import com.vodafone.touristpack.entity.Order;
import com.vodafone.touristpack.entity.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderResponse {
    private final Long id;
    private final OrderStatus status;
    private final BigDecimal amount;
    private final String currency;
    private final String packageName;
    private final String userEmail;
    private final Instant createdAt;

    public static OrderResponse from(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus())
                .amount(order.getAmount())
                .currency(order.getCurrency())
                .packageName(order.getTravelPackage().getName())
                .userEmail(order.getUser().getEmail())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
