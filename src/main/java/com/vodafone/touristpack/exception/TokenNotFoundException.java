package com.vodafone.touristpack.exception;

import org.springframework.http.HttpStatus;

public class TokenNotFoundException extends ApiException {
    public TokenNotFoundException(String token) {
        super(ErrorCode.INVALID_TOKEN, HttpStatus.NOT_FOUND, "No active package found for token " + token);
    }
}
