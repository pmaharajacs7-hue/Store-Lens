package com.store.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.store.dto.AuthDTO.*;
import com.store.dto.AuthDTO.ApiResponse;
import com.store.dto.AuthDTO.EmployeeRegisterRequest;
import com.store.dto.AuthDTO.LoginRequest;
import com.store.dto.AuthDTO.LoginResponse;
import com.store.dto.AuthDTO.OwnerRegisterRequest;
import com.store.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController{

    @Autowired
    private AuthService authService;

    @PostMapping("/register/owner")
    public ResponseEntity<ApiResponse> registerOwner(@RequestBody OwnerRegisterRequest request) {
        return ResponseEntity.ok(authService.registerOwner(request));
    }

    @PostMapping("/register/employee")
    public ResponseEntity<ApiResponse> registerEmployee(@RequestBody EmployeeRegisterRequest request) {
        return ResponseEntity.ok(authService.registerEmployee(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}