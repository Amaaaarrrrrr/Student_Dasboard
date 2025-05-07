// AdminRoutes.jsx
import React from "react";
import { Route } from "react-router-dom";


import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageSemesters from "../pages/admin/ManageSemesters";
import AssignHostels from "../pages/admin/AssignHostels";
import FeeStructures from "../pages/admin/FeeStructures";
import ClearanceManagement from "../pages/admin/ClearanceManagement";
import AuditLogs from "../pages/admin/AuditLogs";

const adminRoutes = [
  <Route path="/admin" element={<AdminDashboard />} key="admin" />,
  <Route path="/admin/users" element={<ManageUsers />} key="users" />,
  <Route path="/admin/semesters" element={<ManageSemesters />} key="semesters" />,
  <Route path="/admin/hostels" element={<AssignHostels />} key="hostels" />,
  <Route path="/admin/fees" element={<FeeStructures />} key="fees" />,
  <Route path="/admin/clearance" element={<ClearanceManagement />} key="clearance" />,
  <Route path="/admin/audit-logs" element={<AuditLogs />} key="logs" />,
];

export default adminRoutes;
