import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-red-800 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Title */}
        <h2 className="text-2xl font-bold text-white">
          Lecturer Dashboard
        </h2>

        {/* Navigation Links */}
        <div className="flex space-x-10 items-center">
          <NavLink to="/" className={({ isActive }) =>
            isActive ? 'font-semibold text-indigo-200' : 'text-white hover:text-indigo-100 transition-colors duration-300'
          }>DASHBOARD</NavLink>

          <NavLink to="/profile" className={({ isActive }) =>
            isActive ? 'font-semibold text-indigo-200' : 'text-white hover:text-indigo-100 transition-colors duration-300'
          }>PROFILE</NavLink>

          <NavLink to="/announcements" className={({ isActive }) =>
            isActive ? 'font-semibold text-indigo-200' : 'text-white hover:text-indigo-100 transition-colors duration-300'
          }>ANNOUNCEMENT</NavLink>

          <NavLink to="/courses" className={({ isActive }) =>
            isActive ? 'font-semibold text-indigo-200' : 'text-white hover:text-indigo-100 transition-colors duration-300'
          }>COURSES</NavLink>

          <NavLink to="/students" className={({ isActive }) =>
            isActive ? 'font-semibold text-indigo-200' : 'text-white hover:text-indigo-100 transition-colors duration-300'
          }>STUDENTS</NavLink>

          <NavLink to="/grades" className={({ isActive }) =>
            isActive ? 'font-semibold text-indigo-200' : 'text-white hover:text-indigo-100 transition-colors duration-300'
          }>GRADES</NavLink>

          {/* Student Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Student Services
            </button>

            {isDropdownOpen && (
              <div className="absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 transition ease-out duration-200 transform scale-100">
                <div className="py-1">
                  <NavLink to="/unit_registration" className="block px-4 py-2 text-gray-700 hover:bg-indigo-100">
                    Unit Registration
                  </NavLink>
                  <NavLink to="/document_request" className="block px-4 py-2 text-gray-700 hover:bg-indigo-100">
                    Document Request
                  </NavLink>
                  <NavLink to="/room_booking" className="block px-4 py-2 text-gray-700 hover:bg-indigo-100">
                    Room Booking
                  </NavLink>
                  <NavLink to="/clearance" className="block px-4 py-2 text-gray-700 hover:bg-indigo-100">
                    Clearance
                  </NavLink>
                  <NavLink to="/grade_submission" className="block px-4 py-2 text-gray-700 hover:bg-indigo-100">
                    Grade Submission
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
