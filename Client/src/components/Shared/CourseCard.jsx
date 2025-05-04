import React from 'react';
import { BookOpen } from 'lucide-react';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-lg transition duration-300">
      <div className="flex items-center mb-2">
        <BookOpen className="text-blue-600 mr-2" size={20} />
        <h3 className="text-lg font-semibold">{course.name}</h3>
      </div>
      <p className="text-gray-600 mb-2">{course.description}</p>
      <div className="text-sm text-gray-500">
        <p><strong>Code:</strong> {course.code}</p>
        <p><strong>Instructor:</strong> {course.instructor}</p>
      </div>
    </div>
  );
};

export default CourseCard;
