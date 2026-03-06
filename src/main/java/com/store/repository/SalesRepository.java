package com.store.repository;

import com.store.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface SalesRepository extends JpaRepository <Sale, Long> {

    List<Sale> findByShopIdAndDateGreaterThanEqual(Long shopId, LocalDate fromDate);
}
