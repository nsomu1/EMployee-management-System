import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentService from '../../services/DepartmentService';

const ErrorDialog = ({ message, onClose }) => {
  return (
    <div className="error-dialog">
      <div className="error-dialog-content">
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

const ListDepartmentComponent = () => {
  const [departments, setDepartments] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    DepartmentService.getAllDepartments()
      .then((res) => {
        console.log("Departments:", res);
        setDepartments(res.data || []);
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
        setDepartments([]);
      });
  }, []);  

  const addDepartment = () => {
    navigate('/add-department/_add');
  };

  const viewEmployees = () => {
    navigate('/employees');
  };

  const editDepartment = (id) => {
    navigate(`/add-department/${id}`);
  };

  const viewEmployeesbyDep = (id) => {
    navigate(`/view-employees/${id}`);
  };

  const deleteDepartmentItem = async (id) => {
    try {
      const response = await DepartmentService.getDepartmentById(id);
      const department = response.data;

      if (department.employees && department.employees.length > 0) {
        const message = 'Cannot delete department with employees. Please remove employees first.';
        console.error(message);
        openErrorDialog(message);
      } else {
        await DepartmentService.deleteDepartment(id);
        setDepartments(departments.filter((department) => department.id !== id));
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      openErrorDialog('An error occurred while deleting the department.');
    }
  };

  const openErrorDialog = (message) => {
    setErrorMessage(message);
    setShowErrorDialog(true);
  };

  const closeErrorDialog = () => {
    setErrorMessage('');
    setShowErrorDialog(false);
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedDepartments = [...departments].sort((a, b) => {
    const fieldA = sortField ? a[sortField] : null;
    const fieldB = sortField ? b[sortField] : null;

    if (fieldA === null || fieldB === null) {
      return sortOrder === 'asc' ? 1 : -1;
    }

    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortOrder === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
    } else {
      return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    }
  });
  const renderSortingArrow = (field) => {
    if (sortField !== field) {
      return null; // Don't display the arrow if it's not the current sorting field
    }

    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div>
      <h2 className="text-center mb-4">Departments List</h2>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <div className="row">
        <button className="btn btn-info" style={{ marginLeft: '10px' }} onClick={addDepartment}>
          Add Department
        </button>
        <button className="btn btn-info" style={{ marginLeft: '10px' }} onClick={viewEmployees}>
          View All Employees
        </button>
        <button className="btn btn-info" style={{ marginLeft: '10px' }} onClick={viewEmployeesbyDep}>
          View Employees by Department
        </button>
      </div>
      <br />
      <div className="row">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')}>
              Department Name {renderSortingArrow('name')}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedDepartments.map((department) => (
              <tr key={department.id}>
                <td>{department.name}</td>
                <td>
                  <button onClick={() => editDepartment(department.id)} className="btn btn-info">
                    Update
                  </button>
                  <button
                    style={{ marginLeft: '10px' }}
                    onClick={() => deleteDepartmentItem(department.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showErrorDialog && (
        <ErrorDialog message={errorMessage} onClose={closeErrorDialog} />
      )}
    </div>
  );
};

export default ListDepartmentComponent;