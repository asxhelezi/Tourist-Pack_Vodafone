package com.vodafone.touristpack.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Body for POST /api/orders — the Select pack -> payment method ->
 * credentials frontend flow collapsed into a single call. The user is
 * created-or-matched by email; amount/currency are never trusted from the
 * client and are always taken from the TravelPackage row server-side.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotNull
    private Long packageId;

    @NotBlank
    private String paymentMethod;

    @NotBlank
    @Size(min = 2, max = 50)
    @Pattern(regexp = "^[\\p{L} '-]+$", message = "firstName must contain only letters, spaces, hyphens or apostrophes")
    private String firstName;

    @NotBlank
    @Size(min = 2, max = 50)
    @Pattern(regexp = "^[\\p{L} '-]+$", message = "lastName must contain only letters, spaces, hyphens or apostrophes")
    private String lastName;

    /**
     * Optional (nullable on User too). Empty string is accepted alongside the
     * 3-30 char pattern since it's unset for some demo profiles - only reject
     * genuinely malformed non-empty values.
     */
    @Pattern(regexp = "^$|^[a-zA-Z0-9_.]{3,30}$", message = "username must be 3-30 characters (letters, numbers, underscore or dot)")
    private String username;

    @NotBlank
    @Email
    private String email;

    /** Optional; last 4 digits only, demo-parity with the frontend's AuthContext. */
    @Pattern(regexp = "^\\d{4}$", message = "cardLast4 must be exactly 4 digits")
    private String cardLast4;

    /** Frontend language code ("en", "sq", ...) — defaults to "en" when omitted. */
    @Size(max = 10)
    private String locale;
}
