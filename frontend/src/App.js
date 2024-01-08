import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import ListEmployeeComponent from './components/Employee/ListEmployeeComponent';
import LoginComponent from './components/LoginComponent';
import CreateEmployeeComponent from './components/Employee/CreateEmployeeComponent';
import ViewEmployeeComponent from './components/Employee/ViewEmployeeComponent';
import ListDepartmentComponent from './components/Department/ListDepartmentComponent';
import DepartmentForm from './components/Department/DepartmentForm';
import EmployeeListByDepartmentComponent from './components/Department/EmployeeListByDepartmentComponent';
import ListCourseComponent from './components/Course/ListCourseComponent';
import CreateCourseComponent from './components/Course/CreateCourseComponent';
import ViewCourseComponent from './components/Course/ViewCourseComponent';
import ListScheduleComponent from './components/Schedule/ListScheduleComponent';
import CreateScheduleComponent from './components/Schedule/CreateScheduleComponent';
import ViewScheduleComponent from './components/Schedule/ViewScheduleComponent';


function App() {
  
  return (
    <div>
      <Router>
        <HeaderComponent />
        <div className="container">
          <Routes>
           <Route path="/" element={<LoginComponent />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path = "/employees" element = {<ListEmployeeComponent />}></Route>
            <Route path = "/add-employee/:id" element = {<CreateEmployeeComponent />}></Route>
            <Route path = "/view-employee/:id" element = {<ViewEmployeeComponent/>}></Route>
            <Route path="/departments" element={<ListDepartmentComponent />} />
            <Route path = "/add-department/:id" element = {<DepartmentForm />}></Route>
            <Route path = "/view-employees/:id" element = {<EmployeeListByDepartmentComponent />}></Route>
            <Route path = "/courses" element = {<ListCourseComponent />}></Route>
            <Route path = "/add-course/:id" element = {<CreateCourseComponent />}></Route>
            <Route path = "/view-course/:id" element = {<ViewCourseComponent/>}></Route>
            <Route path = "/schedules" element = {<ListScheduleComponent />}></Route>
            <Route path = "/add-schedule/:id" element = {<CreateScheduleComponent />}></Route>
            <Route path = "/view-schedule/:id" element = {<ViewScheduleComponent/>}></Route>
            
          
           </Routes>
        </div>
        <FooterComponent />
      </Router>
    </div>
  );
}

export default App;