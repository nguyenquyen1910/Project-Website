package com.foodproject.fooddelivery.controller;

import com.foodproject.fooddelivery.dto.UsersDTO;
import com.foodproject.fooddelivery.entity.Users;
import com.foodproject.fooddelivery.payload.ResponseData;
import com.foodproject.fooddelivery.payload.request.ChangeInfoRequest;
import com.foodproject.fooddelivery.payload.request.ChangePasswordRequest;
import com.foodproject.fooddelivery.payload.request.EditUserRequest;
import com.foodproject.fooddelivery.service.UserService;
import com.foodproject.fooddelivery.service.imp.UserServiceImp;
import com.foodproject.fooddelivery.utils.JwtUtilHelper;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;

@CrossOrigin("*")
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserServiceImp userServiceImp;
    @Autowired
    private JwtUtilHelper jwtUtilHelper;
    @Autowired
    UserService userService;

    @GetMapping("")
    public ResponseEntity<?> getAllUser() {


        return new ResponseEntity<>(userServiceImp.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String token = getTokenFromHeader(request);
        if (token != null && jwtUtilHelper.verifyToken(token)) {
            String username = jwtUtilHelper.extractUsername(token);
            UsersDTO currentUser = userServiceImp.findUserByUsername(username);
            if (currentUser != null) {
                return new ResponseEntity<>(currentUser, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }
        }
        return new ResponseEntity<>("Invalid token", HttpStatus.UNAUTHORIZED);
    }

    private String getTokenFromHeader(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }

    @PostMapping("/change")
    public ResponseEntity<?> changeUser(@RequestBody ChangeInfoRequest changeInfoRequest) {
        ResponseData responseData = new ResponseData();
        boolean isSuccess = userServiceImp.changeInfo(changeInfoRequest);
        responseData.setData(isSuccess);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        ResponseData responseData = new ResponseData();
        try {
            boolean isSuccess = userServiceImp.changePassword(changePasswordRequest);
            responseData.setData(isSuccess);
        } catch (RuntimeException e) {
            responseData.setData(false);
            responseData.setDescription(e.getMessage());
        }
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PutMapping("/admin/edit")
    public ResponseEntity<?> editUser(@RequestBody EditUserRequest editUserRequest) {
        ResponseData responseData = new ResponseData();
        boolean isSuccess = userServiceImp.editUser(editUserRequest);
        responseData.setData(isSuccess);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/admin/lock/{id}")
    public ResponseEntity<?> lockUser(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        boolean isLock = userServiceImp.lockUser(id);
        responseData.setData(isLock);
        return new ResponseEntity<>(responseData,HttpStatus.OK);
    }

    @PostMapping("/admin/unlock/{id}")
    public ResponseEntity<?> unlockUser(@PathVariable int id) {
        ResponseData responseData = new ResponseData();
        boolean isUnlock = userServiceImp.unlockUser(id);
        responseData.setData(isUnlock);
        return new ResponseEntity<>(responseData,HttpStatus.OK);
    }

    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        ResponseData responseData=new ResponseData();
        boolean isSuccess = userServiceImp.deleteUser(id);
        responseData.setData(isSuccess);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
