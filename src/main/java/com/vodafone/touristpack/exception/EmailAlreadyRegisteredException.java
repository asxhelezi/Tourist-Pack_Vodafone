package com.vodafone.touristpack.exception;

import org.springframework.http.HttpStatus;

public class EmailAlreadyRegisteredException extends ApiException {
    public EmailAlreadyRegisteredException(String email) {
        super(ErrorCode.EMAIL_ALREADY_REGISTERED, HttpStatus.CONFLICT, "An account already exists for email " + email);
    }
}
