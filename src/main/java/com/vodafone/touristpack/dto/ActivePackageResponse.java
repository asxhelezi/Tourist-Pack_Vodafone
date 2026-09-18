package com.vodafone.touristpack.dto;

import com.vodafone.touristpack.entity.ActivePackage;
import com.vodafone.touristpack.entity.enums.ActivePackageStatus;
import java.time.Instant;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ActivePackageResponse {
    private final String token;
    private final ActivePackageStatus status;
    private final String packageName;
    private final Long orderId;
    private final Instant issuedAt;
    private final Instant activatedAt;
    private final Instant expiresAt;

    public static ActivePackageResponse from(ActivePackage activePackage) {
        return ActivePackageResponse.builder()
                .token(activePackage.getRedemptionToken().toString())
                .status(activePackage.getStatus())
                .packageName(activePackage.getOrder().getTravelPackage().getName())
                .orderId(activePackage.getOrder().getId())
                .issuedAt(activePackage.getIssuedAt())
                .activatedAt(activePackage.getActivatedAt())
                .expiresAt(activePackage.getExpiresAt())
                .build();
    }
}
