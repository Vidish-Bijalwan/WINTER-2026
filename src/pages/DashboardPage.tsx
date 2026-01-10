import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <DashboardLayout />
    </div>
  );
};

export default DashboardPage;
