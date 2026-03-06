package com.store.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.store.entity.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmpphnum(String empphnum);
    boolean existsByEmpphnum(String empphnum);
    List<Employee> findByShopIdAndApproved(Long shopId, boolean approved);
    List<Employee> findByShopId(Long shopId);
}
