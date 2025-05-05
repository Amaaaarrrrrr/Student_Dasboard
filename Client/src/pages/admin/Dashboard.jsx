import React from 'react';
import "../../index.css"; // Import your CSS file for styles

const Dashboard = () => {
  // Sample data for dashboard stats
  const stats = [
    { id: 1, label: 'Total Users', value: 1200 },
    { id: 2, label: 'Active Courses', value: 35 },
    { id: 3, label: 'Pending Clearances', value: 8 },
    { id: 4, label: 'Hostel Bookings', value: 45 },
  ];

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.id} className="stat-card">
            <h2>{stat.value}</h2>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
