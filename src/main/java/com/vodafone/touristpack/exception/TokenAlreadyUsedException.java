package com.vodafone.touristpack.exception;

import org.springframework.http.HttpStatus;

public class TokenAlreadyUsedException extends ApiException {
    public TokenAlreadyUsedException(String token) {
        super(ErrorCode.ALREADY_USED, HttpStatus.CONFLICT, "Token " + token + " has already been redeemed");
    }
}
