package com.store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_details")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long proId;

    @Column(nullable = false)
    private String proName;

    @Column(nullable = false)
    private String pro_location;

    @Column(nullable = false)
    private Double pro_amount;

    @Column(nullable = false)
    private Integer pro_count;

    @Column(nullable = false)
    private Long shopId;

    // Getter and Setter

    public Long getProId() {
        return proId;
    }

    public void setProId(Long proId) {
        this.proId = proId;
    }

    public String getProName() {
        return proName;
    }

    public void setProName(String proName) {
        this.proName = proName;
    }

    public String getPro_location() {
        return pro_location;
    }

    public void setPro_location(String pro_location) {
        this.pro_location = pro_location;
    }

    public Double getPro_amount() {
        return pro_amount;
    }

    public void setPro_amount(Double pro_amount) {
        this.pro_amount = pro_amount;
    }

    public Integer getPro_count() {
        return pro_count;
    }

    public void setPro_count(Integer pro_count) {
        this.pro_count = pro_count;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }
}