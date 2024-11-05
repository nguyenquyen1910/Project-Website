package com.foodproject.fooddelivery.entity.keys;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.ManyToOne;

import java.io.Serializable;

@Embeddable
public class KeyOrderItem implements Serializable {
    @Column(name = "order_id")
    private int orderId;

    @Column(name = "product_id")
    private int productId;

    public KeyOrderItem() {}

    public KeyOrderItem(int orderId, int foodId) {
        this.orderId = orderId;
        this.productId = foodId;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }
}
