import axiosInstance from "./axios";

// ==============================
// API FUNCTIONS
// ==============================

// Fetch all hostels with pagination
export const fetchHostels = async (page = 1, perPage = 10) => {
  const res = await axiosInstance.get("/api/hostels", {
    params: { page, per_page: perPage },
  });
  return res.data;
};

// Fetch all rooms
export const fetchRooms = async () => {
  const res = await axiosInstance.get("/api/rooms");
  return res.data;
};

// Fetch all bookings for the current student
export const fetchBookings = async () => {
  const res = await axiosInstance.get("/api/bookings");
  return res.data;
};

// Create a new room booking
export const createBooking = async (bookingData) => {
  const res = await axiosInstance.post("/api/bookings", bookingData);
  return res.data;
};

// Cancel a room booking
export const cancelBooking = async (bookingId) => {
  const res = await axiosInstance.delete(`/api/bookings/${bookingId}`);
  return res.data;
};

import { fetchAnnouncements } from "./announcement";

const getAnnouncements = async () => {
  try {
    const announcements = await fetchAnnouncements();
    console.log(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
  }
};

getAnnouncements();
