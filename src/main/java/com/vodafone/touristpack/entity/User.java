package com.vodafone.touristpack.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import jakarta.persistence.EntityListeners;

/**
 * Matches the fields already collected by the frontend's "credentials" step
 * (PaymentActivationModal: firstName, lastName, username, plus cardLast4 on
 * the demo AuthContext profile), with email promoted to a required, unique
 * field since it's how orders/users are matched server-side.
 */
@Entity
@Table(name = "app_user", uniqueConstraints = @jakarta.persistence.UniqueConstraint(columnNames = "email"))
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    /** Last 4 digits of the payment method on file (demo-parity field, never full PAN). */
    private String cardLast4;

    /**
     * Nullable: only collected by the standalone account-creation flow
     * (POST /api/users), not by the order flow, so rows created via
     * findOrCreateByEmail alone won't have these set.
     */
    private String phone;

    private String country;

    /**
     * Frontend language code ("en", "sq", ...) used to localize the
     * activation email. Defaults to "en" when not supplied.
     */
    @Builder.Default
    @Column(nullable = false)
    private String preferredLocale = "en";

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;
}
