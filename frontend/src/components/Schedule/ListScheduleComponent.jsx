import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScheduleService from "../../services/ScheduleService";
import axios from "axios";

const ListScheduleComponent = () => {
  //const [schedules, setSchedules] = useState([]);
  const [schedules, setSchedules] = useState([
    {
      id: "",
      scheduleDate: new Date(),
      startTime: "12:00",
      endTime: "13:00",
      course: "",
      instructor: "",
    },
  ]);
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();
  
  const [sortField, setSortField] = useState(null);
  // Helper function to get nested property value
  const getField = (obj, path) => {
    const keys = path.split(".");
    return keys.reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : null),
      obj
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Schedules
        const scheduleResponse = await ScheduleService.getSchedules();
        const fetchedSchedules = scheduleResponse.data;
        console.log(fetchedSchedules);

        // Fetch Courses based on scheduleIds
        const scheduleIds = fetchedSchedules.map((schedule) => schedule.id);
        console.log(scheduleIds);

        // Fetch both schedules and courses in parallel
        const promises = scheduleIds.map((scheduleId) => {
          return Promise.all([
            ScheduleService.getScheduleById(scheduleId),
            axios.get(
              `http://localhost:8080/api/v1/schedules/courseId/${scheduleId}`,
              { headers: { "Content-Type": "application/json" } }
            ),
          ]);
        });

        const results = await Promise.all(promises);

        // Update the state with schedule and course details
        const updatedSchedules = results.map(
          ([selectedSchedule, fetchedCourses]) => ({
            id: selectedSchedule.data.id,
            scheduleDate: new Date(selectedSchedule.data.scheduleDate),
            startTime: selectedSchedule.data.startTime,
            endTime: selectedSchedule.data.endTime,
            course: fetchedCourses.data[0], // Assuming you want the data for the first course
          })
        );

        setSchedules(updatedSchedules);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures that this effect runs only once on component mount

  const addSchedule = () => {
    navigate("/add-schedule/_add");
  };

  const viewSchedule = (id) => {
    navigate(`/view-schedule/${id}`);
  };

  const editSchedule = (id) => {
    navigate(`/add-schedule/${id}`);
  };

  const deleteSchedule = (id) => {
    ScheduleService.deleteSchedule(id).then(() => {
      setSchedules(schedules.filter((schedule) => schedule.id !== id));
    });
  };

  const viewDepartments = () => {
    navigate("/departments");
  };
  const viewCourses = () => {
    navigate("/courses");
  };
  const viewEmployees = () => {
    navigate("/employees");
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // If clicking on the same field, toggle the sort order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If clicking on a different field, update the field and set the default sort order to 'asc'
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortingArrow = (field) => {
    if (sortField !== field) {
      return null; // Don't display the arrow if it's not the current sorting field
    }

    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  const sortedSchedules = [...schedules].sort((a, b) => {
    const fieldA = sortField ? getField(a, sortField) : null;
    const fieldB = sortField ? getField(b, sortField) : null;

    if (fieldA === null || fieldB === null) {
      return sortOrder === "asc" ? 1 : -1; // Handle null values
    }

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortOrder === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    } else {
      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA; // Handle numeric values
    }
  });

  return (
    <div>
      <h2 className="text-center">Schedules List</h2>
      <div className="row">
        <button
          className="btn btn-info"
          style={{ marginLeft: "10px" }}
          onClick={addSchedule}
        >
          Add Schedule
        </button>
        <button
          className="btn btn-info"
          style={{ marginLeft: "10px" }}
          onClick={viewDepartments}
        >
          View Departments
        </button>
        <button
          className="btn btn-info"
          style={{ marginLeft: "10px" }}
          onClick={viewEmployees}
        >
          View Employees
        </button>
        <button
          className="btn btn-info"
          style={{ marginLeft: "10px" }}
          onClick={viewCourses}
        >
          View Courses
        </button>
      </div>
      <br />
      <div className="row">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th onClick={() => handleSort("date")}>
                Schedule Date {renderSortingArrow("date")}
              </th>
              <th onClick={() => handleSort("startTime")}>
                Start Time {renderSortingArrow("startTime")}
              </th>
              <th onClick={() => handleSort("endTime")}>
                End Time {renderSortingArrow("endTime")}
              </th>
              <th onClick={() => handleSort("course.courseName")}>
                Course Name {renderSortingArrow("course.courseName")}
              </th>
              <th onClick={() => handleSort("employee.firstName")}>
                Employee Name {renderSortingArrow("employee.firstName")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedSchedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.scheduleDate.toLocaleDateString()}</td>
                <td>{schedule.startTime}</td>
                <td>{schedule.endTime}</td>
                <td>{schedule.course ? schedule.course.courseName : "N/A"}</td>
                <td>
                  {schedule.course
                    ? `${schedule.course.instructor.firstName} ${schedule.course.instructor.lastName}`
                    : "N/A"}
                </td>
                <td>
                  <button
                    onClick={() => editSchedule(schedule.id)}
                    className="btn btn-info"
                  >
                    Update
                  </button>
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => deleteSchedule(schedule.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => viewSchedule(schedule.id)}
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

export default ListScheduleComponent;
