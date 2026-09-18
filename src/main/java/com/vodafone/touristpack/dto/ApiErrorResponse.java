package com.vodafone.touristpack.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.vodafone.touristpack.exception.ErrorCode;
import java.time.Instant;
import java.util.Map;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiErrorResponse {
    private final ErrorCode code;
    private final String message;
    @Builder.Default
    private final Instant timestamp = Instant.now();

    /** Field name -> message, populated only for per-field validation failures. */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private final Map<String, String> errors;
}
