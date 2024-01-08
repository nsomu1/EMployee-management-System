package com.example.springbootfullstackapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.springbootfullstackapp.model.Department;
import com.example.springbootfullstackapp.repository.DepartmentRepository;

@Service
public class DepartmentServiceImpl implements DepartmentService {

 @Autowired
 private DepartmentRepository departmentRepository;

 @Override
 public List<Department> getAllDepartments() {
     return departmentRepository.findAll();
 }

 @Override
 public Department getDepartmentById(Long id) {
     return departmentRepository.findById(id)
             .orElseThrow(() -> new RuntimeException("Department not found"));
 }

 @Override
 public Department createDepartment(Department department) {
     return departmentRepository.save(department);
 }

 @Override
 public Department updateDepartment(Long id, Department department) {
     // Check if the department exists
     getDepartmentById(id);

     department.setId(id);
     return departmentRepository.save(department);
 }

 @Override
 public void deleteDepartment(Long id) {
     departmentRepository.deleteById(id);
 }
}
