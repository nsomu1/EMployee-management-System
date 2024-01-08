import React, { useEffect, useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import CourseService from '../../services/CourseService';

const ListCourseComponent = () => {
  const [courses, setCourses] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const location = useLocation();

  const [sortField, setSortField] = useState(null);
 // Helper function to get nested property value
 const getField = (obj, path) => {
  const keys = path.split('.');
  return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
};
useEffect(() => {
  const fetchData = async () => {
    // Fetch courses
    try {
      console.log('fetchedCourses');
      const coursesResponse = await CourseService.getCourses();
      const fetchedCourses = coursesResponse.data;
      console.log(fetchedCourses);
      console.log('fetchedCourses',fetchedCourses);
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  fetchData();
}, []);

  const addCourse = () => {
    navigate('/add-course/_add');
  };

  const viewCourse = (id) => {
    navigate(`/view-course/${id}`);
  };

  const editCourse = (id) => {
    navigate(`/add-course/${id}`);
  };

  const deleteCourse = (id) => {
    CourseService.deleteCourse(id).then(() => {
      setCourses(courses.filter((course) => course.id !== id));
    });
  };

  const viewDepartments = () => {
    navigate('/departments');
  };
  const viewEmployees = () => {
    navigate('/employees');
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

  const sortedCourses = [...courses].sort((a, b) => {
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
      <h2 className="text-center">Courses List</h2>
      <div className="row">
        <button className="btn btn-info" style={{ marginLeft: '10px' }} onClick={addCourse}>
          Add Course
        </button>
        <button className="btn btn-info" style={{ marginLeft: '10px' }} onClick={viewDepartments}>
          View Departments
        </button>
        <button className="btn btn-info" style={{ marginLeft: '10px' }} onClick={viewEmployees}>
          View Employees
        </button>
      </div>
      <br />
      <div className="row">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th onClick={() => handleSort('courseName')}>
                Course Name {renderSortingArrow('courseName')}
              </th>
              <th onClick={() => handleSort('department.name')}>
                Department {renderSortingArrow('department.name')}
              </th>
              <th onClick={() => handleSort('instructor.firstName')}>
                Employee Name {renderSortingArrow('instructor.firstName')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.courseName}</td>
                <td>{course.department ? course.department.name : 'N/A'}</td>
                <td>
                {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'N/A'}
                </td>
                <td>
                  <button onClick={() => editCourse(course.id)} className="btn btn-info">
                    Update
                  </button>
                  <button
                    style={{ marginLeft: '10px' }}
                    onClick={() => deleteCourse(course.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                  <button
                    style={{ marginLeft: '10px' }}
                    onClick={() => viewCourse(course.id)}
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

export default ListCourseComponent;