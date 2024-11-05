package com.foodproject.fooddelivery.repository;

import com.foodproject.fooddelivery.entity.Orders;
import com.foodproject.fooddelivery.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Integer> {
    List<Orders> findByUsers(Users user);
    Optional<Orders> findById(int id);
}
