import React, { useMemo, useState } from 'react';
import { useRealtime, Anomaly } from '../../contexts/RealtimeContext';
import './AnomalyFeed.css';

const severityColors: Record<Anomaly['severity'], string> = {
  low: '#4ade80',
  medium: '#fbbf24',
  high: '#f87171',
  critical: '#ef4444',
};

const AnomalyFeed: React.FC = () => {
  const { anomalies } = useRealtime();
  const [filterSeverity, setFilterSeverity] = useState<Anomaly['severity'] | 'all'>('all');
  const [filterSource, setFilterSource] = useState<string>('all');

  const sources = useMemo(() => {
    const uniqueSources = new Set(anomalies.map(a => a.source));
    return Array.from(uniqueSources);
  }, [anomalies]);

  const filteredAnomalies = useMemo(() => {
    return anomalies.filter(anomaly => {
      if (filterSeverity !== 'all' && anomaly.severity !== filterSeverity) {
        return false;
      }
      if (filterSource !== 'all' && anomaly.source !== filterSource) {
        return false;
      }
      return true;
    });
  }, [anomalies, filterSeverity, filterSource]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div className="anomaly-feed card">
      <div className="feed-header">
        <h2>Anomaly Feed</h2>
        <div className="feed-filters">
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as Anomaly['severity'] | 'all')}
            className="input"
          >
            <option value="all">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="input"
          >
            <option value="all">All Sources</option>
            {sources.map(source => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="feed-content">
        {filteredAnomalies.length === 0 ? (
          <div className="feed-empty">No anomalies to display</div>
        ) : (
          <div className="feed-list">
            {filteredAnomalies.slice(0, 50).map(anomaly => (
              <div
                key={anomaly.id}
                className="feed-item"
                style={{
                  borderLeftColor: severityColors[anomaly.severity],
                }}
              >
                <div className="feed-item-header">
                  <span
                    className="severity-badge"
                    style={{ backgroundColor: severityColors[anomaly.severity] }}
                  >
                    {anomaly.severity.toUpperCase()}
                  </span>
                  <span className="feed-time">{formatTime(anomaly.timestamp)}</span>
                </div>
                <div className="feed-item-body">
                  <h4>{anomaly.type}</h4>
                  <p>{anomaly.description}</p>
                  <span className="feed-source">{anomaly.source}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnomalyFeed;
