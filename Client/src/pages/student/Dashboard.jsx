import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Student Dashboard</h1>
      <p>Welcome to your student Portal!!</p>

      
    </div>
  );
};

export default Dashboard;
