package com.vodafone.touristpack.dto;

import com.vodafone.touristpack.entity.TravelPackage;
import com.vodafone.touristpack.entity.enums.PackageType;
import java.math.BigDecimal;
import lombok.Builder;
import lombok.Getter;

/**
 * Not explicitly requested in the spec, but added as a small, obviously-safe
 * convenience: the frontend needs *some* way to know real numeric package
 * ids to pass into POST /api/orders. GET /api/packages exposes the catalogue
 * seeded from data/packs.ts (see DataSeeder).
 */
@Getter
@Builder
public class PackageResponse {
    private final Long id;
    private final String name;
    private final String description;
    private final BigDecimal price;
    private final String currency;
    private final Integer dataAmount;
    private final Integer minutes;
    private final Integer sms;
    private final Integer durationDays;
    private final PackageType type;

    public static PackageResponse from(TravelPackage pkg) {
        return PackageResponse.builder()
                .id(pkg.getId())
                .name(pkg.getName())
                .description(pkg.getDescription())
                .price(pkg.getPrice())
                .currency(pkg.getCurrency())
                .dataAmount(pkg.getDataAmount())
                .minutes(pkg.getMinutes())
                .sms(pkg.getSms())
                .durationDays(pkg.getDurationDays())
                .type(pkg.getType())
                .build();
    }
}
