import React from 'react';

const AdminAuth = () => {
  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
      <form className="space-y-4">
        <input type="email" placeholder="Email" className="w-full p-3 border rounded" />
        <input type="password" placeholder="Password" className="w-full p-3 border rounded" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminAuth;
