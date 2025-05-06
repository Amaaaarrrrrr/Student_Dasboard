import React from 'react';

const CourseCard = ({ courseName, courseCode, instructor }) => {
  return (
    <div className="course-card">
      <h2>{courseName}</h2>
      <p>Code: {courseCode}</p>
      <p>Instructor: {instructor}</p>
    </div>
  );
};

export default CourseCard;
