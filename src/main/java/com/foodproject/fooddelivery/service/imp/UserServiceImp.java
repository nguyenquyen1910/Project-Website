package com.foodproject.fooddelivery.service.imp;

import com.foodproject.fooddelivery.dto.UsersDTO;
import com.foodproject.fooddelivery.entity.Users;
import com.foodproject.fooddelivery.payload.request.ChangeInfoRequest;
import com.foodproject.fooddelivery.payload.request.ChangePasswordRequest;
import com.foodproject.fooddelivery.payload.request.EditUserRequest;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserServiceImp {
    List<UsersDTO> getAllUsers();
    UsersDTO findUserById(int id);
    UsersDTO findUserByUsername(String username);
    boolean changeInfo(ChangeInfoRequest changeInfoRequest);
    boolean changePassword(ChangePasswordRequest changePasswordRequest);
    boolean editUser(EditUserRequest editUserRequest);
    boolean lockUser(int id);
    boolean unlockUser(int id);
    boolean deleteUser(int id);
}
