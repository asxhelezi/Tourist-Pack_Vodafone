package com.vodafone.touristpack.service;

import com.vodafone.touristpack.entity.TravelPackage;
import com.vodafone.touristpack.exception.PackageNotFoundException;
import com.vodafone.touristpack.repository.TravelPackageRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PackageService {

    private final TravelPackageRepository travelPackageRepository;

    public List<TravelPackage> listActive() {
        return travelPackageRepository.findByActiveTrue();
    }

    public TravelPackage getById(Long id) {
        return travelPackageRepository.findById(id)
                .orElseThrow(() -> new PackageNotFoundException(id));
    }
}
