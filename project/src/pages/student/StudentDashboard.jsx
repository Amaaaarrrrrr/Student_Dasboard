import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [summary, setSummary] = useState({
    registeredCourses: 0,
    hostelBookings: 0,
    unpaidFees: 0,
    grades: 0,
  });

  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    fetchStudentProfile();
    fetchSummaryData();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/api/student/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(res.data);
    } catch (err) {
      toast.error('Failed to load student profile. Showing demo data.');
      setStudent({
        full_name: '',
        registration_number: 'SCT123/2023',
        program: 'BSc Computer Science',
      });
    }
  };

  const fetchSummaryData = async () => {
    try {
      const [coursesRes, bookingsRes, feesRes, gradesRes] = await Promise.all([
        axios.get('http://127.0.0.1:5000/api/student/registered-courses', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://127.0.0.1:5000/api/bookings', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://127.0.0.1:5000/api/student/fees', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://127.0.0.1:5000/api/student/grades', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setSummary({
        registeredCourses: coursesRes.data.length,
        hostelBookings: bookingsRes.data.bookings.length,
        unpaidFees: feesRes.data.outstanding || 0,
        grades: gradesRes.data.length,
      });
    } catch (err) {
      toast.error('Failed to load dashboard summary. Showing demo data.');
      setSummary({
        registeredCourses: 4,
        hostelBookings: 1,
        unpaidFees: 15000,
        grades: 3,
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">Welcome, {student?.full_name || 'Student'}!</h1>
      <p className="text-gray-700 mb-6">
        Program: {student?.program} | Reg No: {student?.registration_number}
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Registered Units</h2>
          <p className="text-3xl text-blue-600">{summary.registeredCourses}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Hostel Bookings</h2>
          <p className="text-3xl text-green-600">{summary.hostelBookings}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Outstanding Fees</h2>
          <p className="text-3xl text-red-600">Ksh {summary.unpaidFees}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Grades</h2>
          <p className="text-3xl text-purple-600">{summary.grades}</p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/student/units" className="bg-blue-600 text-white px-4 py-2 rounded">Register Units</Link>
          <Link to="/student/hostel" className="bg-green-600 text-white px-4 py-2 rounded">Book Hostel</Link>
          <Link to="/student/grades" className="bg-purple-600 text-white px-4 py-2 rounded">View Grades</Link>
          <Link to="/student/announcements" className="bg-yellow-500 text-white px-4 py-2 rounded">Announcements</Link>
          <Link to="/student/fees" className="bg-red-600 text-white px-4 py-2 rounded">Pay Fees</Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
