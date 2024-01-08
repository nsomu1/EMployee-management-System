import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ScheduleService from "../../services/ScheduleService";
import CourseService from "../../services/CourseService";

const CreateScheduleComponent = () => {
  const scheduleId = window.location.pathname.split("/").pop();
  const navigate = useNavigate();

  const [state, setState] = useState({
    id: "",
    scheduleDate: new Date(),
    startTime: "12:00", // Set a default start time
    endTime: "13:00", //set a default end time
    courseId: "",
    employeeId: "",
  });

  const [courses, setCourses] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    CourseService.getCourses().then((res) => {
      setCourses(res.data || []);
      console.log("Courses", courses);
    });

    // Fetch employees (initially for the first course)
    if (courses.length > 0) {
      fetchEmployeesByCourse(courses[0].id);
    }

    if (scheduleId === "_add") {
      return;
    } else {
      console.log("Happy");
      ScheduleService.getScheduleById(scheduleId)
        .then((res) => {
          const schedule = res.data;
          setState((prevState) => ({
            ...prevState,
            id: schedule.id,
            scheduleDate: schedule.scheduleDate,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            courseId: schedule.course ? schedule.course.id : "",
            employeeId: schedule.employee ? schedule.employee.id : "",
          }));
          fetchEmployeesByCourse(schedule.course.id);
        })
        .catch((error) => {
          console.error("Error fetching schedule:", error);
        });
    }
  }, [scheduleId]); // Add setState to the dependency array

  /*const handleTimeChange = (selectedTime, field) => {
    setState({ ...state, [field]: selectedTime });
  };*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "courseId") {
      fetchEmployeesByCourse(value);
    }

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setState({ ...state, courseId });

    // Fetch employees for the selected course
    fetchEmployeesByCourse(courseId);

    // Set employeeId to the first employee in the list (if available)
    const firstEmployee = employees[0];
    if (firstEmployee) {
      setState((prevState) => ({
        ...prevState,
        employeeId: firstEmployee.id,
      }));
    }
  };

  const fetchEmployeesByCourse = (courseId) => {
    CourseService.getEmployeesByCourseId(courseId).then((res) => {
      setEmployees(res.data || []);
    });
  };

  const saveOrUpdateSchedule = async (e) => {
    e.preventDefault();
    try {
      const schedule = {
        scheduleDate: state.scheduleDate,
        startTime: state.startTime,
        endTime: state.endTime,
        courseId: state.courseId,
        employeeId: state.employeeId,
      };

      if (scheduleId !== "_add") {
        console.log("raledhu");
        await ScheduleService.updateSchedule(schedule, state.id);
        console.log("emoooo");
      } else {
        await ScheduleService.createSchedule(schedule);
      }
      navigate("/schedules");
    } catch (error) {
      console.error("Error saving/updating schedule: ", error);
    }
  };

  const cancel = () => {
    navigate("/schedules");
  };

  return (
    <div>
      <br />
      <div className="container">
        <div className="row">
          <div className="card col-md-6 offset-md-3 offset-md-3">
            <h3 className="text-center">
              {state.id ? "Update Schedule" : "Add Schedule"}
            </h3>
            <div className="card-body">
              <form>
                <div className="form-group">
                  <label>Schedule Date:</label>
                  <input
                    type="date"
                    value={
                      state.scheduleDate instanceof Date
                        ? state.scheduleDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setState({
                        ...state,
                        scheduleDate: new Date(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="card-body">
                  <label>Start Time:</label>
                  <input
                    type="time"
                    name="startTime"
                    value={state.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="card-body">
                  <label>End Time:</label>
                  <input
                    type="time"
                    name="endTime"
                    value={state.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Course:</label>
                  <select
                    name="courseId"
                    value={state.courseId}
                    onChange={handleCourseChange}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.courseName}
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

                <button
                  className="btn btn-success"
                  onClick={saveOrUpdateSchedule}
                >
                  Save
                </button>
                <button
                  className="btn btn-danger"
                  onClick={cancel}
                  style={{ marginLeft: "10px" }}
                >
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

export default CreateScheduleComponent;
