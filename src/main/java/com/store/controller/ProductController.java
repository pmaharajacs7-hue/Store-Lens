package com.store.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.store.dto.AuthDTO.ApiResponse;
import com.store.dto.ProductDTO;
import com.store.entity.Product;
import com.store.security.jwt.JwtUtil;
import com.store.service.ProductService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private JwtUtil jwtUtil;

    private Long getShopId(HttpServletRequest request) {
        return (Long) request.getAttribute("shopId");
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts(HttpServletRequest request) {
        return ResponseEntity.ok(productService.getAllProducts(getShopId(request)));
    }

    @PostMapping("/create")
    public ResponseEntity<ProductDTO> createProduct(@RequestBody Product product, HttpServletRequest request) {
        return ResponseEntity.ok(productService.createProduct(product, getShopId(request)));
    }

    @PutMapping("/update/{proId}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long proId,
                                                     @RequestBody Product product,
                                                     HttpServletRequest request) {
        return ResponseEntity.ok(productService.updateProduct(proId, product, getShopId(request)));
    }

    @DeleteMapping("/delete/{proId}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long proId, HttpServletRequest request) {
        productService.deleteProduct(proId, getShopId(request));
        return ResponseEntity.ok(new ApiResponse(true, "Product deleted successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String query,
                                                            HttpServletRequest request) {
        return ResponseEntity.ok(productService.searchProducts(query, getShopId(request)));
    }


    @PostMapping("/upload-csv")
    public ResponseEntity<List<ProductDTO>> uploadCSV(@RequestParam("file") MultipartFile file,
                                                       HttpServletRequest request) {
        return ResponseEntity.ok(productService.uploadCSV(file, getShopId(request)));
    }
  @PostMapping("/sell/{proId}")
public ResponseEntity<ProductDTO> sellProduct(
        @PathVariable Long proId,
        @RequestBody Map<String, Integer> body,
        HttpServletRequest request) {
    int quantity = body.getOrDefault("quantity", 0);
    return ResponseEntity.ok(productService.sellProduct(proId, quantity, getShopId(request)));
}
}