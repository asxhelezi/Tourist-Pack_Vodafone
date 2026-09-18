package com.vodafone.touristpack.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.vodafone.touristpack.config.RedemptionProperties;
import com.vodafone.touristpack.entity.ActivePackage;
import com.vodafone.touristpack.entity.Order;
import com.vodafone.touristpack.entity.TravelPackage;
import com.vodafone.touristpack.entity.User;
import com.vodafone.touristpack.entity.enums.ActivePackageStatus;
import com.vodafone.touristpack.entity.enums.PackageType;
import com.vodafone.touristpack.exception.TokenAlreadyUsedException;
import com.vodafone.touristpack.exception.TokenExpiredException;
import com.vodafone.touristpack.exception.TokenNotFoundException;
import com.vodafone.touristpack.repository.ActivePackageRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ActivePackageServiceTest {

    @Mock
    private ActivePackageRepository activePackageRepository;
    @Mock
    private QrCodeService qrCodeService;
    @Mock
    private EmailService emailService;

    private ActivePackageService activePackageService;

    @BeforeEach
    void setUp() {
        RedemptionProperties redemptionProperties = new RedemptionProperties();
        redemptionProperties.setExpiryDays(30);
        activePackageService = new ActivePackageService(
                activePackageRepository, qrCodeService, emailService, redemptionProperties);
    }

    private ActivePackage issuedPackage(UUID token, Instant expiresAt) {
        TravelPackage pkg = TravelPackage.builder()
                .id(1L).name("Standard Pack").price(BigDecimal.TEN).currency("ALL")
                .dataAmount(5).minutes(100).durationDays(7).type(PackageType.READY_MADE).build();
        User user = User.builder().id(1L).email("traveler@example.com").firstName("A").lastName("B").build();
        Order order = Order.builder().id(1L).user(user).travelPackage(pkg).amount(BigDecimal.TEN)
                .currency("ALL").paymentMethod("card").build();
        return ActivePackage.builder()
                .id(1L)
                .order(order)
                .redemptionToken(token)
                .status(ActivePackageStatus.ISSUED)
                .issuedAt(Instant.now().minus(1, ChronoUnit.HOURS))
                .expiresAt(expiresAt)
                .build();
    }

    @Test
    void issueForOrder_generatesQrAndSendsActivationEmail() {
        TravelPackage pkg = TravelPackage.builder()
                .id(1L).name("Standard Pack").price(BigDecimal.TEN).currency("ALL")
                .dataAmount(5).minutes(100).durationDays(7).type(PackageType.READY_MADE).build();
        User user = User.builder().id(1L).email("traveler@example.com").firstName("A").lastName("B").build();
        Order paidOrder = Order.builder().id(1L).user(user).travelPackage(pkg).amount(BigDecimal.TEN)
                .currency("ALL").paymentMethod("card").build();

        when(qrCodeService.generateAndStore(any(UUID.class))).thenReturn("/data/qrcodes/fake.png");
        when(activePackageRepository.save(any(ActivePackage.class))).thenAnswer(inv -> inv.getArgument(0));

        ActivePackage result = activePackageService.issueForOrder(paidOrder);

        assertThat(result.getStatus()).isEqualTo(ActivePackageStatus.ISSUED);
        assertThat(result.getRedemptionToken()).isNotNull();
        assertThat(result.getQrCodePath()).isEqualTo("/data/qrcodes/fake.png");
        verify(qrCodeService).generateAndStore(result.getRedemptionToken());
        verify(emailService).sendActivationEmail(result);
    }

    @Test
    void redeem_validIssuedToken_becomesActive() {
        UUID token = UUID.randomUUID();
        ActivePackage stored = issuedPackage(token, Instant.now().plus(1, ChronoUnit.DAYS));
        when(activePackageRepository.findByRedemptionToken(token)).thenReturn(Optional.of(stored));
        when(activePackageRepository.save(any(ActivePackage.class))).thenAnswer(inv -> inv.getArgument(0));

        com.vodafone.touristpack.dto.ActivePackageResponse result = activePackageService.redeem(token.toString());

        assertThat(result.getStatus()).isEqualTo(ActivePackageStatus.ACTIVE);
        assertThat(result.getActivatedAt()).isNotNull();
    }

    @Test
    void redeem_alreadyActiveToken_rejectedAsAlreadyUsed() {
        UUID token = UUID.randomUUID();
        ActivePackage stored = issuedPackage(token, Instant.now().plus(1, ChronoUnit.DAYS));
        stored.setStatus(ActivePackageStatus.ACTIVE);
        stored.setActivatedAt(Instant.now().minus(1, ChronoUnit.HOURS));
        when(activePackageRepository.findByRedemptionToken(token)).thenReturn(Optional.of(stored));

        org.junit.jupiter.api.Assertions.assertThrows(
                TokenAlreadyUsedException.class, () -> activePackageService.redeem(token.toString()));
    }

    @Test
    void redeem_expiredToken_rejectedAsExpired() {
        UUID token = UUID.randomUUID();
        ActivePackage stored = issuedPackage(token, Instant.now().minus(1, ChronoUnit.DAYS));
        when(activePackageRepository.findByRedemptionToken(token)).thenReturn(Optional.of(stored));
        when(activePackageRepository.save(any(ActivePackage.class))).thenAnswer(inv -> inv.getArgument(0));

        org.junit.jupiter.api.Assertions.assertThrows(
                TokenExpiredException.class, () -> activePackageService.redeem(token.toString()));

        assertThat(stored.getStatus()).isEqualTo(ActivePackageStatus.EXPIRED);
    }

    @Test
    void redeem_unknownToken_rejectedAsInvalid() {
        UUID token = UUID.randomUUID();
        when(activePackageRepository.findByRedemptionToken(token)).thenReturn(Optional.empty());

        org.junit.jupiter.api.Assertions.assertThrows(
                TokenNotFoundException.class, () -> activePackageService.redeem(token.toString()));
    }

    @Test
    void redeem_malformedToken_rejectedAsInvalid() {
        org.junit.jupiter.api.Assertions.assertThrows(
                TokenNotFoundException.class, () -> activePackageService.redeem("not-a-uuid"));
    }
}
