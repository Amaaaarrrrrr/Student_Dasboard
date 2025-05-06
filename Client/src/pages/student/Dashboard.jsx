import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Student Dashboard</h1>
      <p>Welcome to your student Portal!!</p>

      <button onClick={() => navigate('/profile')}>Profile</button>
      <button onClick={() => navigate('/unit-registration')}>Unit Registration</button>
      <button onClick={() => navigate('/accommodation')}>Accommodation</button>
      <button onClick={() => navigate('/fees')}>Fees</button>
      <button onClick={() => navigate('/clearance')}>Clearance</button>
      <button onClick={() => navigate('/documents')}>Documents</button>
      <button onClick={() => navigate('/grades')}>Grades</button>
    </div>
  );
};

export default Dashboard;
