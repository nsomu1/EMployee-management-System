import React, { useState, useEffect } from "react";
import EmployeeService from "../../services/EmployeeService";
import "./ViewScheduleComponent.css";
import ScheduleService from "../../services/ScheduleService";
import CourseService from "../../services/CourseService";

const ViewScheduleComponent = () => {
  const scheduleId = window.location.pathname.split("/").pop();
  const [schedule, setSchedule] = useState({});
  const [course, setCourses] = useState({}); // State to store department details
  const [employee, setEmployee] = useState({}); // State to store department details
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await ScheduleService.getScheduleById(scheduleId);
        setSchedule(res.data);

        // Fetch department details using DepartmentService
        if (res.data.course) {
          const courseRes = await CourseService.getCourseById(
            res.data.course.id
          );
          setCourses(courseRes.data);
        }
        // Fetch department details using DepartmentService
        if (res.data.employee) {
          const employeeRes = await EmployeeService.getEmployeeById(
            res.data.employee.id
          );
          setEmployee(employeeRes.data);
        }
      } catch (error) {
        console.error("Error fetching schedule: ", error);
      }
    };

    fetchSchedule();
  }, [scheduleId]);

  return (
    <div className="view-employee-container">
      <br></br>
      <div className="card col-md-6 offset-md-3">
        <h3 className="text-center"> Schedule Details</h3>
        <div className="card-body">
          <div className="row">
            <label> Schedule Date</label>
            <div> {schedule.date}</div>
          </div>
          <div className="row">
            <label> Start Time </label>
            <div> {schedule.startTime}</div>
          </div>
          <div className="row">
            <label> End Time </label>
            <div> {schedule.endTime}</div>
          </div>
          <div className="row">
            <label> Course: </label>
            <div> {course.name || "N/A"}</div>{" "}
            {/* Display course name or 'N/A' if not available */}
          </div>
          <div className="row">
            <label> Employee: </label>
            <div> {employee.name || "N/A"}</div>{" "}
            {/* Display department name or 'N/A' if not available */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewScheduleComponent;
