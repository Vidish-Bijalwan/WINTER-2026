import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface Anomaly {
  id: string;
  timestamp: Date;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface DataSource {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'error';
  lastUpdate: Date;
  recordCount: number;
}

interface RealtimeContextType {
  anomalies: Anomaly[];
  dataSources: DataSource[];
  statistics: {
    totalAnomalies: number;
    anomaliesBySeverity: Record<string, number>;
    anomaliesByType: Record<string, number>;
  };
  addAnomaly: (anomaly: Omit<Anomaly, 'id' | 'timestamp'>) => void;
  updateDataSource: (id: string, updates: Partial<DataSource>) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: 'source-1',
      name: 'Network Monitor',
      status: 'online',
      lastUpdate: new Date(),
      recordCount: 1250,
    },
    {
      id: 'source-2',
      name: 'System Logs',
      status: 'online',
      lastUpdate: new Date(),
      recordCount: 3420,
    },
    {
      id: 'source-3',
      name: 'Database Metrics',
      status: 'offline',
      lastUpdate: new Date(Date.now() - 300000),
      recordCount: 890,
    },
  ]);

  // Calculate statistics
  const statistics = {
    totalAnomalies: anomalies.length,
    anomaliesBySeverity: anomalies.reduce((acc, anomaly) => {
      acc[anomaly.severity] = (acc[anomaly.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    anomaliesByType: anomalies.reduce((acc, anomaly) => {
      acc[anomaly.type] = (acc[anomaly.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  const addAnomaly = useCallback((anomaly: Omit<Anomaly, 'id' | 'timestamp'>) => {
    const newAnomaly: Anomaly = {
      ...anomaly,
      id: `anomaly-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };
    setAnomalies(prev => [newAnomaly, ...prev].slice(0, 100)); // Keep last 100
  }, []);

  const updateDataSource = useCallback((id: string, updates: Partial<DataSource>) => {
    setDataSources(prev =>
      prev.map(source => (source.id === id ? { ...source, ...updates } : source))
    );
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional anomalies
      if (Math.random() > 0.7) {
        const types = ['Network Anomaly', 'Performance Issue', 'Security Alert', 'Data Quality'];
        const severities: Anomaly['severity'][] = ['low', 'medium', 'high', 'critical'];
        const sources = dataSources.map(s => s.name);

        addAnomaly({
          type: types[Math.floor(Math.random() * types.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          source: sources[Math.floor(Math.random() * sources.length)],
          description: `Detected ${types[Math.floor(Math.random() * types.length)].toLowerCase()}`,
        });
      }

      // Update data source statuses
      dataSources.forEach(source => {
        if (Math.random() > 0.9) {
          const statuses: DataSource['status'][] = ['online', 'offline', 'error'];
          updateDataSource(source.id, {
            status: statuses[Math.floor(Math.random() * statuses.length)],
            lastUpdate: new Date(),
            recordCount: source.recordCount + Math.floor(Math.random() * 10),
          });
        }
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [dataSources, addAnomaly, updateDataSource]);

  return (
    <RealtimeContext.Provider
      value={{
        anomalies,
        dataSources,
        statistics,
        addAnomaly,
        updateDataSource,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within RealtimeProvider');
  }
  return context;
};
