package com.vodafone.touristpack.entity;

import com.vodafone.touristpack.entity.enums.PackageType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Named TravelPackage (not Package) to avoid shadowing java.lang.Package
 * within this file, per the task's "Package (or reuse existing entity if one
 * exists)" — no existing catalogue entity was found in this codebase, so this
 * is new. Field names mirror the frontend's data/packs.ts catalogue
 * (priceALL, durationDays, dataGB, callMinutes, sms) so seed data can line up
 * 1:1 with the four packs already shown in the UI.
 */
@Entity
@Table(name = "travel_package")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TravelPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Builder.Default
    @Column(nullable = false, length = 3)
    private String currency = "ALL";

    /** Data allowance in GB. */
    @Column(nullable = false)
    private Integer dataAmount;

    @Column(nullable = false)
    private Integer minutes;

    /** null = unlimited SMS, matching the frontend's Pack.sms semantics. */
    private Integer sms;

    @Column(nullable = false)
    private Integer durationDays;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PackageType type;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;
}
