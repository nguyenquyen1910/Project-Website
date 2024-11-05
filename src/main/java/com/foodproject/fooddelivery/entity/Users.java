package com.foodproject.fooddelivery.entity;

import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;

import java.util.List;
import java.util.Set;

@Entity(name="users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="phone")
    private String userName;

    @Column(name="password")
    private String password;

    @Column(name = "status")
    private Integer status;

    @Column(name="full_name")
    private String fullName;

    @Column(name="join_date")
    private String createDate;

    @ManyToOne
    @JoinColumn(name="user_type")
    private Roles roles;

    @Column(name = "email")
    private String email;

    @Column(name = "address")
    private String address;

    @OneToMany(mappedBy = "users")
    private Set<Orders> listOrders;

    @OneToMany(mappedBy = "users")
    private Set<Cart> listCarts;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }

    public Roles getRoles() {
        return roles;
    }

    public void setRoles(Roles roles) {
        this.roles = roles;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Set<Orders> getListOrders() {
        return listOrders;
    }

    public void setListOrders(Set<Orders> listOrders) {
        this.listOrders = listOrders;
    }

    public Set<Cart> getListCarts() {
        return listCarts;
    }

    public void setListCarts(Set<Cart> listCarts) {
        this.listCarts = listCarts;
    }
}
