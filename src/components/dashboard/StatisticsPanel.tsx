import React from 'react';
import { useRealtime } from '../../contexts/RealtimeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './StatisticsPanel.css';

const StatisticsPanel: React.FC = () => {
  const { statistics } = useRealtime();

  const severityData = Object.entries(statistics.anomaliesBySeverity).map(([key, value]) => ({
    name: key.toUpperCase(),
    value,
  }));

  const typeData = Object.entries(statistics.anomaliesByType).map(([key, value]) => ({
    name: key,
    value,
  }));

  const COLORS = ['#00d4ff', '#ff6b6b', '#4ecdc4', '#ffe66d'];

  return (
    <div className="statistics-panel">
      <div className="statistics-grid">
        <div className="stat-card">
          <h3>Total Anomalies</h3>
          <div className="stat-value">{statistics.totalAnomalies}</div>
        </div>
        <div className="stat-card">
          <h3>By Severity</h3>
          <div className="stat-chart-small">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="stat-card stat-card-wide">
          <h3>Anomalies by Type</h3>
          <div className="stat-chart">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
                <YAxis stroke="var(--color-text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-primary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.375rem',
                  }}
                />
                <Bar dataKey="value" fill="var(--color-accent)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
