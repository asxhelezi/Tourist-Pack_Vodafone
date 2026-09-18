package com.vodafone.touristpack.repository;

import com.vodafone.touristpack.entity.TravelPackage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelPackageRepository extends JpaRepository<TravelPackage, Long> {
    List<TravelPackage> findByActiveTrue();
}
