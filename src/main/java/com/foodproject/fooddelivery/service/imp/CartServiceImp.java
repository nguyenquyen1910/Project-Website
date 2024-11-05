package com.foodproject.fooddelivery.service.imp;

import com.foodproject.fooddelivery.dto.CartDTO;
import com.foodproject.fooddelivery.payload.request.CartRequest;


public interface CartServiceImp {
    CartDTO getAllCart(int userId);
    boolean insertCart(CartRequest cartRequest);
    boolean deleteCartItem(int cartItemId);
    boolean updateQuantityCartItem(int cartItemId,int quantity);
    void deleteAllCart(int userId);
}
