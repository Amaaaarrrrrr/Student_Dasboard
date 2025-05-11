import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GradesSubmission() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    course_id: '',
    semester_id: '',
    grade: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem('token'); // JWT to

  // Fetch dropdown data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes, semestersRes] = await Promise.all([
          axios.get('http://127.0.0.1:5000/api/students', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/http://127.0.0.1:5000/api/courses', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/http://127.0.0.1:5000/api/semesters', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
        setSemesters(semestersRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        ('Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Handle form input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit the grade
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(
        'http://127.0.0.1:5000/api/grades',
        formData, // send as JSON
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Grade submitted successfully!');
      setFormData({
        student_id: '',
        course_id: '',
        semester_id: '',
        grade: '',
      });
    } catch (err) {
      console.error('Error submitting grade:', err);
      alert(err.response?.data?.error || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6">Loading data...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Grades</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Select Student */}
        <div>
          <label className="block font-semibold mb-1">Student</label>
          <select
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            required
            className="border rounded p-2 w-full"
          >
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Select Course */}
        <div>
          <label className="block font-semibold mb-1">Course</label>
          <select
            name="course_id"
            value={formData.course_id}
            onChange={handleChange}
            required
            className="border rounded p-2 w-full"
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
            ))}
          </select>
        </div>

        {/* Select Semester */}
        <div>
          <label className="block font-semibold mb-1">Semester</label>
          <select
            name="semester_id"
            value={formData.semester_id}
            onChange={handleChange}
            required
            className="border rounded p-2 w-full"
          >
            <option value="">Select semester</option>
            {semesters.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Enter Grade */}
        <div>
          <label className="block font-semibold mb-1">Grade</label>
          <input
            type="text"
            name="grade"
            placeholder="e.g., A, B+, 85"
            value={formData.grade}
            onChange={handleChange}
            required
            className="border rounded p-2 w-32"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`mt-4 px-4 py-2 rounded ${
            submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white'
          }`}
        >
          {submitting ? 'Submitting...' : 'Submit Grade'}
        </button>
      </form>
    </div>
  );
}

export default GradesSubmission;
