import React from 'react';
import { RealtimeProvider } from '../../contexts/RealtimeContext';
import AnomalyFeed from './AnomalyFeed';
import StatisticsPanel from './StatisticsPanel';
import SourceMonitor from './SourceMonitor';
import './DashboardLayout.css';

const DashboardLayout: React.FC = () => {
  return (
    <RealtimeProvider>
      <div className="dashboard-layout">
        <div className="dashboard-grid">
          <div className="dashboard-section statistics-section">
            <StatisticsPanel />
          </div>
          <div className="dashboard-section sources-section">
            <SourceMonitor />
          </div>
          <div className="dashboard-section feed-section">
            <AnomalyFeed />
          </div>
        </div>
      </div>
    </RealtimeProvider>
  );
};

export default DashboardLayout;
