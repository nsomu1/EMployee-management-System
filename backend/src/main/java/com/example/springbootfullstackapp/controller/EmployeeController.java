package com.example.springbootfullstackapp.controller;

import java.util.Map;
import java.util.Optional;
import java.util.HashMap;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springbootfullstackapp.exception.ResourceNotFoundException;
import com.example.springbootfullstackapp.model.Department;
import com.example.springbootfullstackapp.model.Employee;
import com.example.springbootfullstackapp.model.LoginForm;
import com.example.springbootfullstackapp.model.User;
import com.example.springbootfullstackapp.repository.DepartmentRepository;
import com.example.springbootfullstackapp.repository.EmployeeRepository;
import com.example.springbootfullstackapp.repository.UserRepository;
import com.example.springbootfullstackapp.service.DepartmentService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class EmployeeController {
	
	private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);


	@Autowired
	private EmployeeRepository employeeRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
    private DepartmentRepository departmentRepository;
	@Autowired
    private DepartmentService departmentService;

	
	@PostMapping("/login")
    public ResponseEntity<Map<String, Object>> authenticateUser(
            @RequestBody LoginForm loginRequest,
            HttpSession session
    ) {
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getPassword().equals(loginRequest.getPassword())) {
                // Authentication successful
                System.out.println("Passwords match!");

                // Set user information in the session
                session.setAttribute("userId", user.getId());
                session.setAttribute("username", user.getUsername());

                Map<String, Object> responseMap = new HashMap<>();
                responseMap.put("success", true);
                responseMap.put("user", user);
                return ResponseEntity.ok(responseMap);
            }
        }

        // Authentication failed
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("success", false);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseMap);
    }
	
	// get all employees
		@GetMapping("/employees")
		public List<Employee> getAllEmployees(){
			return employeeRepository.getAllEmployees();
		}
		
		
		@PostMapping("/employees")
	    public ResponseEntity<Employee> createEmployee(@RequestBody Map<String, Object> employeeDetails) {
	        try {
	            // Extract employee details
	            String firstName = (String) employeeDetails.get("firstName");
	            String lastName = (String) employeeDetails.get("lastName");
	            String emailId = (String) employeeDetails.get("emailId");
	            System.out.println(employeeDetails);
	            // Extract department details
	            logger.info("Department ID: {}");
	            //Long departmentId = (Long) employeeDetails.get("departmentId");
	            //System.out.println(departmentId);
	            //logger.info("Department ID: {}", departmentId);
	            long longValue = 0;
	            String departmentIdObj = (String) employeeDetails.get("departmentId");
	          
	                // Parse the string to a long
	            longValue = Long.parseLong(departmentIdObj);

	            System.out.println(longValue);
	            logger.info("Department ID: {}", longValue);
	            // Create an employee object
	            Employee employee = new Employee(firstName, lastName, emailId);

	            // Fetch the department by ID
	            Optional<Department> optionalDepartment = departmentRepository.findById(longValue);
	            if (optionalDepartment.isPresent()) {
	                Department department = optionalDepartment.get();
	                employee.setDepartment(department);
	            } else {
	                // Handle the case where the department is not found
	                // You can throw an exception or handle it based on your requirements
	                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	            }

	            // Save the employee
	            Employee savedEmployee = employeeRepository.save(employee);

	            // Fetch the saved employee with its associated department
	            Optional<Employee> employeeWithDepartment = employeeRepository.getEmployeeWithDepartmentById(savedEmployee.getId());

	            // Return the employee with the associated department
	            return new ResponseEntity<>(employeeWithDepartment.orElse(null), HttpStatus.CREATED);
	        } catch (Exception e) {
	            // Handle exceptions
	            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
	        }
	    }
	// get employee by id
	@GetMapping("/employees/{id}")
	public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
		Employee employee = employeeRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Employee does not found with id :" + id));
		return ResponseEntity.ok(employee);

	}
	// get employee by id
		@GetMapping("/employees/dep/{id}")
		public ResponseEntity<List<Employee>> getEmployeesByDepartmentId(@PathVariable Long id) {
			
			try {
	            // Fetch employees by department ID
	            List<Employee> employees = employeeRepository.findByDepartmentId(id);

	            // Return the list of employees
	            return new ResponseEntity<>(employees, HttpStatus.OK);
	        } catch (Exception e) {
	            // Handle exceptions
	            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
	        }

		}

	// update employee by id
	@PutMapping("/employees/{id}")
	public ResponseEntity<Employee> updateEmployeeById(@PathVariable Long id, @RequestBody Map<String, Object> employeeDetails) {
		Employee employee = employeeRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Employee does not found with id :" + id));
		
		employee.setFirstName((String) employeeDetails.get("firstName"));
		employee.setLastName((String) employeeDetails.get("lastName"));
		employee.setEmailId((String) employeeDetails.get("emailId"));
		long longValue = 0;
        String departmentIdObj = (String) employeeDetails.get("departmentId");
        longValue = Long.parseLong(departmentIdObj);
        Optional<Department> optionalDepartment = departmentRepository.findById(longValue);
        if (optionalDepartment.isPresent()) {
            Department department = optionalDepartment.get();
            employee.setDepartment(department);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        
		Employee updatedEmployee = employeeRepository.save(employee);
		return ResponseEntity.ok(updatedEmployee);

	}
   //delete employee by id
	@DeleteMapping("/employees/{id}")
	public ResponseEntity<Map<String, Boolean>> deleteEmployee(@PathVariable Long id) {
		Employee employee = employeeRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Employee not exist with id :" + id));

		employeeRepository.delete(employee);
		Map<String, Boolean> response = new HashMap<>();
		response.put("deleted", Boolean.TRUE);
		return ResponseEntity.ok(response);
	}
	
	@PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request, HttpServletResponse response) {
        request.getSession().invalidate();

        SecurityContextHolder.clearContext();

        return ResponseEntity.ok("Logout successful!");
    }

}
