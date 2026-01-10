import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PersistencePoint, calculatePersistence, filterByDimension, filterByPersistence, generateSamplePersistenceData } from '../../utils/persistenceCalculations';
import './PersistenceDiagram.css';

interface PersistenceDiagramProps {
  data?: PersistencePoint[];
  onPointClick?: (point: PersistencePoint) => void;
  onPointHover?: (point: PersistencePoint | null) => void;
}

const dimensionColors: Record<number, string> = {
  0: '#00d4ff',
  1: '#ff6b6b',
  2: '#4ecdc4',
  3: '#ffe66d',
};

const PersistenceDiagram: React.FC<PersistenceDiagramProps> = ({
  data: providedData,
  onPointClick,
  onPointHover,
}) => {
  const [selectedDimension, setSelectedDimension] = useState<number | null>(null);
  const [minPersistence, setMinPersistence] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<PersistencePoint | null>(null);

  // Generate sample data if none provided
  const data = providedData || useMemo(() => generateSamplePersistenceData(), []);

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = data;
    if (selectedDimension !== null) {
      filtered = filterByDimension(filtered, selectedDimension);
    }
    if (minPersistence > 0) {
      filtered = filterByPersistence(filtered, minPersistence);
    }
    return filtered;
  }, [data, selectedDimension, minPersistence]);

  // Prepare data for scatter chart
  const chartData = filteredData.map((point: PersistencePoint) => {
    const { dimension, ...rest } = point;
    return {
      x: point.birth,
      y: point.death,
      persistence: calculatePersistence(point.birth, point.death),
      dimension,
      ...rest,
    };
  });

  // Find max value for diagonal line
  const maxValue = Math.max(
    ...data.map((p: PersistencePoint) => Math.max(p.birth, p.death)),
    1
  );

  const handlePointClick = (point: PersistencePoint) => {
    onPointClick?.(point);
  };

  const handlePointHover = (point: PersistencePoint | null) => {
    setHoveredPoint(point);
    onPointHover?.(point);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as PersistencePoint;
      return (
        <div className="persistence-tooltip">
          <p><strong>{point.label || `Point ${point.id}`}</strong></p>
          <p>Dimension: {point.dimension}</p>
          <p>Birth: {point.birth.toFixed(3)}</p>
          <p>Death: {point.death.toFixed(3)}</p>
          <p>Persistence: {calculatePersistence(point.birth, point.death).toFixed(3)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="persistence-diagram">
      <div className="diagram-controls">
        <div className="control-group">
          <label>Filter by Dimension:</label>
          <select
            value={selectedDimension ?? ''}
            onChange={(e) => setSelectedDimension(e.target.value ? Number(e.target.value) : null)}
            className="input"
          >
            <option value="">All</option>
            <option value="0">H0 (Components)</option>
            <option value="1">H1 (Loops)</option>
            <option value="2">H2 (Voids)</option>
          </select>
        </div>
        <div className="control-group">
          <label>Min Persistence:</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={minPersistence}
            onChange={(e) => setMinPersistence(Number(e.target.value))}
            className="input"
          />
        </div>
      </div>

      <div className="diagram-chart">
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            onClick={(data) => {
              if (data && data.activePayload) {
                handlePointClick(data.activePayload[0].payload);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              type="number"
              dataKey="birth"
              name="Birth"
              domain={[0, maxValue]}
              stroke="var(--color-text-secondary)"
            />
            <YAxis
              type="number"
              dataKey="death"
              name="Death"
              domain={[0, maxValue]}
              stroke="var(--color-text-secondary)"
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter
              name="Persistence Points"
              data={chartData}
              fill="var(--color-accent)"
            >
              {chartData.map((entry: PersistencePoint & { x: number; y: number; persistence: number }) => (
                <Cell
                  key={`cell-${entry.id}`}
                  fill={dimensionColors[entry.dimension] || '#999'}
                  opacity={hoveredPoint?.id === entry.id ? 1 : 0.7}
                  onMouseEnter={() => handlePointHover(entry)}
                  onMouseLeave={() => handlePointHover(null)}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="diagonal-line-info">
          <p>Diagonal line represents points with zero persistence</p>
        </div>
      </div>

      <div className="diagram-legend">
        <h4>Dimensions:</h4>
        {Object.entries(dimensionColors).map(([dim, color]) => (
          <div key={dim} className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: color }}
            />
            <span>H{dim}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersistenceDiagram;
