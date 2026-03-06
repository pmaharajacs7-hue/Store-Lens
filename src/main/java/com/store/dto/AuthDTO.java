package com.store.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// ========== REQUEST DTOs ==========

public class AuthDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OwnerRegisterRequest {
        private String ownname;
        private String ownphnum;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmployeeRegisterRequest {
        private String empname;
        private String empphnum;
        private String password;
        private Long shopId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String phnum;
        private String password;
        private String role; // OWNER or EMPLOYEE
    }

    // ========== RESPONSE DTOs ==========

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private String token;
        private String role;
        private Long shopId;
        private String name;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApiResponse {
        private boolean success;
        private String message;
        private Object data;

        public ApiResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }
    }
}