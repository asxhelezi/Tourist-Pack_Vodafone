package com.vodafone.touristpack.controller;

import com.vodafone.touristpack.dto.PackageResponse;
import com.vodafone.touristpack.service.PackageService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Not in the original spec — added so the frontend has a real packageId to send into POST /api/orders. */
@RestController
@RequestMapping("/api/packages")
@RequiredArgsConstructor
public class PackageController {

    private final PackageService packageService;

    @GetMapping
    public List<PackageResponse> list() {
        return packageService.listActive().stream().map(PackageResponse::from).toList();
    }

    @GetMapping("/{id}")
    public PackageResponse get(@PathVariable Long id) {
        return PackageResponse.from(packageService.getById(id));
    }
}
