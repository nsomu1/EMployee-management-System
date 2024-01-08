import axios from 'axios';

const BASE_URL = "http://localhost:8080/api/v1/departments";

class DepartmentService {

    static instance = new DepartmentService();
    static getInstance() {
        return this.instance;
    }
    getAllDepartments(){
        return axios.get(BASE_URL);
    }
    
    createDepartment(department){
        return axios.post(BASE_URL, department);
    }

    getDepartmentById(depId){
        return axios.get(BASE_URL + '/' + depId);
    }
    updateDepartment(department, departmentId){
        return axios.put(BASE_URL + '/' + departmentId, department);
    }

    deleteDepartment(departmentId){
        return axios.delete(BASE_URL + '/' + departmentId);
    }
}

export default DepartmentService.getInstance();