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
