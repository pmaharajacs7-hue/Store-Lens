package com.store.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByShopId(Long shopId);
    List<Product> findByProNameContainingIgnoreCaseAndShopId(String proName, Long shopId);
    Optional<Product> findByProIdAndShopId(Long proId, Long shopId);
}
