package com.example.springbootfullstackapp.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.springbootfullstackapp.model.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
	
	// Custom query to fetch employees with department details
	@Query("SELECT e FROM Employee e JOIN FETCH e.department")
    List<Employee> getAllEmployeesWithDepartments();
	
	@Query("SELECT e FROM Employee e")
    List<Employee> getAllEmployees();

	@Query("SELECT e FROM Employee e JOIN FETCH e.department WHERE e.id = :id")
    Optional<Employee> getEmployeeWithDepartmentById(long id);
	
	 List<Employee> findByDepartmentId(Long departmentId);
	
}