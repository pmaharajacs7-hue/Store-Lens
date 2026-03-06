package com.store.controller;

import com.store.dto.SaleDTO;
import com.store.entity.Sale;
import com.store.repository.ProductRepository;
import com.store.repository.SalesRepository;
import com.store.security.jwt.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sales")
public class SalesController {

    @Autowired private SalesRepository salesRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private JwtUtil jwtUtil;

    @GetMapping("/chart")
    public SaleDTO getChart(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        Long shopId = jwtUtil.extractShopId(token);

        // Last 10 days
        LocalDate today = LocalDate.now();
        LocalDate from = today.minusDays(9);

        List<Sale> sales = salesRepository
            .findByShopIdAndDateGreaterThanEqual(shopId, from);

        // Build date labels
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd");
        String[] dates = new String[10];
        LocalDate[] days = new LocalDate[10];
        for (int i = 0; i < 10; i++) {
            days[i] = from.plusDays(i);
            dates[i] = days[i].format(fmt);
        }

        // Group sales by productId
        Map<Long, List<Sale>> byProduct = sales.stream()
            .collect(Collectors.groupingBy(Sale::getProductId));

        List<SaleDTO.ProductSeries> series = new ArrayList<>();

        for (Map.Entry<Long, List<Sale>> entry : byProduct.entrySet()) {
            Long productId = entry.getKey();
            List<Sale> productSales = entry.getValue();

            // Get product name
            String name = productRepository.findById(productId)
                .map(p -> p.getProName()).orElse("Product " + productId);

            // Map date -> total quantity
       Map<LocalDate, Double> amountByDate = new HashMap<>();
for (Sale s : productSales) {
    amountByDate.merge(s.getDate(), s.getAmount(), Double::sum);
}

double[] amount = new double[10];
for (int i = 0; i < 10; i++) {
    amount[i] = amountByDate.getOrDefault(days[i], 0.0);
}

series.add(new SaleDTO.ProductSeries(name, amount));
        }

        return new SaleDTO(dates, series);
    }
}
