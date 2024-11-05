package com.foodproject.fooddelivery.service.imp;

import com.foodproject.fooddelivery.dto.UsersDTO;
import com.foodproject.fooddelivery.payload.ResponseData;
import com.foodproject.fooddelivery.payload.request.SignUpRequest;

import java.util.List;

public interface LoginServiceImp {
    List<UsersDTO> getAllUser();
    ResponseData checkLogin(String userName, String password);
    Boolean isPhoneExists(String phone);
    ResponseData addUser(SignUpRequest signUpRequest);
}
