import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Total Courses</h2>
          <p className="text-3xl font-bold">56</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Announcements</h2>
          <p className="text-3xl font-bold">12</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Manage Users
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Manage Courses
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Post Announcement
        </button>
        <button className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100">
          View Reports
        </button>
      </div>

      {/* Recent Announcements */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Announcements</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>New semester starts on September 1st.</li>
          <li>Library will be closed on public holidays.</li>
          <li>Submit your course registration by August 15th.</li>
        </ul>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
        <table className="w-full table-auto text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b p-2 font-medium">Name</th>
              <th className="border-b p-2 font-medium">Email</th>
              <th className="border-b p-2 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Jane Doe</td>
              <td className="p-2">jane@example.com</td>
              <td className="p-2">Student</td>
            </tr>
            <tr>
              <td className="p-2">John Smith</td>
              <td className="p-2">john@example.com</td>
              <td className="p-2">Lecturer</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pending Course Approvals */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Pending Course Approvals</h2>
        <ul className="space-y-2">
          <li className="flex justify-between items-center">
            <span>Intro to AI (Prof. Adams)</span>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
              Approve
            </button>
          </li>
          <li className="flex justify-between items-center">
            <span>Data Structures (Ms. Emily)</span>
            <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
              Approve
            </button>
          </li>
        </ul>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white shadow rounded-lg p-4 text-center">
        <h2 className="text-lg font-semibold mb-2">Enrollment Trends</h2>
        <div className="h-40 flex items-center justify-center text-gray-400">
          [Chart Placeholder]
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
