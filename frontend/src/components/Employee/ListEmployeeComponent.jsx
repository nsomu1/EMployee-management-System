import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import EmployeeService from '../../services/EmployeeService';

const ListEmployeeComponent = ( ) => {
  const [employees, setEmployees] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();

  const [sortField, setSortField] = useState(null);
 // Helper function to get nested property value
 const getField = (obj, path) => {
  const keys = path.split('.');
  return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
};
  useEffect(() => {
    EmployeeService.getEmployees().then((res) => {
      setEmployees(res.data);
    });
  }, []);

  const addEmployee = () => {
    navigate('/add-employee/_add');
  };

  const viewEmployee = (id) => {
    navigate(`/view-employee/${id}`);
  };

  const editEmployee = (id) => {
    navigate(`/add-employee/${id}`);
  };

  const deleteEmployee = (id) => {
    EmployeeService.deleteEmployee(id).then(() => {
      setEmployees(employees.filter((employee) => employee.id !== id));
    });
  };

  const viewDepartments = () => {
    navigate('/departments');
  };
  const viewCourses = () => {
    navigate('/courses');
  };
  const viewSchedules = () => {
    navigate('/schedules');
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
  

  const sortedEmployees = [...employees].sort((a, b) => {
    const fieldA = sortField ? getField(a, sortField) : null;
    const fieldB = sortField ? getField(b, sortField) : null;

    if (fieldA === null || fieldB === null) {
      return sortOrder === 'asc' ? 1 : -1; // Handle null values
    }

    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortOrder === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
    } else {
      return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA; // Handle numeric values
    }
  });
  
  return (
    <div>
      <h2 className="text-center">Employees List</h2>
      <div className="row">
        <button className="btn btn-info" style={{ marginLeft: '10px' }} onClick={addEmployee}>
          Add Employee
        </button>
        <button className="btn btn-info" style={{ marginLeft: '10px' }} onClick={viewDepartments}>
          View Departments
        </button>
        <button className="btn btn-info" style={{ marginLeft: '10px' }} onClick={viewCourses}>
          View Courses
        </button>
        <button className="btn btn-info" style={{ marginLeft: '10px' }} onClick={viewSchedules}>
          View Schedules
        </button>
      </div>
      <br />
      <div className="row">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th onClick={() => handleSort('firstName')}>
                First Name {renderSortingArrow('firstName')}
              </th>
              <th onClick={() => handleSort('lastName')}>
                Last Name {renderSortingArrow('lastName')}
              </th>
              <th onClick={() => handleSort('emailId')}>
                Email Id {renderSortingArrow('emailId')}
              </th>
              <th onClick={() => handleSort('department.name')}>
                Department {renderSortingArrow('department.name')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.emailId}</td>
                <td>{employee.department ? employee.department.name : 'N/A'}</td>
                <td>
                  <button onClick={() => editEmployee(employee.id)} className="btn btn-info">
                    Update
                  </button>
                  <button
                    style={{ marginLeft: '10px' }}
                    onClick={() => deleteEmployee(employee.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                  <button
                    style={{ marginLeft: '10px' }}
                    onClick={() => viewEmployee(employee.id)}
                    className="btn btn-info"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListEmployeeComponent;