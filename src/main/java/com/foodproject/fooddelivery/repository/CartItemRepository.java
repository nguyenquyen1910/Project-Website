package com.foodproject.fooddelivery.repository;

import com.foodproject.fooddelivery.entity.Cart;
import com.foodproject.fooddelivery.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCartId(int cartId);
    CartItem findById(int id);
}
