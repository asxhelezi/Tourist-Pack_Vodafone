package com.vodafone.touristpack.repository;

import com.vodafone.touristpack.entity.ActivePackage;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivePackageRepository extends JpaRepository<ActivePackage, Long> {

    Optional<ActivePackage> findByRedemptionToken(UUID token);

    Optional<ActivePackage> findByOrderId(Long orderId);

    List<ActivePackage> findByOrder_User_IdOrderByIssuedAtDesc(Long userId);
}
