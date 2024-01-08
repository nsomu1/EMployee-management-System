import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeService from '../../services/EmployeeService';
import DepartmentService from '../../services/DepartmentService';

const CreateEmployeeComponent = () => {
  const employeeId = window.location.pathname.split('/').pop();
  const navigate = useNavigate();

  const [state, setState] = useState({
    id: '',
    firstName: '',
    lastName: '',
    emailId: '',
    departmentId: '',
    departmentName: '',
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    DepartmentService.getAllDepartments()
      .then((res) => {
        console.log('Departments Response:', res); // Log the entire response
        console.log('Departments Data:', res.data); // Log only the data
        setDepartments((res.data || [])); // Use res.data directly
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
        setDepartments([]); // Set departments to an empty array in case of an error
      });

    if (employeeId === '_add') {
      return;
    } else {
      EmployeeService.getEmployeeById(employeeId)
        .then((res) => {
          const employee = res.data;
          setState((prevState) => ({
            ...prevState,
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            emailId: employee.emailId,
            departmentId: employee.department ? employee.department.id : '',
            departmentName: employee.department ? employee.department.name : '',
          }));
        })
        .catch((error) => {
          console.error('Error fetching employee:', error);
        });
    }
  }, [employeeId, setState]); // Add setState to the dependency array

  const saveOrUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      const employee = {
        firstName: state.firstName,
        lastName: state.lastName,
        emailId: state.emailId,
        departmentId: state.departmentId,
      };
   console.log(employee.firstName);
   console.log(employee.departmentId);

      if (employeeId !== '_add') {
        await EmployeeService.updateEmployee(employee, state.id);
      } else {
        await EmployeeService.createEmployee(employee);
      }
      navigate('/employees');
    } catch (error) {
      console.error('Error saving/updating employee: ', error);
    }
  };

  const cancel = () => {
    navigate('/employees');
  };

  const changeFirstNameHandler = (event) => {
    setState((prevState) => ({ ...prevState, firstName: event.target.value }));
  };

  const changeLastNameHandler = (event) => {
    setState((prevState) => ({ ...prevState, lastName: event.target.value }));
  };

  const changeEmailHandler = (event) => {
    setState((prevState) => ({ ...prevState, emailId: event.target.value }));
  };

  const changeDepartmentHandler = (event) => {
    setState((prevState) => ({ ...prevState, departmentId: event.target.value }));
  };

  return (
    <div>
      <br />
      <div className="container">
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            <h3 className="text-center">{state.id ? 'Update Employee' : 'Add Employee'}</h3>
            <div className="card-body">
              <form>
                <div className="form-group">
                  <label>First Name:</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    value={state.firstName}
                    onChange={changeFirstNameHandler}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name:</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    value={state.lastName}
                    onChange={changeLastNameHandler}
                  />
                </div>
                <div className="form-group">
                  <label>Email Id:</label>
                  <input
                    type="email"
                    name="emailId"
                    className="form-control"
                    value={state.emailId}
                    onChange={changeEmailHandler}
                  />
                </div>
                <div className="form-group">
                  <label>Department:</label>
                  <select
                    name="departmentId"
                    className="form-control"
                    value={state.departmentId}
                    onChange={changeDepartmentHandler}
                  >
                    <option value={state.departmentName || ''}>Select Department</option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="btn btn-success" onClick={saveOrUpdateEmployee}>
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

export default CreateEmployeeComponent;