package com.vodafone.touristpack.controller;

import com.vodafone.touristpack.dto.ActivePackageResponse;
import com.vodafone.touristpack.dto.CreateUserRequest;
import com.vodafone.touristpack.dto.UserProfileResponse;
import com.vodafone.touristpack.service.ActivePackageService;
import com.vodafone.touristpack.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * FLAGGED (see PROJECT_NOTES.md / README): the frontend has no real
 * login today (no password, just a demo localStorage profile), so these
 * endpoints intentionally take userId/email directly with no auth check,
 * per the "simple for now" decision. NOT safe to expose publicly as-is —
 * anyone can currently query anyone else's active packages, or anyone
 * else's profile + order history by guessing their email. Add real
 * authentication (e.g. JWT, verifying the caller's own identity) before
 * this goes further than local dev/demo.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final ActivePackageService activePackageService;
    private final UserService userService;

    @GetMapping("/{userId}/active-packages")
    public List<ActivePackageResponse> activePackages(@PathVariable Long userId) {
        return activePackageService.listByUser(userId);
    }

    /** Profile sign-in lookup: does an account with this email exist, and what has it already bought? */
    @GetMapping("/by-email")
    public UserProfileResponse getByEmail(@RequestParam String email) {
        return userService.getProfileByEmail(email);
    }

    /** Standalone account creation, used when the sign-in lookup above finds no match. */
    @PostMapping
    public ResponseEntity<UserProfileResponse> register(@Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.register(request));
    }
}
