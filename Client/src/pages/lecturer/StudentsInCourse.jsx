import React, { useState, useEffect } from 'react';

const StudentsInCourse = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch lecturer's courses
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/courses?audience=lecturer')
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => setError('Failed to load courses.'));
  }, []);

  // Fetch students when course changes
  useEffect(() => {
    if (selectedCourse) {
      setLoading(true);
      fetch(`http://127.0.0.1:5000/api/students?course_id=${selectedCourse}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load students.');
          return res.json();
        })
        .then((data) => {
          setStudents(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [selectedCourse]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center">Students in Course</h2>

      {/* Course Selector */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Select Course:</label>
        <select
          className="border rounded p-2 w-full"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">-- Select a course --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.code})
            </option>
          ))}
        </select>
      </div>

      {/* Loading and Error States */}
      {loading && <p className="text-center">Loading students...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Student List */}
      {selectedCourse && students.length > 0 && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Student ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border px-4 py-2">{student.id}</td>
                <td className="border px-4 py-2">{student.name}</td>
                <td className="border px-4 py-2">{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* No students */}
      {selectedCourse && !loading && students.length === 0 && (
        <p className="text-center text-gray-500">
          No students enrolled in this course.
        </p>
      )}
    </div>
  );
};

export default StudentsInCourse;
