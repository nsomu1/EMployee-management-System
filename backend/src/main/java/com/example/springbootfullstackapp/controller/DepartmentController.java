package com.example.springbootfullstackapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springbootfullstackapp.model.Department;
import com.example.springbootfullstackapp.service.DepartmentService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class DepartmentController {

 @Autowired
 private DepartmentService departmentService;

 @GetMapping("departments")
 public List<Department> getAllDepartments() {
     return departmentService.getAllDepartments();
 }

 @GetMapping("departments/{id}")
 public Department getDepartmentById(@PathVariable Long id) {
     return departmentService.getDepartmentById(id);
 }

 @PostMapping("departments")
 public Department createDepartment(@RequestBody Department department) {
     return departmentService.createDepartment(department);
 }

 @PutMapping("departments/{id}")
 public Department updateDepartment(@PathVariable Long id, @RequestBody Department department) {
     return departmentService.updateDepartment(id, department);
 }

 @DeleteMapping("departments/{id}")
 public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
     departmentService.deleteDepartment(id);
     return ResponseEntity.ok("Department deleted");
 }
}
