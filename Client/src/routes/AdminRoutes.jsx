// src/routes/AdminRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageSemesters from "../pages/admin/ManageSemesters";
import AssignHostels from "../pages/admin/AssignHostels";
import FeeStructures from "../pages/admin/FeeStructures";
import ClearanceManagement from "../pages/admin/ClearanceManagement";
import AuditLogs from "../pages/admin/AuditLogs";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/users" element={<ManageUsers />} />
      <Route path="/admin/semesters" element={<ManageSemesters />} />
      <Route path="/admin/assign-hostels" element={<AssignHostels />} />
      <Route path="/admin/fee-structures" element={<FeeStructures />} />
      <Route path="/admin/clearance" element={<ClearanceManagement />} />
      <Route path="/admin/audit-logs" element={<AuditLogs />} />
    </Routes>
  );
};

export default AdminRoutes;
