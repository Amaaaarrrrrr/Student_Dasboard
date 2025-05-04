import React, { useState, useEffect } from 'react';

const GradeSubmission = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch courses assigned to the lecturer
    fetch('http://127.0.0.1:5000/api/courses?audience=lecturer')
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      // Fetch students enrolled in the selected course
      fetch(`http://127.0.0.1:5000/api/students?course_id=${selectedCourse}`)
        .then((res) => res.json())
        .then((data) => {
          setStudents(data);
          const initialGrades = {};
          data.forEach((student) => {
            initialGrades[student.id] = '';
          });
          setGrades(initialGrades);
        })
        .catch((err) => console.error(err));
    }
  }, [selectedCourse]);

  const handleGradeChange = (studentId, grade) => {
    setGrades({ ...grades, [studentId]: grade });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:5000/api/submit-grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        course_id: selectedCourse,
        grades: grades,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to submit grades');
        }
        return res.json();
      })
      .then((data) => {
        setMessage('Grades submitted successfully!');
      })
      .catch((err) => {
        setMessage(`Error: ${err.message}`);
      });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center">Grade Submission</h2>

      {/* Course Selection */}
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

      {/* Students and Grade Input */}
      {selectedCourse && students.length > 0 && (
        <form onSubmit={handleSubmit}>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Student ID</th>
                <th className="border px-4 py-2">Student Name</th>
                <th className="border px-4 py-2">Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="border px-4 py-2">{student.id}</td>
                  <td className="border px-4 py-2">{student.name}</td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      className="border rounded p-1 w-full"
                      value={grades[student.id] || ''}
                      onChange={(e) =>
                        handleGradeChange(student.id, e.target.value)
                      }
                      placeholder="Enter grade"
                      required
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Grades
          </button>
        </form>
      )}

      {/* Message */}
      {message && (
        <p className="text-center mt-4 text-green-600 font-semibold">
          {message}
        </p>
      )}

      {/* No students */}
      {selectedCourse && students.length === 0 && (
        <p className="text-center text-gray-500">No students enrolled in this course.</p>
      )}
    </div>
  );
};

export default GradeSubmission;
