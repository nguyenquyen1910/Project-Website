package com.foodproject.fooddelivery.service.imp;

import com.foodproject.fooddelivery.dto.OrderDTO;
import com.foodproject.fooddelivery.payload.request.OrderRequest;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

public interface OrderServiceImp {
    List<OrderDTO> getAll();
    List<OrderDTO> getAllOrders(int userId);
    OrderDTO getOrderById(int orderId);
    boolean insertOrder(OrderRequest orderRequest);
    boolean changStatusOrder(int orderId,int status);
}
