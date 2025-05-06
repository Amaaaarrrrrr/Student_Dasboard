// FILE: App.jsx
import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Student Pages
import Dashboard from "./pages/student/Dashboard";
import Profile from "./pages/student/Profile";
import UnitRegistration from "./pages/student/UnitRegistration";
import Accommodation from "./pages/student/Accommodation";
import Fees from "./pages/student/Fees";
import Clearance from "./pages/student/Clearance";
import Documents from "./pages/student/Documents";
import Grades from "./pages/student/Grades";

// Shared Components
import AnnouncementBanner from "./components/Shared/AnnouncementBanner";
import Navbar from "./components/Shared/Navbar";

// Optional: Import global CSS for Navbar (if not already imported in Navbar.jsx)
import './components/Shared/Navbar.css';

function App() {
  return (
    <Router>
      <AppRoutes />
      <AnnouncementBanner />
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/unit-registration" element={<UnitRegistration />} />
        <Route path="/accommodation" element={<Accommodation />} />
        <Route path="/fees" element={<Fees />} />
        <Route path="/clearance" element={<Clearance />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/grades" element={<Grades />} />
      </Routes>
    </Router>
  );
}

export default App;
