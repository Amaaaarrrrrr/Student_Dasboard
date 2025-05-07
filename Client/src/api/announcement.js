import axiosInstance from "./axios";

// ==============================
// API FUNCTIONS
// ==============================

// Fetch all announcements
export const fetchAnnouncements = async () => {
  const res = await axiosInstance.get("/api/announcements");
  return res.data;
};

// Create a new announcement
export const createAnnouncement = async (announcementData) => {
  const res = await axiosInstance.post("/api/announcements", announcementData);
  return res.data;
};

