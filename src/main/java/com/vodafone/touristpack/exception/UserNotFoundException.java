package com.vodafone.touristpack.exception;

import org.springframework.http.HttpStatus;

public class UserNotFoundException extends ApiException {
    public UserNotFoundException(String email) {
        super(ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND, "No account found for email " + email);
    }
}
