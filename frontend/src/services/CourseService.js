import axios from 'axios';

const COURSE_API_BASE_URL = "http://localhost:8080/api/v1/courses";
const DEPARTMENT_API_BASE_URL = "http://localhost:8080/api/v1/courses/dep";
const EMPLOYEE_API_BASE_URL = "http://localhost:8080/api/v1/courses/employee";

class CourseService {

    static instance = new CourseService();
    static getInstance() {
        return this.instance;
    }

    getCourses(){
        return axios.get(COURSE_API_BASE_URL);
    }

    createCourse(course){
        return axios.post(COURSE_API_BASE_URL, course);
    }

    getCourseById(courseId){
        return axios.get(COURSE_API_BASE_URL + '/' + courseId);
    }

    updateCourse(course, courseId){
        return axios.put(COURSE_API_BASE_URL + '/' + courseId, course);
    }

    deleteCourse(courseId){
        return axios.delete(COURSE_API_BASE_URL + '/' + courseId);
    }
    getCoursesByDepartment(departmentId){
        return axios.get(DEPARTMENT_API_BASE_URL+'/'+departmentId);
    }
    getEmployeesByCourseId(courseId){
        return axios.get(EMPLOYEE_API_BASE_URL+'/'+courseId); 
    }
}

export default CourseService.getInstance();