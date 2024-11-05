package com.foodproject.fooddelivery.controller;

import com.foodproject.fooddelivery.dto.OrderDTO;
import com.foodproject.fooddelivery.payload.ResponseData;
import com.foodproject.fooddelivery.payload.request.OrderRequest;
import com.foodproject.fooddelivery.service.imp.OrderServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    OrderServiceImp orderServiceImp;

    @GetMapping("/admin/getall")
    public ResponseEntity<?> getAll(){
        ResponseData responseData = new ResponseData();
        List<OrderDTO> orderDTOList = orderServiceImp.getAll();
        responseData.setData(orderDTOList);
        responseData.setSuccess(true);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/get/{userId}")
    public ResponseEntity<?> getOrder(@PathVariable int userId) {
        ResponseData responseData = new ResponseData();
        List<OrderDTO> orderDTOs = orderServiceImp.getAllOrders(userId);
        responseData.setData(orderDTOs);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("details/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable int orderId) {
        ResponseData responseData = new ResponseData();
        OrderDTO orderDTO = orderServiceImp.getOrderById(orderId);
        responseData.setData(orderDTO);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PostMapping("/insert")
    public ResponseEntity<?> insert(@RequestBody OrderRequest orderRequest) {
        ResponseData responseData = new ResponseData();
        boolean isSuccess = orderServiceImp.insertOrder(orderRequest);
        responseData.setData(isSuccess);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PutMapping("/admin/solve/{orderId}")
    public ResponseEntity<?> solveOrder(@PathVariable int orderId,@RequestParam int status) {
        ResponseData responseData = new ResponseData();
        boolean isSuccess = orderServiceImp.changStatusOrder(orderId,status);
        responseData.setData(isSuccess);
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }
}
