package com.vodafone.touristpack.config;

import com.vodafone.touristpack.entity.TravelPackage;
import com.vodafone.touristpack.entity.enums.PackageType;
import com.vodafone.touristpack.repository.TravelPackageRepository;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds the catalogue from the frontend's data/packs.ts on first boot (only
 * when the table is empty) so the four packs already shown in the UI have
 * matching real ids to purchase against. Replace with a real migration
 * (Flyway/Liquibase) once the catalogue needs to change without a redeploy.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final TravelPackageRepository travelPackageRepository;

    @Override
    public void run(String... args) {
        if (travelPackageRepository.count() > 0) {
            return;
        }

        travelPackageRepository.saveAll(java.util.List.of(
                TravelPackage.builder()
                        .name("Basic Pack")
                        .description("Perfect for short visits")
                        .price(BigDecimal.valueOf(500))
                        .currency("ALL")
                        .dataAmount(2)
                        .minutes(50)
                        .sms(100)
                        .durationDays(3)
                        .type(PackageType.READY_MADE)
                        .active(true)
                        .build(),
                TravelPackage.builder()
                        .name("Standard Pack")
                        .description("Great for a full week")
                        .price(BigDecimal.valueOf(1000))
                        .currency("ALL")
                        .dataAmount(5)
                        .minutes(100)
                        .sms(null)
                        .durationDays(7)
                        .type(PackageType.READY_MADE)
                        .active(true)
                        .build(),
                TravelPackage.builder()
                        .name("Traveller Pack")
                        .description("For longer stays")
                        .price(BigDecimal.valueOf(1500))
                        .currency("ALL")
                        .dataAmount(12)
                        .minutes(200)
                        .sms(null)
                        .durationDays(14)
                        .type(PackageType.READY_MADE)
                        .active(true)
                        .build(),
                TravelPackage.builder()
                        .name("Explorer Pack")
                        .description("A full month, high allowance")
                        .price(BigDecimal.valueOf(2500))
                        .currency("ALL")
                        .dataAmount(25)
                        .minutes(300)
                        .sms(null)
                        .durationDays(30)
                        .type(PackageType.READY_MADE)
                        .active(true)
                        .build()));
    }
}
