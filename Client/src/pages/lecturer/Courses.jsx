import React, { useState, useEffect } from 'react';
import CourseCard from '../../components/Shared/CourseCard';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/courses?audience=lecturer');
        if (!response.ok) {
          throw new Error(`Failed to fetch courses: ${response.statusText}`);
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-center text-gray-500">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <p className="text-center text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Lecturer Courses</h1>

      {courses.length === 0 ? (
        <p className="text-center text-gray-500">No courses assigned to you.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
