package com.foodproject.fooddelivery.controller;

import com.foodproject.fooddelivery.dto.CartDTO;
import com.foodproject.fooddelivery.payload.ResponseData;
import com.foodproject.fooddelivery.payload.request.CartRequest;
import com.foodproject.fooddelivery.service.imp.CartServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    CartServiceImp cartServiceImp;

    @GetMapping("/get-cart/{userId}")
    public ResponseEntity<ResponseData> getCart(@PathVariable int userId) {
        ResponseData responseData = new ResponseData();
        CartDTO cartDTO = cartServiceImp.getAllCart(userId);
        responseData.setData(cartDTO);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/insert")
    public ResponseEntity<?> insertCart(@RequestBody CartRequest cartRequest) {
        ResponseData responseData=new ResponseData();
        boolean isInserted=cartServiceImp.insertCart(cartRequest);
        responseData.setData(isInserted);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{cartItemId}")
    public ResponseEntity<?> deleteCartItem(@PathVariable int cartItemId){
        ResponseData responseData=new ResponseData();
        boolean isDeleted = cartServiceImp.deleteCartItem(cartItemId);
        responseData.setData(isDeleted);
        return new ResponseEntity<>(responseData,HttpStatus.OK);
    }

    @PostMapping("update/{cartItemId}/{quantity}")
    public ResponseEntity<?> updateCartItem(@PathVariable int cartItemId, @PathVariable int quantity){
        ResponseData responseData=new ResponseData();
        boolean isUpdated = cartServiceImp.updateQuantityCartItem(cartItemId, quantity);
        responseData.setData(isUpdated);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @DeleteMapping("/deleteAll/{userId}")
    public ResponseEntity<?> deleteAllCart(@PathVariable int userId){
        ResponseData responseData=new ResponseData();
        try {
            cartServiceImp.deleteAllCart(userId);
            responseData.setData(true);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            responseData.setData(false);
            responseData.setDescription(e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
    }
}
