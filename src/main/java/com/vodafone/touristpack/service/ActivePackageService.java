package com.vodafone.touristpack.service;

import com.vodafone.touristpack.config.RedemptionProperties;
import com.vodafone.touristpack.dto.ActivePackageResponse;
import com.vodafone.touristpack.entity.ActivePackage;
import com.vodafone.touristpack.entity.Order;
import com.vodafone.touristpack.entity.enums.ActivePackageStatus;
import com.vodafone.touristpack.exception.TokenAlreadyUsedException;
import com.vodafone.touristpack.exception.TokenExpiredException;
import com.vodafone.touristpack.exception.TokenNotFoundException;
import com.vodafone.touristpack.repository.ActivePackageRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ActivePackageService {

    private final ActivePackageRepository activePackageRepository;
    private final QrCodeService qrCodeService;
    private final EmailService emailService;
    private final RedemptionProperties redemptionProperties;


    @Transactional
    public ActivePackage issueForOrder(Order order) {
        Instant now = Instant.now();
        UUID token = UUID.randomUUID();

        ActivePackage activePackage = ActivePackage.builder()
                .order(order)
                .redemptionToken(token)
                .status(ActivePackageStatus.ISSUED)
                .issuedAt(now)
                .expiresAt(redemptionProperties.getExpiryDays() > 0
                        ? now.plus(redemptionProperties.getExpiryDays(), ChronoUnit.DAYS)
                        : null)
                .build();

        activePackage.setQrCodePath(qrCodeService.generateAndStore(token));
        activePackage = activePackageRepository.save(activePackage);

        emailService.sendActivationEmail(activePackage);
        return activePackage;
    }

    /**
     * Read-only lookup for GET /api/active-packages/{token}
     */
    @Transactional
    public ActivePackageResponse getByToken(String rawToken) {
        ActivePackage activePackage = findByToken(rawToken);
        applyLazyExpiry(activePackage);
        return ActivePackageResponse.from(activePackage);
    }

    /**
     * The scan/redemption endpoint. Single-use by construction: only an
     * ISSUED token can become ACTIVE. ACTIVE or SCANNED tokens are rejected
     * as ALREADY_USED (SCANNED is reserved for a future two-phase
     * scan-then-confirm flow — e.g. a staff kiosk pre-scan — and isn't
     * produced by the current two endpoints, but is guarded here per spec
     * so adding that later doesn't accidentally allow a double-activation).
     */
    @Transactional
    public ActivePackageResponse redeem(String rawToken) {
        ActivePackage activePackage = findByToken(rawToken);
        applyLazyExpiry(activePackage);

        ActivePackageStatus status = activePackage.getStatus();
        if (status == ActivePackageStatus.EXPIRED) {
            throw new TokenExpiredException(rawToken);
        }
        if (status == ActivePackageStatus.ACTIVE || status == ActivePackageStatus.SCANNED) {
            throw new TokenAlreadyUsedException(rawToken);
        }

        activePackage.setStatus(ActivePackageStatus.ACTIVE);
        activePackage.setActivatedAt(Instant.now());
        return ActivePackageResponse.from(activePackageRepository.save(activePackage));
    }

    @Transactional(readOnly = true)
    public List<ActivePackageResponse> listByUser(Long userId) {
        return activePackageRepository.findByOrder_User_IdOrderByIssuedAtDesc(userId).stream()
                .map(ActivePackageResponse::from)
                .toList();
    }

    private ActivePackage findByToken(String rawToken) {
        UUID token;
        try {
            token = UUID.fromString(rawToken);
        } catch (IllegalArgumentException e) {
            throw new TokenNotFoundException(rawToken);
        }
        return activePackageRepository.findByRedemptionToken(token)
                .orElseThrow(() -> new TokenNotFoundException(rawToken));
    }

    /** No scheduler runs in this pass — expiry is checked lazily on read/redeem instead. */
    private void applyLazyExpiry(ActivePackage activePackage) {
        boolean stillPending = activePackage.getStatus() == ActivePackageStatus.ISSUED
                || activePackage.getStatus() == ActivePackageStatus.SCANNED;
        boolean pastExpiry = activePackage.getExpiresAt() != null
                && Instant.now().isAfter(activePackage.getExpiresAt());

        if (stillPending && pastExpiry) {
            activePackage.setStatus(ActivePackageStatus.EXPIRED);
            activePackageRepository.save(activePackage);
        }
    }
}
