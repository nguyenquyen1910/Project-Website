package com.foodproject.fooddelivery.service;

import com.foodproject.fooddelivery.dto.CartDTO;
import com.foodproject.fooddelivery.dto.CartItemDTO;
import com.foodproject.fooddelivery.dto.ProductDTO;
import com.foodproject.fooddelivery.entity.Cart;
import com.foodproject.fooddelivery.entity.CartItem;
import com.foodproject.fooddelivery.entity.Product;
import com.foodproject.fooddelivery.entity.Users;
import com.foodproject.fooddelivery.mapper.ProductMapper;
import com.foodproject.fooddelivery.payload.request.CartItemRequest;
import com.foodproject.fooddelivery.payload.request.CartRequest;
import com.foodproject.fooddelivery.repository.CartItemRepository;
import com.foodproject.fooddelivery.repository.CartRepository;
import com.foodproject.fooddelivery.repository.ProductRepository;
import com.foodproject.fooddelivery.repository.UsersRepository;
import com.foodproject.fooddelivery.service.imp.CartServiceImp;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class CartService implements CartServiceImp {

    @Autowired
    CartRepository cartRepository;

    @Autowired
    UsersRepository usersRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CartItemRepository cartItemRepository;


    @Override
    public CartDTO getAllCart(int userId) {
        Cart cart=cartRepository.findByUsersId(userId);
        if (cart == null) {
            cart = new Cart();
            cart.setStatus(1);
            cart.setUsers(usersRepository.findById(userId));
            cart.setCreateDate(new Date());
            cart.setCartItems(new ArrayList<>());
            cartRepository.save(cart);
        }
        CartDTO cartDTO = new CartDTO();
        cartDTO.setCartId(cart.getId());
        cartDTO.setStatus(cart.getStatus());
        cartDTO.setCreateDate(cart.getCreateDate());
        int totalPrice=0;

        List<CartItemDTO> cartItemDTOS=new ArrayList<>();
        if (cart.getCartItems() != null) {
            for (CartItem cartItem : cart.getCartItems()) {
                CartItemDTO cartItemDTO = new CartItemDTO();
                cartItemDTO.setId(cartItem.getId());
                ProductDTO productDTO = ProductMapper.toProductDTO(cartItem.getProduct());
                cartItemDTO.setProduct(productDTO);
                cartItemDTO.setQuantity(cartItem.getQuantity());
                cartItemDTO.setPrice(cartItem.getPrice() * cartItem.getQuantity());
                cartItemDTO.setNote(cartItem.getNote());
                totalPrice += cartItem.getPrice() * cartItem.getQuantity();
                cartItemDTOS.add(cartItemDTO);
            }
        }
        cartDTO.setTotalPrice(totalPrice);
        cartDTO.setCartItems(cartItemDTOS);
        return cartDTO;
    }

    @Override
    public boolean insertCart(CartRequest cartRequest) {
        Users user=usersRepository.findById(cartRequest.getUserId());
        Cart existCart=cartRepository.findByUsersId(cartRequest.getUserId());
        Cart cart;
        int totalPrice;
        if(existCart!=null){
            cart = existCart;
        }
        else{
            cart = new Cart();
            cart.setUsers(user);
            cart.setStatus(cartRequest.getStatus());
            cart.setCreateDate(new Timestamp(System.currentTimeMillis()));
        }
        totalPrice = cart.getTotalPrice() == 0 ? 0 : cart.getTotalPrice();
        Cart savedCart = cartRepository.save(cart);
        for(CartItemRequest itemRequest : cartRequest.getListItems()){
            CartItem cartItem=new CartItem();
            cartItem.setCart(savedCart);
            Product product=productRepository.findById(itemRequest.getProductId());
            cartItem.setProduct(product);
            cartItem.setQuantity(itemRequest.getQuantity());
            cartItem.setNote(itemRequest.getNote());
            cartItem.setPrice(product.getPrice() * itemRequest.getQuantity());
            cartItem.setCreateDate(new Timestamp(System.currentTimeMillis()));
            totalPrice+=product.getPrice()*itemRequest.getQuantity();
            cartItemRepository.save(cartItem);
        }
        savedCart.setTotalPrice(totalPrice);
        cartRepository.save(savedCart);
        return true;
    }

    @Override
    public boolean deleteCartItem(int cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId);
        Cart cart = cartItem.getCart();
        if (cartItem != null) {
            cartItemRepository.delete(cartItem);
            int totalPrice = cart.getCartItems()
                    .stream()
                    .mapToInt(item -> item.getQuantity() * item.getProduct().getPrice())
                    .sum();
            cart.setTotalPrice(totalPrice);
            cartRepository.save(cart);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateQuantityCartItem(int cartItemId, int quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId);
        Cart cart = cartItem.getCart();
        if(cartItem!=null){
            cartItem.setQuantity(quantity);
            int totalPrice = cart.getCartItems()
                    .stream()
                    .mapToInt(item -> item.getQuantity() * item.getProduct().getPrice())
                    .sum();
            cart.setTotalPrice(totalPrice);
            cartRepository.save(cart);
            return true;
        }
        return false;
    }

    @Transactional
    @Override
    public void deleteAllCart(int userId) {
        Users user = usersRepository.findById(userId);
        Cart cart = cartRepository.findByUsersId(userId);
        cart.setTotalPrice(0);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }
}
