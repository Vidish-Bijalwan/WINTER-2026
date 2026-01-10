import React from 'react';
import { useRealtime } from '../../contexts/RealtimeContext';
import './SourceMonitor.css';

const SourceMonitor: React.FC = () => {
  const { dataSources } = useRealtime();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#4ade80';
      case 'offline':
        return '#9ca3af';
      case 'error':
        return '#f87171';
      default:
        return '#9ca3af';
    }
  };

  const formatLastUpdate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  return (
    <div className="source-monitor card">
      <h2>Data Sources</h2>
      <div className="sources-list">
        {dataSources.map(source => (
          <div key={source.id} className="source-item">
            <div className="source-header">
              <div className="source-name-status">
                <span
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(source.status) }}
                />
                <h3>{source.name}</h3>
              </div>
              <span className={`status-badge status-${source.status}`}>
                {source.status}
              </span>
            </div>
            <div className="source-details">
              <div className="source-detail">
                <span className="detail-label">Records:</span>
                <span className="detail-value">{source.recordCount.toLocaleString()}</span>
              </div>
              <div className="source-detail">
                <span className="detail-label">Last Update:</span>
                <span className="detail-value">{formatLastUpdate(source.lastUpdate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SourceMonitor;
