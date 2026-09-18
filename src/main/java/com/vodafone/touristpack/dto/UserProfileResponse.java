package com.vodafone.touristpack.dto;

import com.vodafone.touristpack.entity.User;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserProfileResponse {
    private final Long id;
    private final String firstName;
    private final String lastName;
    private final String username;
    private final String email;
    private final String phone;
    private final String country;
    private final String cardLast4;
    private final List<OrderResponse> orders;

    public static UserProfileResponse from(User user, List<OrderResponse> orders) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .country(user.getCountry())
                .cardLast4(user.getCardLast4())
                .orders(orders)
                .build();
    }
}
