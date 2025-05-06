import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/lecturer/Dashboard';
import Announcements from './pages/lecturer/Announcements';
import Courses from './pages/lecturer/Courses';
import StudentsInCourse from './pages/lecturer/StudentsInCourse';
import GradeSubmission from './pages/lecturer/GradeSubmission';
import Navbar from './components/Layout/Navbar';
import UnitRegistrationForm from './components/Forms/UnitRegistrationForm';
import DocumentRequestForm from './components/Forms/DocumentRequestForm';
import RoomBookingForm from './components/Forms/RoomBookingForm';
import ClearanceForm from './components/Forms/ClearanceForm';
import './App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.devjh" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        {/*  */}
        
      </div>
      <h1>Student Portal System</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          counting.. {count}
        </button>
        <p>
          
        </p>
      </div>
      <p className="read-the-docs">
        This is changing to student portal system 
      </p>
    </>
  )
}

export default App;
