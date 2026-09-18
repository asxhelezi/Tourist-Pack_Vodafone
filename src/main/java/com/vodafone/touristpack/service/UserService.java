package com.vodafone.touristpack.service;

import com.vodafone.touristpack.dto.CreateOrderRequest;
import com.vodafone.touristpack.dto.CreateUserRequest;
import com.vodafone.touristpack.dto.OrderResponse;
import com.vodafone.touristpack.dto.UserProfileResponse;
import com.vodafone.touristpack.entity.User;
import com.vodafone.touristpack.exception.EmailAlreadyRegisteredException;
import com.vodafone.touristpack.exception.UserNotFoundException;
import com.vodafone.touristpack.repository.OrderRepository;
import com.vodafone.touristpack.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    /**
     * Creates a new User for this email, or updates the existing one's
     * profile fields to whatever was just submitted (matches the frontend's
     * "confirm your details" reconfirmation step for returning customers).
     */
    @Transactional
    public User findOrCreateByEmail(CreateOrderRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseGet(User::new);

        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getCardLast4() != null) {
            user.setCardLast4(request.getCardLast4());
        }
        if (request.getLocale() != null && !request.getLocale().isBlank()) {
            user.setPreferredLocale(request.getLocale());
        } else if (user.getPreferredLocale() == null) {
            user.setPreferredLocale("en");
        }

        return userRepository.save(user);
    }

    /**
     * GET /api/users/by-email — profile sign-in lookup used by the frontend
     * to check whether a purchase history already exists for this email.
     * Reads Order.user/travelPackage lazy associations, so the mapping to
     * OrderResponse happens inside this transaction (open-in-view is
     * disabled — see application.yml and OrderService's confirmPayment).
     */
    @Transactional(readOnly = true)
    public UserProfileResponse getProfileByEmail(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        var orders = orderRepository.findByUser_IdOrderByCreatedAtDesc(user.getId()).stream()
                .map(OrderResponse::from)
                .toList();

        return UserProfileResponse.from(user, orders);
    }

    /**
     * POST /api/users — standalone account creation for the profile
     * sign-in flow, distinct from findOrCreateByEmail (which only ever runs
     * as a side effect of placing an order). Rejects a duplicate email
     * instead of silently updating the existing row, since this is an
     * explicit "create an account" action, not an order reconfirmation.
     */
    @Transactional
    public UserProfileResponse register(CreateUserRequest request) {
        if (userRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new EmailAlreadyRegisteredException(request.getEmail());
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .country(request.getCountry())
                .build();

        return UserProfileResponse.from(userRepository.save(user), List.of());
    }
}
