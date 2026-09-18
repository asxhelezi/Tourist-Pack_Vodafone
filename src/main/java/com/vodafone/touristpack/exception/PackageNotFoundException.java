package com.vodafone.touristpack.exception;

import org.springframework.http.HttpStatus;

public class PackageNotFoundException extends ApiException {
    public PackageNotFoundException(Long packageId) {
        super(ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND, "No package found with id " + packageId);
    }
}
