package com.store.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.store.dto.AuthDTO.*;
import com.store.dto.AuthDTO.ApiResponse;
import com.store.dto.AuthDTO.EmployeeRegisterRequest;
import com.store.dto.AuthDTO.LoginRequest;
import com.store.dto.AuthDTO.LoginResponse;
import com.store.dto.AuthDTO.OwnerRegisterRequest;
import com.store.entity.Employee;
import com.store.entity.Owner;
import com.store.repository.EmployeeRepository;
import com.store.repository.OwnerRepository;
import com.store.security.jwt.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public ApiResponse registerOwner(OwnerRegisterRequest request) {
        if (ownerRepository.existsByOwnphnum(request.getOwnphnum())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone number already registered");
        }

        Owner owner = new Owner();
        owner.setOwnname(request.getOwnname());
        owner.setOwnphnum(request.getOwnphnum());
        owner.setOwnpassword(passwordEncoder.encode(request.getPassword()));

        Owner saved = ownerRepository.save(owner);
        return new ApiResponse(true, "Owner registered successfully. Your Shop ID is: " + saved.getShopId());
    }

    public ApiResponse registerEmployee(EmployeeRegisterRequest request) {
        // Validate shopId exists
        ownerRepository.findById(request.getShopId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Shop ID"));

        if (employeeRepository.existsByEmpphnum(request.getEmpphnum())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone number already registered");
        }

        Employee employee = new Employee();
        employee.setEmpname(request.getEmpname());
        employee.setEmpphnum(request.getEmpphnum());
        employee.setEmppassword(passwordEncoder.encode(request.getPassword()));
        employee.setShopId(request.getShopId());
        employee.setApproved(false);

        employeeRepository.save(employee);
        return new ApiResponse(true, "Employee registered. Awaiting owner approval.");
    }

    public LoginResponse login(LoginRequest request) {
        if ("OWNER".equalsIgnoreCase(request.getRole())) {
            Owner owner = ownerRepository.findByOwnphnum(request.getPhnum())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

            if (!passwordEncoder.matches(request.getPassword(), owner.getOwnpassword())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
            }

            String token = jwtUtil.generateToken(owner.getOwnphnum(), "OWNER", owner.getShopId());
            return new LoginResponse(token, "OWNER", owner.getShopId(), owner.getOwnname());

        } else if ("EMPLOYEE".equalsIgnoreCase(request.getRole())) {
            Employee employee = employeeRepository.findByEmpphnum(request.getPhnum())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

            if (!passwordEncoder.matches(request.getPassword(), employee.getEmppassword())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
            }

            if (!employee.isApproved()) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account not yet approved by owner");
            }

            String token = jwtUtil.generateToken(employee.getEmpphnum(), "EMPLOYEE", employee.getShopId());
            return new LoginResponse(token, "EMPLOYEE", employee.getShopId(), employee.getEmpname());

        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role specified");
        }
    }
}
