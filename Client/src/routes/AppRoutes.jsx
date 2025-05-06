import React, { useState } from 'react';
import axios from 'axios';

const DocumentRequestComponent = () => {
  const [formData, setFormData] = useState({
    student_id: '',
    document_type: '',
    reason: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/document-requests', formData);
      alert('Request submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to submit request.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="student_id" value={formData.student_id} onChange={handleChange} placeholder="Student ID" />
      <input name="document_type" value={formData.document_type} onChange={handleChange} placeholder="Document Type" />
      <input name="reason" value={formData.reason} onChange={handleChange} placeholder="Reason" />
      <button type="submit">Submit Request</button>
    </form>
  );
};

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <Router>
      <Navbar />

      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-indigo-600 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-semibold">🎓 Student Portal Service</h2>
            <p className="mt-2 text-lg">Welcome to your one-stop academic dashboard.</p>
          </div>
        </header>

        {/* Dropdown Menu for Student Services */}
        

        {/* Main Content */}
        <main className="flex-1 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/students" element={<StudentsInCourse />} />
              <Route path="/grades" element={<GradeSubmission />} />
              <Route path="/unit_registration" element={<UnitRegistrationForm />} />
              <Route path="/document_request" element={<DocumentRequestForm />} />
              <Route path="/room_booking" element={<RoomBookingForm />} />
              <Route path="/clearance" element={<ClearanceForm />} />
              <Route path="/grade_submission" element={<GradeSubmission />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>© 2025 Student Portal. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}




export default DocumentRequestComponent;
