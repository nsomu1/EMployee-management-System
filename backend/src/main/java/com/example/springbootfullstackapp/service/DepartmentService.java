package com.example.springbootfullstackapp.service;

import java.util.List;

import com.example.springbootfullstackapp.model.Department;

//DepartmentService.java

public interface DepartmentService {

 List<Department> getAllDepartments();

 Department getDepartmentById(Long id);

 Department createDepartment(Department department);

 Department updateDepartment(Long id, Department department);

 void deleteDepartment(Long id);
}
