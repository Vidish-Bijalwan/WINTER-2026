import React, { useState } from 'react';
import NetworkGraph3D from '../components/visualizations/NetworkGraph3D';
import NetworkControls from '../components/visualizations/NetworkControls';
import './NetworkPage.css';

const NetworkPage: React.FC = () => {
  // These state variables are used by NetworkControls component callbacks
  // They're kept for future integration with NetworkGraph3D filtering
  const [, setSearchQuery] = useState('');
  const [, setFilters] = useState<any>({});

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // In a real app, this would trigger filtering in NetworkGraph3D
  };
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // In a real app, this would trigger filtering in NetworkGraph3D
  };

  return (
    <div className="network-page">
      <div className="network-header">
        <h1>3D Network Visualization</h1>
      </div>
      <div className="network-content">
        <div className="network-visualization">
          <NetworkGraph3D />
        </div>
        <NetworkControls
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onResetCamera={() => {}}
          onExportImage={() => {}}
          onExportJSON={() => {}}
        />
      </div>
    </div>
  );
};

export default NetworkPage;
