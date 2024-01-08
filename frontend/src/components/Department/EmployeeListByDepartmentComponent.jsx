import React, { useState, useEffect } from 'react';
import EmployeeService from '../../services/EmployeeService';
import DepartmentService from '../../services/DepartmentService';
import './EmployeeListByDepartmentComponent.css'; // Import your CSS file

const EmployeeListByDepartmentComponent = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [sortField, setSortField] = useState('firstName');

  useEffect(() => {
    // Fetch the list of departments
    DepartmentService.getAllDepartments()
      .then((res) => {
        setDepartments(res.data || []);
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
        setDepartments([]);
      });
  }, []);

  const handleDepartmentChange = (event) => {
    const selectedDepartmentId = event.target.value;
    setSelectedDepartment(selectedDepartmentId);

    // Fetch employees based on the selected department
    EmployeeService.getEmployeesByDepartment(selectedDepartmentId)
      .then((res) => {
        setEmployees(res.data || []);
      })
      .catch((error) => {
        console.error('Error fetching employees by department:', error);
        setEmployees([]);
      });
  };
  const handleSort = (field) => {
    if (sortField === field) {
      // If clicking on the same field, toggle the sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking on a different field, update the field and set the default sort order to 'asc'
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderSortingArrow = (field) => {
    if (sortField !== field) {
      return null; // Don't display the arrow if it's not the current sorting field
    }

    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="employee-list-container">
      <h2>Employee List by Department</h2>
      <div className="department-selector">
        <label>Select Department:</label>
        <select value={selectedDepartment} onChange={handleDepartmentChange}>
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>
      <div className="employee-list-container">
      <div className="employee-table">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
            <th onClick={() => handleSort('firstName')}>
                First Name {renderSortingArrow('firstName')}
              </th>
              <th onClick={() => handleSort('lastName')}>
                Last Name {renderSortingArrow('lastName')}
              </th>
              <th>Email Id</th>
            </tr>
          </thead>
          <tbody>
          {employees
              .sort((a, b) => {
                const fieldA = a[sortField] || '';
                const fieldB = b[sortField] || '';
                const comparison = fieldA.localeCompare(fieldB);
                return sortOrder === 'asc' ? comparison : -comparison;
              })
              .map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.firstName}</td>
                  <td>{employee.lastName}</td>
                  <td>{employee.emailId}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default EmployeeListByDepartmentComponent;
