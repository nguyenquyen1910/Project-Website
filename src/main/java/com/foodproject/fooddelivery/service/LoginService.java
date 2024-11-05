package com.foodproject.fooddelivery.service;

import com.foodproject.fooddelivery.dto.UsersDTO;
import com.foodproject.fooddelivery.entity.Roles;
import com.foodproject.fooddelivery.entity.Users;
import com.foodproject.fooddelivery.mapper.UserMapper;
import com.foodproject.fooddelivery.payload.ResponseData;
import com.foodproject.fooddelivery.payload.request.SignUpRequest;
import com.foodproject.fooddelivery.repository.UsersRepository;
import com.foodproject.fooddelivery.service.imp.LoginServiceImp;
import com.foodproject.fooddelivery.service.imp.UserServiceImp;
import com.foodproject.fooddelivery.utils.JwtUtilHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class LoginService implements LoginServiceImp {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtilHelper jwtUtilHelper;

    @Autowired
    private UserServiceImp userServiceImp;

    @Override
    public List<UsersDTO> getAllUser() {
        List<Users> listUser=usersRepository.findAll();
        List<UsersDTO> usersDTOList=new ArrayList<>();
        for(Users users:listUser){
            UsersDTO usersDTO=new UsersDTO();
            usersDTO.setId(users.getId());
            usersDTO.setUserName(users.getUserName());
            usersDTO.setPassword(users.getPassword());
            usersDTO.setFullName(users.getFullName());
            usersDTO.setCreateDate(users.getCreateDate());
            usersDTOList.add(usersDTO);
        }
        return usersDTOList;
    }

    @Override
    public ResponseData checkLogin(String userName, String password) {
        ResponseData responseData = new ResponseData();
        Users user = usersRepository.findByUserName(userName);
        if(user!=null && passwordEncoder.matches(password, user.getPassword())){
            List<String> roles = new ArrayList<>();
            roles.add(user.getRoles().getRoleName());
            String token = jwtUtilHelper.generateTokens(userName, roles);
            UsersDTO usersDTO = userServiceImp.findUserByUsername(userName);
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", usersDTO);

            responseData.setData(response);
            responseData.setSuccess(true);
        } else{
            responseData.setData("Sai tai khoan hoac mat khau!");
            responseData.setSuccess(false);
        }
        return responseData;
    }

    @Override
    public Boolean isPhoneExists(String phone) {
        return usersRepository.existsByUserName(phone);
    }

    @Override
    public ResponseData addUser(SignUpRequest signUpRequest) {
        ResponseData responseData = new ResponseData();
        if (isPhoneExists(signUpRequest.getPhone())) {
            responseData.setSuccess(false);
            responseData.setData("Số điện thoại đã tồn tại!");
            return responseData;
        }

        Roles roles=new Roles();
        roles.setId(signUpRequest.getRoleId());
        Users users=new Users();
        users.setFullName(signUpRequest.getFullName());
        users.setUserName(signUpRequest.getPhone());
        users.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        users.setStatus(1);
        users.setRoles(roles);
        users.setEmail(signUpRequest.getEmail());
        users.setListOrders(new HashSet<>());
        users.setAddress(signUpRequest.getAddressDetail()+", "+signUpRequest.getWard()+", "+signUpRequest.getDistrict()+", "+signUpRequest.getProvince());
        users.setCreateDate(signUpRequest.getJoinDate());
        try {
            usersRepository.save(users);
            List<String> rolesList = new ArrayList<>();
            rolesList.add(roles.getRoleName());
            String token = jwtUtilHelper.generateTokens(users.getUserName(), rolesList);
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", UserMapper.toUsersDTO(users));

            responseData.setData(response);
            responseData.setSuccess(true);
        } catch (Exception e) {
            responseData.setSuccess(false);
            responseData.setData("Đã xảy ra lỗi trong quá trình đăng ký!");
        }
        return responseData;
    }
}
