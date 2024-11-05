package com.foodproject.fooddelivery.entity;

import com.foodproject.fooddelivery.entity.keys.KeyOrderItem;
import jakarta.persistence.*;

import java.util.Date;

@Entity(name = "order_item")
public class OrderItem {
    @EmbeddedId
    private KeyOrderItem keyOrderItem;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "price")
    private int price;

    @Column(name = "note")
    private String note;

    @ManyToOne
    @JoinColumn(name = "order_id",insertable = false, updatable = false)
    private Orders orders;

    @ManyToOne
    @JoinColumn(name = "product_id",insertable = false,updatable = false)
    private Product product;

    @Column(name = "create_date")
    private Date createDate;

    public KeyOrderItem getKeyOrderItem() {
        return keyOrderItem;
    }

    public void setKeyOrderItem(KeyOrderItem keyOrderItem) {
        this.keyOrderItem = keyOrderItem;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Orders getOrders() {
        return orders;
    }

    public void setOrders(Orders orders) {
        this.orders = orders;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }
}
