package com.foodproject.fooddelivery.repository;

import com.foodproject.fooddelivery.entity.Users;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsersRepository extends JpaRepository<Users,Integer> {
    List<Users> findByUserNameAndPassword(String username, String password);
    Users findByUserName(String userName);
    Boolean existsByUserName(String userName);
    Users findById(int id);
}
