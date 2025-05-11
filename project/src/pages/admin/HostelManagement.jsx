import React from 'react';

const HostelManagement = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hostel Management</h1>
      <p className="mb-4">Manage hostel room allocations and availability.</p>
      <ul className="space-y-2">
        <li className="flex justify-between border-b pb-2">
          <span>Room 101 - Occupied</span>
          <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">Evict</button>
        </li>
        <li className="flex justify-between border-b pb-2">
          <span>Room 102 - Available</span>
          <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Assign</button>
        </li>
      </ul>
    </div>
  );
};

export default HostelManagement;
