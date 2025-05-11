import React from 'react';

const LecturerAssignment = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lecturer Assignment</h1>
      <form className="space-y-4 max-w-xl">
        <input type="text" placeholder="Course Code" className="w-full p-3 border rounded" />
        <input type="text" placeholder="Lecturer Name" className="w-full p-3 border rounded" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Assign
        </button>
      </form>
    </div>
  );
};

export default LecturerAssignment;
