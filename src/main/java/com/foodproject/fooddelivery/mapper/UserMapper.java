package com.foodproject.fooddelivery.mapper;

import com.foodproject.fooddelivery.dto.UsersDTO;
import com.foodproject.fooddelivery.entity.Users;

import java.util.ArrayList;
import java.util.List;

public class UserMapper {
    public static UsersDTO toUsersDTO(Users users) {
        UsersDTO usersDTO = new UsersDTO();
        usersDTO.setId(users.getId());
        usersDTO.setUserName(users.getUserName());
        usersDTO.setPassword(users.getPassword());
        usersDTO.setFullName(users.getFullName());
        usersDTO.setCreateDate(users.getCreateDate());
        usersDTO.setEmail(users.getEmail());
        usersDTO.setAddress(users.getAddress());
        usersDTO.setStatus(users.getStatus());
        if (users.getRoles() != null) {
            usersDTO.setRoleId(users.getRoles().getId());
        }
        return usersDTO;
    }
    public static List<UsersDTO> toDTOList(List<Users> usersList) {
        List<UsersDTO> usersDTOList = new ArrayList<>();
        for (Users users : usersList) {
            usersDTOList.add(toUsersDTO(users));
        }
        return usersDTOList;
    }
}
