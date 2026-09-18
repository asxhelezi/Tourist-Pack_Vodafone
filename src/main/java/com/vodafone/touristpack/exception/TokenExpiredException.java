package com.vodafone.touristpack.exception;

import org.springframework.http.HttpStatus;

public class TokenExpiredException extends ApiException {
    public TokenExpiredException(String token) {
        super(ErrorCode.EXPIRED, HttpStatus.GONE, "Token " + token + " has expired");
    }
}
