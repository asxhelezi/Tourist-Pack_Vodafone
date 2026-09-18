package com.vodafone.touristpack.controller;

import com.vodafone.touristpack.dto.ActivePackageResponse;
import com.vodafone.touristpack.service.ActivePackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/active-packages")
@RequiredArgsConstructor
public class ActivePackageController {

    private final ActivePackageService activePackageService;

    /** Read-only preview/validation — used by the frontend's /activate/[token] page before the user confirms. */
    @GetMapping("/{token}")
    public ActivePackageResponse validate(@PathVariable String token) {
        return activePackageService.getByToken(token);
    }

    /** The actual scan/redemption call. Single-use: rejects with 409/410/404 per ErrorCode on repeat or invalid calls. */
    @PostMapping("/{token}/redeem")
    public ActivePackageResponse redeem(@PathVariable String token) {
        return activePackageService.redeem(token);
    }
}
