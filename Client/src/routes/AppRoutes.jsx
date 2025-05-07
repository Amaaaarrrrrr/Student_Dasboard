import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from '../contexts/AuthContext';
import { GlobalProvider } from '../contexts/GlobalContext';

// Import admin pages
import Dashboard from '../pages/admin/Dashboard';
import AssignHostels from '../pages/admin/AssignHostels';
import AuditLogs from '../pages/admin/AuditLogs';
import ClearanceManagement from '../pages/admin/ClearanceManagement';
import FeeStructures from '../pages/admin/FeeStructures';
import ManageSemesters from '../pages/admin/ManageSemesters';
import ManageUsers from '../pages/admin/ManageUsers';

// Import other pages or components as needed
// import Home from '../pages/Home';
// import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <AuthProvider>
      <GlobalProvider>
        <Router>
          <Routes>
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/assign-hostels" element={<AssignHostels />} />
            <Route path="/admin/audit-logs" element={<AuditLogs />} />
            <Route path="/admin/clearance-management" element={<ClearanceManagement />} />
            <Route path="/admin/fee-structures" element={<FeeStructures />} />
            <Route path="/admin/manage-semesters" element={<ManageSemesters />} />
            <Route path="/admin/manage-users" element={<ManageUsers />} />

            {/* Redirect root to admin dashboard for now */}
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Add other routes here */}

            {/* Catch all - could add a NotFound component */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Router>
      </GlobalProvider>
    </AuthProvider>
  );
};

export default AppRoutes;

import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/Layout/AdminLayout";
import LecturerLayout from "../components/Layout/LecturerLayout";
import StudentLayout from "../components/Layout/StudentLayout";
import ProtectedRoute from "../components/Layout/ProtectedRoute";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import Footer from "../components/Layout/Footer";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
// import Dashboard from "../pages/Dashboard";
import Announcements from "../pages/lecturer/Announcements";
import Courses from "../pages/lecturer/Courses";
import StudentsInCourse from "../pages/lecturer/StudentsInCourse";
import GradeSubmission from "../pages/lecturer/GradeSubmission";
import UnitRegistrationForm from "../components/Forms/UnitRegistrationForm";
import DocumentRequestForm from "../components/Forms/DocumentRequestForm";
import RoomBookingForm from "../components/Forms/RoomBookingForm";
import ClearanceForm from "../components/Forms/ClearanceForm";

const AppRoutes = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-indigo-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold">🎓 Student Portal Service</h2>
          <p className="mt-2 text-lg">Welcome to your one-stop academic dashboard.</p>
        </div>
      </header>

      <Navbar />

      <div className="flex flex-1">
        <Sidebar role="student" />
        <main className="flex-1 p-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<h1>Welcome to the Student Portal</h1>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lecturer/*"
              element={
                <ProtectedRoute allowedRoles={["lecturer"]}>
                  <LecturerLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/*"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentLayout />
                </ProtectedRoute>
              }
            />

            {/* Student Portal Routes */}
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/students" element={<StudentsInCourse />} />
            <Route path="/unit_registration" element={<UnitRegistrationForm />} />
            <Route path="/document_request" element={<DocumentRequestForm />} />
            <Route path="/room_booking" element={<RoomBookingForm />} />
            <Route path="/clearance" element={<ClearanceForm />} />
            <Route path="/grade_submission" element={<GradeSubmission />} />
          </Routes>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2025 Student Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AppRoutes;
