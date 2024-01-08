import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DepartmentService from '../../services/DepartmentService';

const DepartmentForm = () => {
  const departmentId = window.location.pathname.split('/').pop();
  const navigate = useNavigate();

  const [state, setState] = useState({
    id: '',
    name: '',
  });

  useEffect(() => {
    if (departmentId === '_add') {
      return;
    } else {
      DepartmentService.getDepartmentById(departmentId)
        .then((res) => {
          const department = res.data;
          setState({
            id: department.id,
            name: department.name,
          });
        })
        .catch((error) => {
          console.error('Error fetching department:', error);
        });
    }
  }, [departmentId]);

  const saveOrUpdateDepartment = async (e) => {
    e.preventDefault();
    try {
      const department = {
        name: state.name,
      };

      if (departmentId !== '_add') {
        await DepartmentService.updateDepartment(department, state.id);
      } else {
        await DepartmentService.createDepartment(department);
      }
      navigate('/departments');
    } catch (error) {
      console.error('Error saving/updating department: ', error);
    }
  };

  const cancel = () => {
    navigate('/departments');
  };

  const changeNameHandler = (event) => {
    setState({ ...state, name: event.target.value });
  };

  return (
    <div>
      <br />
      <div className="container">
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            <h3 className="text-center">{state.id ? 'Update Department' : 'Add Department'}</h3>
            <div className="card-body">
              <form>
                <div className="form-group">
                  <label>Department Name:</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={state.name}
                    onChange={changeNameHandler}
                  />
                </div>
                <button className="btn btn-success" onClick={saveOrUpdateDepartment}>
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

export default DepartmentForm;
