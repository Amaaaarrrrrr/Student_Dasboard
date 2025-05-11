import React from 'react';

const AdminAnnouncement = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Announcements</h1>
      <textarea
        className="w-full p-4 border rounded mb-4"
        placeholder="Write a new announcement..."
        rows="5"
      ></textarea>
      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Post Announcement
      </button>
    </div>
  );
};

export default AdminAnnouncement;
