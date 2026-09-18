package com.vodafone.touristpack;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Boots the full Spring context against the H2 test datasource (see
 * application-test.yml). Catches entity-mapping / bean-wiring problems that
 * the plain Mockito unit tests wouldn't (e.g. a bad @JoinColumn, a missing
 * bean for constructor injection, invalid @ConfigurationProperties binding).
 */
@SpringBootTest
@ActiveProfiles("test")
class ApplicationContextLoadsTest {

    @Test
    void contextLoads() {
    }
}
