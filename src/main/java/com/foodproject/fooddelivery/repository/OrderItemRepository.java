package com.foodproject.fooddelivery.repository;

import com.foodproject.fooddelivery.entity.OrderItem;
import com.foodproject.fooddelivery.entity.keys.KeyOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, KeyOrderItem> {
}
