package com.store.service;

import com.store.repository.SalesRepository;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import com.store.entity.Sale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import com.opencsv.CSVReader;
import com.store.dto.ProductDTO;
import com.store.entity.Product;
import com.store.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private SalesRepository saleRepository;
    
    private String getStockStatus(int count) {
        if (count == 0) return "OUT_OF_STOCK";
        if (count <= 5) return "LOW_STOCK";
        return "IN_STOCK";
    }

    private ProductDTO toDTO(Product p) {
        return new ProductDTO(
                p.getProId(),
                p.getProName(),
                p.getPro_location(),
                p.getPro_amount(),
                p.getPro_count(),
                getStockStatus(p.getPro_count())
        );
    }

    public ProductDTO createProduct(Product product, Long shopId) {
        product.setShopId(shopId); // Always override with JWT shopId
        product.setProId(null);
        Product saved = productRepository.save(product);
        return toDTO(saved);
    }

    public ProductDTO updateProduct(Long proId, Product updatedData, Long shopId) {
        Product existing = productRepository.findByProIdAndShopId(proId, shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Product not found or access denied"));

        existing.setProName(updatedData.getProName());
        existing.setPro_location(updatedData.getPro_location());
        existing.setPro_amount(updatedData.getPro_amount());
        existing.setPro_count(updatedData.getPro_count());
        existing.setShopId(shopId); // Enforce shopId from JWT

        return toDTO(productRepository.save(existing));
    }

    public void deleteProduct(Long proId, Long shopId) {
        Product existing = productRepository.findByProIdAndShopId(proId, shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Product not found or access denied"));
        productRepository.delete(existing);
    }

    public List<ProductDTO> getAllProducts(Long shopId) {
        return productRepository.findByShopId(shopId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ProductDTO> searchProducts(String query, Long shopId) {
        return productRepository.findByProNameContainingIgnoreCaseAndShopId(query, shopId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ProductDTO> uploadCSV(MultipartFile file, Long shopId) {
        List<ProductDTO> saved = new ArrayList<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            String[] line;
            boolean firstLine = true;
            while ((line = reader.readNext()) != null) {
                if (firstLine) { firstLine = false; continue; } // skip header
                if (line.length < 4) continue;

                Product p = new Product();
                p.setProName(line[0].trim());
                p.setPro_location(line[1].trim());
                p.setPro_amount(Double.parseDouble(line[2].trim()));
                p.setPro_count(Integer.parseInt(line[3].trim()));
                p.setShopId(shopId);

                saved.add(toDTO(productRepository.save(p)));
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid CSV format: " + e.getMessage());
        }
        return saved;
    }
public ProductDTO sellProduct(Long proId, int quantity, Long shopId) {

    Product product = productRepository
            .findByProIdAndShopId(proId, shopId)
            .orElseThrow(() ->
                    new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

    if (product.getPro_count() == 0) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product is out of stock");
    }

    if (quantity <= 0) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be greater than 0");
    }

    if (quantity > product.getPro_count()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Not enough stock. Available: " + product.getPro_count());
    }

    // reduce stock
    product.setPro_count(product.getPro_count() - quantity);
        // calculate final amount
    Double finalAmount = quantity * product.getPro_amount();

    // create sale record
    Sale sale = new Sale();
    sale.setProductId(product.getProId());
    sale.setShopId(product.getShopId());
    sale.setQuantity(product.getPro_count());
    sale.setAmount(finalAmount);
    sale.setDate(LocalDate.now());
    saleRepository.save(sale);
    productRepository.save(product);

    return toDTO(product);
}
}
