package com.vodafone.touristpack.exception;

import org.springframework.http.HttpStatus;

public class OrderNotFoundException extends ApiException {
    public OrderNotFoundException(Long orderId) {
        super(ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND, "No order found with id " + orderId);
    }
}
