package com.foodproject.fooddelivery.service;

import com.foodproject.fooddelivery.dto.OrderDTO;
import com.foodproject.fooddelivery.dto.OrderItemDTO;
import com.foodproject.fooddelivery.dto.ProductDTO;
import com.foodproject.fooddelivery.entity.OrderItem;
import com.foodproject.fooddelivery.entity.Orders;
import com.foodproject.fooddelivery.entity.Product;
import com.foodproject.fooddelivery.entity.Users;
import com.foodproject.fooddelivery.entity.keys.KeyOrderItem;
import com.foodproject.fooddelivery.mapper.OrderMapper;
import com.foodproject.fooddelivery.payload.request.OrderItemRequest;
import com.foodproject.fooddelivery.payload.request.OrderRequest;
import com.foodproject.fooddelivery.repository.OrderItemRepository;
import com.foodproject.fooddelivery.repository.OrderRepository;
import com.foodproject.fooddelivery.repository.ProductRepository;
import com.foodproject.fooddelivery.repository.UsersRepository;
import com.foodproject.fooddelivery.service.imp.OrderServiceImp;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.*;

@Service
public class OrderService implements OrderServiceImp {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    UsersRepository usersRepository;

    @Autowired
    OrderMapper orderMapper;

    @Override
    public List<OrderDTO> getAll() {
        List<Orders> ordersList = orderRepository.findAll();
        List<OrderDTO> orderDTOs = new ArrayList<>();
        for (Orders orders : ordersList) {
            OrderDTO orderDTO = orderMapper.toOrderDTO(orders);
            Users user = orders.getUsers();
            orderDTO.setUserId(orders.getUsers().getId());
            orderDTO.setUserName(user.getUserName());
            orderDTO.setUserFullName(user.getFullName());
            orderDTOs.add(orderDTO);
        }
        return orderDTOs;
    }

    @Override
    public List<OrderDTO> getAllOrders(int userId) {
        Users user = usersRepository.findById(userId);
        List<Orders> ordersList = orderRepository.findByUsers(user);
        List<OrderDTO> orderDTOs = new ArrayList<>();

        for (Orders orders : ordersList) {
            OrderDTO orderDTO = orderMapper.toOrderDTO(orders);
            orderDTO.setUserId(orders.getUsers().getId());
            orderDTO.setUserName(user.getUserName());
            orderDTO.setUserFullName(user.getFullName());
            orderDTOs.add(orderDTO);
        }

        return orderDTOs;
    }


    @Override
    public OrderDTO getOrderById(int orderId) {
        Optional<Orders> orders = orderRepository.findById(orderId);
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setOrderId(orders.get().getId());
        orderDTO.setTotalPrice(orders.get().getPrice());
        orderDTO.setStatus(orders.get().getStatus());
        orderDTO.setCreateDate(orders.get().getCreateDate());
        orderDTO.setShippingMethod(orders.get().getShippingMethod());
        orderDTO.setDeliveryAddress(orders.get().getDeliveryAddress());
        orderDTO.setRecipientName(orders.get().getRecipientName());
        orderDTO.setRecipientPhone(orders.get().getRecipientPhone());
        orderDTO.setExpectedDeliveryDate(orders.get().getExpectedDeliveryDate());
        orderDTO.setNoteOrder(orders.get().getNoteOrder());
        orderDTO.setUserId(orders.get().getUsers().getId());
        orderDTO.setUserFullName(orders.get().getUsers().getFullName());
        orderDTO.setUserName(orders.get().getUsers().getUserName());
        List<OrderItemDTO> orderItemDTOS = new ArrayList<>();
        for(OrderItem orderItem : orders.get().getOrderItem()){
            OrderItemDTO orderItemDTO = new OrderItemDTO();
            Product product = productRepository.findById(orderItem.getProduct().getId());
            KeyOrderItem keyOrderItem = new KeyOrderItem(orderItem.getOrders().getId(),product.getId());
            orderItemDTO.setKeyOrderItem(keyOrderItem);
            ProductDTO productDTO = new ProductDTO();
            productDTO.setId(product.getId());
            productDTO.setTitle(product.getTitle());
            productDTO.setPrice(product.getPrice());
            productDTO.setImage(product.getImage());
            productDTO.setDescription(product.getDescription());
            productDTO.setStatus(product.getStatus());
            productDTO.setCategoryName(product.getCategory().getNameCate());
            orderItemDTO.setProductDTO(productDTO);
            orderItemDTO.setQuantity(orderItem.getQuantity());
            orderItemDTO.setPrice(orderItem.getPrice());
            orderItemDTO.setNote(orderItem.getNote());
            orderItemDTOS.add(orderItemDTO);
        }
        orderDTO.setOrderItems(orderItemDTOS);
        return orderDTO;
    }

    @Override
    public boolean insertOrder(OrderRequest orderRequest) {
        try {
            Users user = usersRepository.findById(orderRequest.getUserId());
            Orders orders = new Orders();
            orders.setUsers(user);
            orders.setStatus(orderRequest.getStatus());
            orders.setCreateDate(new Timestamp(System.currentTimeMillis()));
            orders.setShippingMethod(orderRequest.getShippingMethod());
            orders.setDeliveryAddress(orderRequest.getDeliveryAddress());
            orders.setRecipientName(orderRequest.getRecipientName());
            orders.setRecipientPhone(orderRequest.getRecipientPhone());
            orders.setExpectedDeliveryDate(orderRequest.getExpectedDeliveryDate());
            orders.setNoteOrder(orderRequest.getNoteOrder());
            Orders savedOrder = orderRepository.save(orders);
            int totalPrice=0;
            for(OrderItemRequest orderItemRequest : orderRequest.getProducts()){
                Product product = productRepository.findById(orderItemRequest.getProductId());
                OrderItem orderItem = new OrderItem();
                KeyOrderItem keyOrderItem = new KeyOrderItem(savedOrder.getId(),product.getId());
                orderItem.setKeyOrderItem(keyOrderItem);
                orderItem.setOrders(savedOrder);
                orderItem.setProduct(product);
                orderItem.setQuantity(orderItemRequest.getQuantity());
                orderItem.setNote(orderItemRequest.getNote());
                orderItem.setCreateDate(new Timestamp(System.currentTimeMillis()));
                totalPrice += product.getPrice() * orderItemRequest.getQuantity();
                orderItemRepository.save(orderItem);
            }
            orders.setPrice(totalPrice);
            orderRepository.save(orders);
            return true;
        }catch (Exception e){
            System.out.println("Error insert order" + e.getMessage());
            return false;
        }
    }

    @Override
    public boolean changStatusOrder(int orderId,int status) {
        Optional<Orders> orders = orderRepository.findById(orderId);
        orders.get().setStatus(status);
        orderRepository.save(orders.get());
        return true;
    }

}
