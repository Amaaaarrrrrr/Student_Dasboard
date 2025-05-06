import React from 'react';
import '../../index.css'; // Import global CSS

// Reusable StatCard component
const StatCard = ({ label, value }) => {
  return (
    <div className="statCard" role="region" aria-label={label}>
      <h2 className="statValue">{value}</h2>
      <p className="statLabel">{label}</p>
    </div>
  );
};

const Dashboard = () => {
  return (
    <main className="adminDashboard" role="main" aria-label="Admin Dashboard">
      <header>
        <h1 className="pageTitle">Admin Dashboard</h1>
      </header>
      <section aria-label="Dashboard overview">
        <p>Welcome to the Admin Dashboard.</p>
      </section>
      <section aria-label="Dashboard content">
        {/* Example dashboard widgets */}
        <StatCard label="Total Users" value="150" />
        <StatCard label="Active Sessions" value="45" />
        <StatCard label="Pending Requests" value="12" />
      </section>
    </main>
  );
};

export default Dashboard;
