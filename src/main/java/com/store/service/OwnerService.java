package com.store.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.store.entity.Employee;
import com.store.entity.Owner;
import com.store.repository.EmployeeRepository;
import com.store.repository.OwnerRepository;

@Service
public class OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Owner getOwnerDetails(Long shopId) {
        return ownerRepository.findById(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found"));
    }

    public List<Employee> getPendingEmployees(Long shopId) {
        return employeeRepository.findByShopIdAndApproved(shopId, false);
    }

    public List<Employee> getAllEmployees(Long shopId) {
        return employeeRepository.findByShopId(shopId);
    }

    public Employee approveEmployee(Long empId, Long shopId) {
        Employee emp = employeeRepository.findById(empId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        if (!emp.getShopId().equals(shopId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot approve employee from another shop");
        }

        emp.setApproved(true);
        return employeeRepository.save(emp);
    }

    public void rejectEmployee(Long empId, Long shopId) {
        Employee emp = employeeRepository.findById(empId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));

        if (!emp.getShopId().equals(shopId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot reject employee from another shop");
        }

        employeeRepository.delete(emp);
    }
}
