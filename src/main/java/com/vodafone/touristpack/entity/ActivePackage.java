package com.vodafone.touristpack.entity;

import com.vodafone.touristpack.entity.enums.ActivePackageStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * The redemption record created once an Order is PAID: one opaque,
 * single-use token per order, exchanged for activation via
 * POST /api/active-packages/{token}/redeem.
 */
@Entity
@Table(name = "active_package")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivePackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(nullable = false, unique = true, updatable = false)
    private UUID redemptionToken;

    /**
     * Path/reference to the cached QR PNG (see QrCodeService). The QR always
     * encodes only this token (wrapped in the frontend's /activate/{token}
     * URL) — never raw user or order data.
     */
    private String qrCodePath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ActivePackageStatus status;

    @Column(nullable = false)
    private Instant issuedAt;

    private Instant activatedAt;

    /** Nullable: no expiry when redemption.expiry-days is configured as 0. */
    private Instant expiresAt;
}
