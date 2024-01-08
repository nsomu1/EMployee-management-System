import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentService from '../../services/DepartmentService';
import CourseService from '../../services/CourseService';
import EmployeeService from '../../services/EmployeeService';

const CreateCourseComponent = () => {
  const courseId = window.location.pathname.split('/').pop();
  const navigate = useNavigate();

  const [state, setState] = useState({
    id: '',
    courseName: '',
    departmentId: '',
    employeeId: '',
  });

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {

    DepartmentService.getAllDepartments().then((res) => {
      setDepartments(res.data || []);
    });

    // Fetch employees (initially for the first department)
    if (departments.length > 0) {
      fetchEmployeesByDepartment(departments[0].id);
    }

     if (courseId === '_add') {
      return;
         } else {
            CourseService.getCourseById(courseId)
        .then((res) => {
          const course = res.data;
          setState((prevState) => ({
            ...prevState,
            id: course.id,
            courseName: course.courseName,
            departmentId: course.department ? course.department.id : '',
            employeeId: course.employee ? course.employee.id : '',
          }));
          fetchEmployeesByDepartment(course.department.id);
          
        })
        .catch((error) => {
          console.error('Error fetching course:', error);
        });
    }
   
  }, [courseId]); // Add setState to the dependency array

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "departmentId") {
      fetchEmployeesByDepartment(value);
    }

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setState({ ...state, departmentId });

    // Fetch employees for the selected department
    fetchEmployeesByDepartment(departmentId);

    // Set employeeId to the first employee in the list (if available)
    const firstEmployee = employees[0];
    if (firstEmployee) {
      setState((prevState) => ({
        ...prevState,
        employeeId: firstEmployee.id,
      }));
    }
  };

  const fetchEmployeesByDepartment = (departmentId) => {
    EmployeeService.getEmployeesByDepartment(departmentId).then((res) => {
      setEmployees(res.data || []);
    });
  };

  const saveOrUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      const course = {
        courseName: state.courseName,
        departmentId: state.departmentId,
        employeeId: state.employeeId,
      };

      if (courseId !== '_add') {
        await CourseService.updateCourse(course, state.id);
      } else {
        await CourseService.createCourse(course);
      }
      navigate('/courses');
    } catch (error) {
      console.error('Error saving/updating course: ', error);
    }
  };

  const cancel = () => {
    navigate('/courses');
  };

  return (
    <div>
      <br />
      <div className="container">
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            <h3 className="text-center">{state.id ? 'Update Course' : 'Add Course'}</h3>
            <div className="card-body">
              <form>
              <div className="form-group">
          <label>Course Name:</label>
          <input
            type="text"
            name="courseName"
            value={state.courseName}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Department:</label>
          <select onChange={handleDepartmentChange} required>
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Employee:</label>
          <select
            name="employeeId"
            value={state.employeeId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.firstName} {employee.lastName}
              </option>
            ))}
          </select>
        </div>

                <button className="btn btn-success" onClick={saveOrUpdateCourse}>
                  Save
                </button>
                <button className="btn btn-danger" onClick={cancel} style={{ marginLeft: '10px' }}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseComponent;