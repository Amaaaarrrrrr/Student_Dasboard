import axios from 'axios';

// Create an Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', // adjust as needed
  withCredentials: true,
});

// Add Authorization header if token is present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or use context if stored differently
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
