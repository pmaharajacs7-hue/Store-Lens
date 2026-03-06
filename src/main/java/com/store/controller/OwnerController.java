package com.store.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.store.dto.AuthDTO.ApiResponse;
import com.store.entity.Employee;
import com.store.entity.Owner;
import com.store.service.OwnerService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/owner")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    private Long getShopId(HttpServletRequest request) {
        return (Long) request.getAttribute("shopId");
    }

    @GetMapping("/details")
    public ResponseEntity<Owner> getOwnerDetails(HttpServletRequest request) {
        Owner owner = ownerService.getOwnerDetails(getShopId(request));
        owner.setOwnpassword(null); // Never expose password
        return ResponseEntity.ok(owner);
    }

    @GetMapping("/employees/pending")
    public ResponseEntity<List<Employee>> getPendingEmployees(HttpServletRequest request) {
        List<Employee> employees = ownerService.getPendingEmployees(getShopId(request));
        employees.forEach(e -> e.setEmppassword(null)); // Never expose passwords
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees(HttpServletRequest request) {
        List<Employee> employees = ownerService.getAllEmployees(getShopId(request));
        employees.forEach(e -> e.setEmppassword(null));
        return ResponseEntity.ok(employees);
    }

    @PostMapping("/employees/{empId}/approve")
    public ResponseEntity<ApiResponse> approveEmployee(@PathVariable Long empId, HttpServletRequest request) {
        ownerService.approveEmployee(empId, getShopId(request));
        return ResponseEntity.ok(new ApiResponse(true, "Employee approved successfully"));
    }

    @DeleteMapping("/employees/{empId}/reject")
    public ResponseEntity<ApiResponse> rejectEmployee(@PathVariable Long empId, HttpServletRequest request) {
        ownerService.rejectEmployee(empId, getShopId(request));
        return ResponseEntity.ok(new ApiResponse(true, "Employee rejected and removed"));
    }
}