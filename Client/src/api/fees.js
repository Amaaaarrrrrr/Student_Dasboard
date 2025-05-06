import axiosInstance from "./axios";

// ==============================
// API FUNCTIONS
// ==============================

// Fetch fee structure for a specific program and semester
export const fetchFeeStructure = async (programId, semesterId) => {
  const res = await axiosInstance.get("/api/fee-structure", {
    params: { program_id: programId, semester_id: semesterId },
  });
  return res.data;
};

// Fetch all fee structures (Admin only)
export const fetchAllFeeStructures = async () => {
  const res = await axiosInstance.get("/api/fee-structures/all");
  return res.data;
};

// Create a new fee structure (Admin only)
export const createFeeStructure = async (feeStructureData) => {
  const res = await axiosInstance.post("/api/fee-structure", feeStructureData);
  return res.data;
};

// Fetch all payments for the current student
export const fetchPayments = async () => {
  const res = await axiosInstance.get("/api/payments");
  return res.data;
};

// Create a new payment for the current student
export const createPayment = async (paymentData) => {
  const res = await axiosInstance.post("/api/payments", paymentData);
  return res.data;
};

// Fetch details of a specific payment
export const fetchPaymentDetails = async (paymentId) => {
  const res = await axiosInstance.get(`/api/payments/${paymentId}`);
  return res.data;
};

// Delete a specific payment
export const deletePayment = async (paymentId) => {
  const res = await axiosInstance.delete(`/api/payments/${paymentId}`);
  return res.data;
};