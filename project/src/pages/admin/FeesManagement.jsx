import React from 'react';

const FeesManagement = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Fee Management</h1>
      <p className="mb-4">Set and update fee structures for different programs.</p>
      <form className="space-y-4 max-w-lg">
        <input type="text" placeholder="Program Name" className="w-full p-3 border rounded" />
        <input type="number" placeholder="Amount (KES)" className="w-full p-3 border rounded" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save
        </button>
      </form>
    </div>
  );
};

export default FeesManagement;
