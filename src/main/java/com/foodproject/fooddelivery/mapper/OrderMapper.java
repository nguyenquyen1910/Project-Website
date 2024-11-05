package com.foodproject.fooddelivery.mapper;

import com.foodproject.fooddelivery.dto.OrderDTO;
import com.foodproject.fooddelivery.dto.OrderItemDTO;
import com.foodproject.fooddelivery.dto.ProductDTO;
import com.foodproject.fooddelivery.entity.OrderItem;
import com.foodproject.fooddelivery.entity.Orders;
import com.foodproject.fooddelivery.entity.Product;
import com.foodproject.fooddelivery.entity.keys.KeyOrderItem;
import com.foodproject.fooddelivery.repository.ProductRepository;
import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring")
public class OrderMapper {

    @Autowired
    ProductRepository productRepository;

    public OrderDTO toOrderDTO(Orders orders) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setOrderId(orders.getId());
        orderDTO.setTotalPrice(orders.getPrice());
        orderDTO.setStatus(orders.getStatus());
        orderDTO.setCreateDate(orders.getCreateDate());
        orderDTO.setShippingMethod(orders.getShippingMethod());
        orderDTO.setDeliveryAddress(orders.getDeliveryAddress());
        orderDTO.setRecipientName(orders.getRecipientName());
        orderDTO.setRecipientPhone(orders.getRecipientPhone());
        orderDTO.setExpectedDeliveryDate(orders.getExpectedDeliveryDate());
        orderDTO.setNoteOrder(orders.getNoteOrder());

        List<OrderItemDTO> orderItemDTOS = new ArrayList<>();
        for (OrderItem orderItem : orders.getOrderItem()) {
            orderItemDTOS.add(toOrderItemDTO(orderItem));
        }
        orderDTO.setOrderItems(orderItemDTOS);

        return orderDTO;
    }

    public OrderItemDTO toOrderItemDTO(OrderItem orderItem) {
        OrderItemDTO orderItemDTO = new OrderItemDTO();
        Product product = productRepository.findById(orderItem.getProduct().getId());
        KeyOrderItem keyOrderItem = new KeyOrderItem(orderItem.getOrders().getId(), product.getId());
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

        return orderItemDTO;
    }
}
