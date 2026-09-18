package com.vodafone.touristpack.dto;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CreateOrderRequestValidationTest {

    private static final Validator VALIDATOR;

    static {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        VALIDATOR = factory.getValidator();
    }

    private CreateOrderRequest validRequest() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setPackageId(10L);
        request.setPaymentMethod("card");
        request.setFirstName("Gjergji");
        request.setLastName("Çerçiz");
        request.setUsername("elira.h");
        request.setEmail("traveler@example.com");
        request.setCardLast4("1234");
        request.setLocale("en");
        return request;
    }

    @Test
    void validRequest_hasNoViolations() {
        assertThat(VALIDATOR.validate(validRequest())).isEmpty();
    }

    @Test
    void invalidEmail_isRejected() {
        CreateOrderRequest request = validRequest();
        request.setEmail("not-an-email");
        Set<ConstraintViolation<CreateOrderRequest>> violations = VALIDATOR.validate(request);
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("email"));
    }

    @Test
    void shortCardLast4_isRejected() {
        CreateOrderRequest request = validRequest();
        request.setCardLast4("12");
        assertThat(VALIDATOR.validate(request))
                .anyMatch(v -> v.getPropertyPath().toString().equals("cardLast4"));
    }

    @Test
    void fourDigitCardLast4_isAccepted() {
        CreateOrderRequest request = validRequest();
        request.setCardLast4("1234");
        assertThat(VALIDATOR.validate(request)).isEmpty();
    }

    @Test
    void oneCharUsername_isRejected() {
        CreateOrderRequest request = validRequest();
        request.setUsername("a");
        assertThat(VALIDATOR.validate(request))
                .anyMatch(v -> v.getPropertyPath().toString().equals("username"));
    }

    @Test
    void emptyUsername_isAccepted_forReturningUsersWithNoUsername() {
        CreateOrderRequest request = validRequest();
        request.setUsername("");
        assertThat(VALIDATOR.validate(request)).isEmpty();
    }

    @Test
    void nullUsername_isAccepted() {
        CreateOrderRequest request = validRequest();
        request.setUsername(null);
        assertThat(VALIDATOR.validate(request)).isEmpty();
    }

    @Test
    void numericFirstName_isRejected() {
        CreateOrderRequest request = validRequest();
        request.setFirstName("123456");
        assertThat(VALIDATOR.validate(request))
                .anyMatch(v -> v.getPropertyPath().toString().equals("firstName"));
    }

    @Test
    void accentedNames_areAccepted() {
        CreateOrderRequest request = validRequest();
        request.setFirstName("Gjergji");
        request.setLastName("Çerçiz");
        assertThat(VALIDATOR.validate(request)).isEmpty();
    }
}
