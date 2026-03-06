package com.store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "owner_details")
public class Owner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long shopId;

    @Column(nullable = false)
    private String ownname;

    @Column(nullable = false, unique = true)
    private String ownphnum;

    @Column(nullable = false)
    private String ownpassword;

    // Getter and Setter

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public String getOwnname() {
        return ownname;
    }

    public void setOwnname(String ownname) {
        this.ownname = ownname;
    }

    public String getOwnphnum() {
        return ownphnum;
    }

    public void setOwnphnum(String ownphnum) {
        this.ownphnum = ownphnum;
    }

    public String getOwnpassword() {
        return ownpassword;
    }

    public void setOwnpassword(String ownpassword) {
        this.ownpassword = ownpassword;
    }
}