// Api.js

import axios from 'axios';

// ✅ Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ Auth Service
export const authService = {
  login: (credentials) => api.post('/api/login', credentials),
  register: (data) => api.post('/api/register', data),
  getProfile: () => api.get('/api/profile'),
};

// ✅ Student Service
export const studentService = {
  getProfile: () => api.get('/api/profile'),
  registerUnits: (data) => api.post('/api/registration', data),
  getFees: () => api.get('/api/payments'),
  getFeeStructure: () => api.get('/api/fee-structure'),
  getClearanceStatus: () => api.get('/api/clearance'),
};

// ✅ Lecturer Service
export const lecturerService = {
  getCourses: () => api.get('/api/courses'),
  submitGrades: (data) => api.post('/api/grades', data),
  getGrades: (courseId) => api.get(`/api/grades?courseId=${courseId}`),
  createAnnouncement: (data) => api.post('/api/announcements', data),
};

// ✅ Admin Service
export const adminService = {
  getDashboardStats: () => api.get('/api/admin_dashboard'),
  getAllUsers: () => api.get('/api/users'),
  createUser: (data) => api.post('/api/register', data),
  manageFees: (data) => api.post('/api/fee-structure', data),
  assignLecturers: (data) => api.post('/admin/assign_lecturer', data),
};

// ✅ Course Service (shared)
export const courseService = {
  getAllCourses: () => api.get('/api/courses'),
  getCourseById: (id) => api.get(`/api/courses/${id}`),
};

// ✅ Export the Axios instance (optional)
export default api;
