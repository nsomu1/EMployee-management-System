import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

const UpdateEmployeeComponent = () => {
    const [state, setState] = useState({
        id: '',
        firstName: '',
        lastName: '',
        emailId: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const employeeId = window.location.pathname.split('/').pop();

        EmployeeService.getEmployeeById(employeeId).then((res) => {
            const employee = res.data;
            setState({
                id: employee.id,
                firstName: employee.firstName,
                lastName: employee.lastName,
                emailId: employee.emailId
            });
        });
    }, []);

    const updateEmployee = async (e) => {
        e.preventDefault();
        try {
            const updatedEmployee = {
                firstName: state.firstName,
                lastName: state.lastName,
                emailId: state.emailId
            };
            console.log('employee => ', updatedEmployee);
            console.log('id => ', state.id);

            await EmployeeService.updateEmployee(updatedEmployee, state.id);
            navigate('/employees');
        }
         catch (error) {
            console.error('Error updating employee: ', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    return (
        <div>
            <br />
            <div className="container">
                <div className="row">
                    <div className="card col-md-6 offset-md-3 offset-md-3">
                        <h3 className="text-center">Update Employee</h3>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <label> First Name: </label>
                                    <input placeholder="First Name" name="firstName" className="form-control"
                                        value={state.firstName} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label> Last Name: </label>
                                    <input placeholder="Last Name" name="lastName" className="form-control"
                                        value={state.lastName} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label> Email Id: </label>
                                    <input placeholder="Email Address" name="emailId" className="form-control"
                                        value={state.emailId} onChange={handleInputChange} />
                                </div>
                                <button className="btn btn-success" onClick={updateEmployee}> Save </button>
                                <button className="btn btn-danger" onClick={() => navigate('/employees')} style={{ marginLeft: '10px' }}>Cancel </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateEmployeeComponent;