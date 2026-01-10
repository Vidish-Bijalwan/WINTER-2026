import React, { useState } from 'react';
import '../settings/NotificationSettings.css';

const DataSourceSettings: React.FC = () => {
  const [sources, setSources] = useState([
    { id: '1', name: 'Network Monitor', enabled: true, refreshInterval: 5 },
    { id: '2', name: 'System Logs', enabled: true, refreshInterval: 10 },
    { id: '3', name: 'Database Metrics', enabled: false, refreshInterval: 15 },
  ]);

  const handleToggle = (id: string) => {
    setSources(prev =>
      prev.map(source =>
        source.id === id ? { ...source, enabled: !source.enabled } : source
      )
    );
  };

  const handleIntervalChange = (id: string, interval: number) => {
    setSources(prev =>
      prev.map(source =>
        source.id === id ? { ...source, refreshInterval: interval } : source
      )
    );
  };

  return (
    <div className="settings-section card">
      <h2>Data Source Settings</h2>
      <div className="settings-form">
        {sources.map(source => (
          <div key={source.id} className="data-source-item">
            <div className="data-source-header">
              <label>
                <input
                  type="checkbox"
                  checked={source.enabled}
                  onChange={() => handleToggle(source.id)}
                />
                {source.name}
              </label>
            </div>
            {source.enabled && (
              <div className="data-source-config">
                <div className="form-group">
                  <label htmlFor={`interval-${source.id}`}>
                    Refresh Interval (seconds)
                  </label>
                  <input
                    id={`interval-${source.id}`}
                    type="number"
                    min="1"
                    value={source.refreshInterval}
                    onChange={(e) =>
                      handleIntervalChange(source.id, Number(e.target.value))
                    }
                    className="input"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        <button className="btn btn-secondary">Add Data Source</button>
        <button className="btn btn-primary">Save Data Source Settings</button>
      </div>
    </div>
  );
};

export default DataSourceSettings;
