package com.example.springbootfullstackapp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.springbootfullstackapp.model.Department;

//DepartmentRepository.java

public interface DepartmentRepository extends JpaRepository<Department, Long> {
	@Query("SELECT e FROM Department e WHERE e.id = :id")
    Department getDepartmentById(long id);
}
