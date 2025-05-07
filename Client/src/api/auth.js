import axiosInstance from "./axios";

// ==============================
// API FUNCTIONS
// ==============================

// Register a new user
export const registerUser = async (userData) => {
  const res = await axiosInstance.post("/api/register", userData);
  return res.data;
};

// Log in a user
export const loginUser = async (credentials) => {
  const res = await axiosInstance.post("/api/login", credentials);
  return res.data;
};

// Fetch the current user's profile
export const fetchUserProfile = async () => {
  const res = await axiosInstance.get("/api/profile");
  return res.data;
};