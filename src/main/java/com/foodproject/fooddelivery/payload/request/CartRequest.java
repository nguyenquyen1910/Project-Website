package com.foodproject.fooddelivery.payload.request;

import java.util.List;

public class CartRequest {
    private int userId;
    private List<CartItemRequest> listItems;
    private int status;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public List<CartItemRequest> getListItems() {
        return listItems;
    }

    public void setListItems(List<CartItemRequest> listItems) {
        this.listItems = listItems;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

}
