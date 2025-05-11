import React from 'react';

const StudentRegistrationApproval = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Registration Approval</h1>
      <ul className="space-y-3">
        <li className="flex justify-between border-b pb-2">
          <span>Mary Njoki - BSc. Computer Science</span>
          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Approve</button>
        </li>
        <li className="flex justify-between border-b pb-2">
          <span>Peter Otieno - BSc. Mathematics</span>
          <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Approve</button>
        </li>
      </ul>
    </div>
  );
};

export default StudentRegistrationApproval;
