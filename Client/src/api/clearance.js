import axiosInstance from "./axios";

// ==============================
// API FUNCTIONS
// ==============================

// Fetch clearance status for the current student
export const fetchClearanceStatus = async () => {
  const res = await axiosInstance.get("/api/clearance");
  return res.data;
};

// Update clearance status for a specific student (Admin only)
export const updateClearanceStatus = async (studentId, updates) => {
  const res = await axiosInstance.put(`/admin/clearance/${studentId}`, updates);
  return res.data;
};