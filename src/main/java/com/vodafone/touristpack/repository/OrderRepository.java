package com.vodafone.touristpack.repository;

import com.vodafone.touristpack.entity.Order;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser_IdOrderByCreatedAtDesc(Long userId);
}
