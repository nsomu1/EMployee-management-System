import React, { useState, useEffect } from "react";
import EmployeeService from "../../services/EmployeeService";
import { useNavigate } from "react-router-dom";
import DepartmentService from "../../services/DepartmentService"; // Import DepartmentService
import "./ViewEmployeeComponent.css";

const ViewEmployeeComponent = () => {
  const employeeId = window.location.pathname.split("/").pop();
  const [employee, setEmployee] = useState({});
  const [department, setDepartment] = useState({}); // State to store department details
  const navigate = useNavigate();
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await EmployeeService.getEmployeeById(employeeId);
        setEmployee(res.data);

        // Fetch department details using DepartmentService
        if (res.data.department) {
          const departmentRes = await DepartmentService.getDepartmentById(
            res.data.department.id
          );
          setDepartment(departmentRes.data);
        }
      } catch (error) {
        console.error("Error fetching employee: ", error);
      }
    };

    fetchEmployee();
  }, [employeeId]);

  return (
    <div className="view-employee-container">
      <br></br>
      <div className="card col-md-6 offset-md-3">
        <h3 className="text-center"> Employee Details</h3>
        <div className="card-body">
          <div className="row">
            <label> First Name: </label>
            <div> {employee.firstName}</div>
          </div>
          <div className="row">
            <label> Last Name: </label>
            <div> {employee.lastName}</div>
          </div>
          <div className="row">
            <label> Email ID: </label>
            <div> {employee.emailId}</div>
          </div>
          <div className="row">
            <label> Department: </label>
            <div> {department.name || "N/A"}</div>{" "}
            {/* Display department name or 'N/A' if not available */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployeeComponent;
