import React, { useState } from 'react';

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
  });

  const handleInputChange = (e) => {
    setNewAssignment({
      ...newAssignment,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAssignment = (e) => {
    e.preventDefault();
    if (!newAssignment.title) return;
    setAssignments([
      ...assignments,
      { id: assignments.length + 1, ...newAssignment },
    ]);
    setNewAssignment({ title: '', description: '', dueDate: '' });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Assignments</h1>

      {/* Form to add assignment */}
      <form onSubmit={handleAddAssignment} className="space-y-4 mb-8">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={newAssignment.title}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={newAssignment.description}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={newAssignment.dueDate}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Share Assignment
        </button>
      </form>

      {/* List of shared assignments */}
      <div className="space-y-4">
        {assignments.length === 0 ? (
          <p>No assignments shared yet.</p>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="border rounded p-4 shadow-sm"
            >
              <h2 className="text-lg font-semibold">{assignment.title}</h2>
              <p>{assignment.description}</p>
              <p className="text-sm text-gray-500">
                Due: {assignment.dueDate}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Assignments;


//  State and logic for managing assignments
// Form for sharing assignments
// List to display assignments shared by lecturer