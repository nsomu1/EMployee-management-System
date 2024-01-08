import React, { useState, useEffect } from 'react';
import EmployeeService from '../../services/EmployeeService';
import DepartmentService from '../../services/DepartmentService'; 
import './ViewCourseComponent.css'; 
import CourseService from '../../services/CourseService';

const ViewCourseComponent = () => {
    const courseId = window.location.pathname.split('/').pop();
    const [course, setCourse] = useState({});
    const [department, setDepartment] = useState({}); // State to store department details
    const [employee, setEmployee] = useState({}); // State to store department details
    useEffect(() => {
        const fetchCourse= async () => {
            try {
                const res = await CourseService.getCourseById(courseId);
                setCourse(res.data);

                // Fetch department details using DepartmentService
                if (res.data.department) {
                    const departmentRes = await DepartmentService.getDepartmentById(res.data.department.id);
                    setDepartment(departmentRes.data);
                }
                // Fetch department details using DepartmentService
                if (res.data.employee) {
                    const employeeRes = await EmployeeService.getEmployeeById(res.data.employee.id);
                    setEmployee(employeeRes.data);
                }
            } catch (error) {
                console.error('Error fetching course: ', error);
            }
        };

        fetchCourse();
    }, [courseId]);
    
    return (
        <div className="view-employee-container"> 
            <br></br>
            <div className="card col-md-6 offset-md-3">
                <h3 className="text-center"> Course Details</h3>
                <div className="card-body">
                    <div className="row">
                        <label> Course Name: </label>
                        <div> {course.name}</div>
                    </div>
                    <div className="row">
                        <label> Department: </label>
                        <div> {department.name || 'N/A'}</div> {/* Display department name or 'N/A' if not available */}
                    </div>
                    <div className="row">
                        <label> Employee: </label>
                        <div> {employee.name || 'N/A'}</div> {/* Display department name or 'N/A' if not available */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewCourseComponent;