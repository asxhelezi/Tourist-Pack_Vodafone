package com.vodafone.touristpack.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Body for POST /api/users — standalone account creation for the profile
 * sign-in flow. Distinct from CreateOrderRequest's findOrCreateByEmail,
 * which only ever runs as a side effect of placing an order and doesn't
 * collect phone/country.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    private String country;
}
