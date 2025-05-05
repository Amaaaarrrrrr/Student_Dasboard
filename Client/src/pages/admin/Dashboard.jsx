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
        {/* Add dashboard widgets, charts, or other components here */}
      </section>
    </main>
  );
};

export default Dashboard;
