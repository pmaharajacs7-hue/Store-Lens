package com.store.dto;

import java.util.List;

public class SaleDTO {
    public String[] dates;
    public List<ProductSeries> products;

    public static class ProductSeries {
        public String name;
        public double[] amount;
        public ProductSeries(String name, double[] amount) {
            this.name = name;
           this.amount=amount;
        }
            public String getName() {
            return name;
    }

        public double[] getAmount() {   // ← change here
            return amount;
    }
    }
    public SaleDTO(String[] dates, List<ProductSeries> products) {
        this.dates = dates;
        this.products = products;
    }

}
