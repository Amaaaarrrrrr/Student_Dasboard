import axiosInstance from "./axios";

// Utility function for logging errors consistently
const handleError = (error, context) => {
  console.error(`Error in ${context}:`, error?.response?.data || error.message);
  throw error;
};

// ==============================
// STUDENTS
// ==============================
export const fetchAllStudents = async () => {
  try {
    const res = await axiosInstance.get("/api/students");
    return res.data;
  } catch (error) {
    handleError(error, "fetchAllStudents");
  }
};

// ==============================
// LECTURERS
// ==============================
export const fetchAllLecturers = async () => {
  try {
    const res = await axiosInstance.get("/api/lecturers");
    return res.data;
  } catch (error) {
    handleError(error, "fetchAllLecturers");
  }
};

// ==============================
// COURSES
// ==============================
export const fetchCourses = async () => {
  try {
    const res = await axiosInstance.get("/api/courses");
    return res.data;
  } catch (error) {
    handleError(error, "fetchCourses");
  }
};

export const createCourse = async (courseData) => {
  try {
    const res = await axiosInstance.post("/api/courses", courseData);
    return res.data;
  } catch (error) {
    handleError(error, "createCourse");
  }
};

export const updateCourse = async (courseId, updates) => {
  try {
    const res = await axiosInstance.put(`/api/courses/${courseId}`, updates);
    return res.data;
  } catch (error) {
    handleError(error, "updateCourse");
  }
};

export const deleteCourse = async (courseId) => {
  try {
    const res = await axiosInstance.delete(`/api/courses/${courseId}`);
    return res.data;
  } catch (error) {
    handleError(error, "deleteCourse");
  }
};

export const assignLecturerToCourse = async ({ lecturerId, courseId }) => {
  try {
    const res = await axiosInstance.post("/admin/assign_lecturer", {
      lecturer_id: lecturerId,
      course_id: courseId,
    });
    return res.data;
  } catch (error) {
    handleError(error, "assignLecturerToCourse");
  }
};

// ==============================
// SEMESTERS
// ==============================
export const fetchSemesters = async () => {
  try {
    const res = await axiosInstance.get("/api/semesters/active");
    return res.data;
  } catch (error) {
    handleError(error, "fetchSemesters");
  }
};

export const createSemester = async (semesterData) => {
  try {
    const res = await axiosInstance.post("/api/semesters", semesterData);
    return res.data;
  } catch (error) {
    handleError(error, "createSemester");
  }
};

export const updateSemester = async (semesterId, updates) => {
  try {
    const res = await axiosInstance.put(`/api/semesters/${semesterId}`, updates);
    return res.data;
  } catch (error) {
    handleError(error, "updateSemester");
  }
};

export const deleteSemester = async (semesterId) => {
  try {
    const res = await axiosInstance.delete(`/api/semesters/${semesterId}`);
    return res.data;
  } catch (error) {
    handleError(error, "deleteSemester");
  }
};

// ==============================
// HOSTELS & BOOKINGS
// ==============================
export const fetchHostels = async () => {
  try {
    const res = await axiosInstance.get("/api/hostels");
    return res.data;
  } catch (error) {
    handleError(error, "fetchHostels");
  }
};

export const fetchRoomBookings = async () => {
  try {
    const res = await axiosInstance.get("/api/bookings");
    return res.data;
  } catch (error) {
    handleError(error, "fetchRoomBookings");
  }
};

export const createBooking = async (bookingData) => {
  try {
    const res = await axiosInstance.post("/api/bookings", bookingData);
    return res.data;
  } catch (error) {
    handleError(error, "createBooking");
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const res = await axiosInstance.delete(`/api/bookings/${bookingId}`);
    return res.data;
  } catch (error) {
    handleError(error, "cancelBooking");
  }
};

// ==============================
// FEES & PAYMENTS
// ==============================
export const fetchFeeStructures = async () => {
  try {
    const res = await axiosInstance.get("/api/fee-structures/all");
    return res.data;
  } catch (error) {
    handleError(error, "fetchFeeStructures");
  }
};

export const createFeeStructure = async (feeStructureData) => {
  try {
    const res = await axiosInstance.post("/api/fee-structure", feeStructureData);
    return res.data;
  } catch (error) {
    handleError(error, "createFeeStructure");
  }
};

export const fetchPayments = async () => {
  try {
    const res = await axiosInstance.get("/api/payments");
    return res.data;
  } catch (error) {
    handleError(error, "fetchPayments");
  }
};

export const createPayment = async (paymentData) => {
  try {
    const res = await axiosInstance.post("/api/payments", paymentData);
    return res.data;
  } catch (error) {
    handleError(error, "createPayment");
  }
};

export const deletePayment = async (paymentId) => {
  try {
    const res = await axiosInstance.delete(`/api/payments/${paymentId}`);
    return res.data;
  } catch (error) {
    handleError(error, "deletePayment");
  }
};

// ==============================
// CLEARANCE
// ==============================
export const fetchClearanceStatus = async () => {
  try {
    const res = await axiosInstance.get("/api/clearance");
    return res.data;
  } catch (error) {
    handleError(error, "fetchClearanceStatus");
  }
};

export const updateClearanceStatus = async (studentId, updates) => {
  try {
    const res = await axiosInstance.put(`/admin/clearance/${studentId}`, updates);
    return res.data;
  } catch (error) {
    handleError(error, "updateClearanceStatus");
  }
};

// ==============================
// ANNOUNCEMENTS
// ==============================
export const fetchAnnouncements = async () => {
  try {
    const res = await axiosInstance.get("/api/announcements");
    return res.data;
  } catch (error) {
    handleError(error, "fetchAnnouncements");
  }
};

export const createAnnouncement = async (announcementData) => {
  try {
    const res = await axiosInstance.post("/api/announcements", announcementData);
    return res.data;
  } catch (error) {
    handleError(error, "createAnnouncement");
  }
};

// ==============================
// AUDIT LOGS
// ==============================
export const fetchAuditLogs = async () => {
  try {
    const res = await axiosInstance.get("/api/audit_logs");
    return res.data;
  } catch (error) {
    handleError(error, "fetchAuditLogs");
  }
};

// ==============================
// DOCUMENT REQUESTS
// ==============================
export const fetchDocumentRequests = async () => {
  try {
    const res = await axiosInstance.get("/api/document_requests");
    return res.data;
  } catch (error) {
    handleError(error, "fetchDocumentRequests");
  }
};

export const createDocumentRequest = async (documentData) => {
  try {
    const res = await axiosInstance.post("/api/document_requests", documentData);
    return res.data;
  } catch (error) {
    handleError(error, "createDocumentRequest");
  }
};

export const deleteDocumentRequest = async (requestId) => {
  try {
    const res = await axiosInstance.delete("/api/document_requests", {
      data: { request_id: requestId },
    });
    return res.data;
  } catch (error) {
    handleError(error, "deleteDocumentRequest");
  }
};
