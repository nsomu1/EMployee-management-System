import axios from 'axios';

const EMPLOYEE_API_BASE_URL = "http://localhost:8080/api/v1/employees";
const DEPARTMENT_API_BASE_URL = "http://localhost:8080/api/v1/employees/dep";

class EmployeeService {

    static instance = new EmployeeService();
    static getInstance() {
        return this.instance;
    }
    checkCreds(user){
        return axios.get(EMPLOYEE_API_BASE_URL, user);
    }
    getEmployees(){
        return axios.get(EMPLOYEE_API_BASE_URL);
    }

    createEmployee(employee){
        return axios.post(EMPLOYEE_API_BASE_URL, employee);
    }

    getEmployeeById(employeeId){
        return axios.get(EMPLOYEE_API_BASE_URL + '/' + employeeId);
    }

    updateEmployee(employee, employeeId){
        return axios.put(EMPLOYEE_API_BASE_URL + '/' + employeeId, employee);
    }

    deleteEmployee(employeeId){
        return axios.delete(EMPLOYEE_API_BASE_URL + '/' + employeeId);
    }
    getEmployeesByDepartment(departmentId){
        return axios.get(DEPARTMENT_API_BASE_URL+'/'+departmentId)
    }
    
}

export default EmployeeService.getInstance();