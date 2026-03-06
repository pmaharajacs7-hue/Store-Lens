package com.store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductDTO {
    private Long proId;
    private String proName;
    private String pro_location;
    private Double pro_amount;
    private Integer pro_count;
    private String stockStatus; // IN_STOCK, LOW_STOCK, OUT_OF_STOCK
    public ProductDTO(Long proId, String proName, String pro_location,Double pro_amount, Integer pro_count, String stockStatus) {
        this.proId = proId;
        this.proName = proName;
        this.pro_location = pro_location;
        this.pro_amount = pro_amount;
        this.pro_count = pro_count;
        this.stockStatus = stockStatus;
    }
}
