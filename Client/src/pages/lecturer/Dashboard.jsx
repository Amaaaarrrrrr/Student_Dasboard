import React from 'react';
import Announcements from './Announcements';
import Courses from './Courses';
import StudentsInCourse from './StudentsInCourse';
import GradeSubmission from './GradeSubmission';
import { Bell, PlusCircle, Clock } from 'lucide-react';
import './Dashboard.css'; 

const Dashboard = () => {
  // Hardcoded data for the dashboard
  const totalCourses = 12;
  const activeStudents = 245;
  const pendingGrades = 8;

  return (
    <section className="dashboard-section">
    <div className="dashboard-container">
      <h2 className="dashboard-header">Attention Lecturer</h2>
      <p className="dashboard-subheader">Please check your updates and notifications</p>
      <div className="dashboard-announcements"></div>
        <Announcements />

      <div className="dashboard-grid">
        {/* Card 1 */}
        <div className="dashboard-card">
          <h3 className="card-title">Total Courses Teaching <a href="/courses"><Clock size={24} /> Show</a>  </h3>
          <p className="card-icon"><PlusCircle size={24} /></p>
          {/* <img src="path/to/icon.png" alt="Icon" className="card-icon" /> */}

          <p className="card-value">{totalCourses}</p>
          <p className="card-description">Courses you are teaching</p>
        </div>

        {/* Card 2 */}
        <div className="dashboard-card">
          <h3 className="card-title">Active Students</h3>
          <p className="card-value">{activeStudents}</p>
          <p className="card-description">Students enrolled in your courses <a href="/students"><PlusCircle size={24} />List</a></p>
        </div>

        {/* Card 3 */}
        <div className="dashboard-card">
          <h3 className="card-title">Pending Grades</h3>
          <p className="card-value">{pendingGrades} <a href="/grade_submission"><PlusCircle  size={24} />grading</a></p>
          <p className="card-description">Assignments waiting for grading</p>
        </div>
      </div>
    
    </div>
    {/* <div className="dashboard-footer"> <p>© 2025 Student Portal. All rights reserved.</p>
    </div> */}
    </section>
  );
};

export default Dashboard;
