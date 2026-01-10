import React, { useState } from 'react';
import './NetworkControls.css';

interface NetworkControlsProps {
  onSearchChange?: (query: string) => void;
  onFilterChange?: (filters: any) => void;
  onResetCamera?: () => void;
  onExportImage?: () => void;
  onExportJSON?: () => void;
}

const NetworkControls: React.FC<NetworkControlsProps> = ({
  onSearchChange,
  onFilterChange,
  onResetCamera,
  onExportImage,
  onExportJSON,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minWeight: '',
    maxWeight: '',
    showLabels: true,
    showEdges: true,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange?.(value);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleExport = (format: 'image' | 'json') => {
    if (format === 'image') {
      onExportImage?.();
    } else {
      onExportJSON?.();
    }
  };

  return (
    <div className="network-controls">
      <div className="controls-section">
        <h3>Controls</h3>
        
        <div className="control-group">
          <label htmlFor="search">Search Nodes</label>
          <input
            id="search"
            type="text"
            placeholder="Search by ID or label..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="input"
          />
        </div>

        <div className="control-group">
          <label htmlFor="minWeight">Min Edge Weight</label>
          <input
            id="minWeight"
            type="number"
            step="0.1"
            placeholder="0.0"
            value={filters.minWeight}
            onChange={(e) => handleFilterChange('minWeight', e.target.value)}
            className="input"
          />
        </div>

        <div className="control-group">
          <label htmlFor="maxWeight">Max Edge Weight</label>
          <input
            id="maxWeight"
            type="number"
            step="0.1"
            placeholder="1.0"
            value={filters.maxWeight}
            onChange={(e) => handleFilterChange('maxWeight', e.target.value)}
            className="input"
          />
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={filters.showLabels}
              onChange={(e) => handleFilterChange('showLabels', e.target.checked)}
            />
            Show Labels
          </label>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={filters.showEdges}
              onChange={(e) => handleFilterChange('showEdges', e.target.checked)}
            />
            Show Edges
          </label>
        </div>
      </div>

      <div className="controls-section">
        <h3>Actions</h3>
        <div className="control-buttons">
          <button onClick={onResetCamera} className="btn btn-secondary">
            Reset Camera
          </button>
          <button onClick={() => handleExport('image')} className="btn btn-secondary">
            Export Image
          </button>
          <button onClick={() => handleExport('json')} className="btn btn-secondary">
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkControls;
