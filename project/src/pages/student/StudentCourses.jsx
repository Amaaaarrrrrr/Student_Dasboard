import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import axios from 'axios';

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/student/courses');
      setCourses(res.data);
    } catch (err) {
      setError('Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>

      <Card title="Enrolled Courses">
        {loading ? (
          <p className="text-gray-500">Loading courses...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : courses.length === 0 ? (
          <p className="text-gray-600">You haven't registered for any courses.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 border">Code</th>
                  <th className="p-2 border">Title</th>
                  <th className="p-2 border">Unit</th>
                  <th className="p-2 border">Lecturer</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="p-2 border">{course.code}</td>
                    <td className="p-2 border">{course.title}</td>
                    <td className="p-2 border">{course.unit}</td>
                    <td className="p-2 border">{course.lecturer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentCourses;
