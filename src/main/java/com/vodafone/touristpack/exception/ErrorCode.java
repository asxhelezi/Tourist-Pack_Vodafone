package com.vodafone.touristpack.exception;

/** Structured error codes returned in ApiErrorResponse.code, as requested for the redeem flow. */
public enum ErrorCode {
    INVALID_TOKEN,
    ALREADY_USED,
    EXPIRED,
    NOT_FOUND,
    VALIDATION_ERROR,
    INTERNAL_ERROR,
    EMAIL_ALREADY_REGISTERED
}
