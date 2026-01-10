import React, { useState, useMemo } from 'react';
import { PersistencePoint, pointsToBarcodes, filterByDimension, filterByPersistence, generateSamplePersistenceData } from '../../utils/persistenceCalculations';
import './PersistenceBarcode.css';

interface PersistenceBarcodeProps {
  data?: PersistencePoint[];
  onBarClick?: (point: PersistencePoint) => void;
  onBarHover?: (point: PersistencePoint | null) => void;
}

const dimensionColors: Record<number, string> = {
  0: '#00d4ff',
  1: '#ff6b6b',
  2: '#4ecdc4',
  3: '#ffe66d',
};

const PersistenceBarcode: React.FC<PersistenceBarcodeProps> = ({
  data: providedData,
  onBarClick,
  onBarHover,
}) => {
  const [selectedDimension, setSelectedDimension] = useState<number | null>(null);
  const [minPersistence, setMinPersistence] = useState(0);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Generate sample data if none provided
  const data = providedData || useMemo(() => {
    return generateSamplePersistenceData();
  }, []);

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

  // Convert to barcodes
  const barcodes = useMemo(() => pointsToBarcodes(filteredData), [filteredData]);

  // Create a map for quick lookup
  const pointMap = useMemo(
    () => new Map(data.map((p: PersistencePoint) => [p.id, p])),
    [data]
  );

  // Calculate max value for scaling
  const maxValue = Math.max(
    ...data.map((p: PersistencePoint) => Math.max(p.birth, p.death)),
    1
  );

  const handleBarClick = (barId: string) => {
    const point = pointMap.get(barId);
    if (point) {
      onBarClick?.(point);
    }
  };

  const handleBarHover = (barId: string | null) => {
    setHoveredBar(barId);
    if (barId) {
      const point = pointMap.get(barId) as PersistencePoint | undefined;
      onBarHover?.(point || null);
    } else {
      onBarHover?.(null);
    }
  };

  return (
    <div className="persistence-barcode">
      <div className="barcode-controls">
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

      <div className="barcode-container">
        {barcodes.length === 0 ? (
          <div className="barcode-empty">No barcodes to display</div>
        ) : (
          barcodes.map(barcode => (
            <div key={barcode.dimension} className="barcode-dimension-group">
              <div className="barcode-dimension-header">
                <h4>H{barcode.dimension}</h4>
                <span className="barcode-count">{barcode.bars.length} bars</span>
              </div>
              <div className="barcode-bars">
                {barcode.bars.map((bar) => {
                  const point = pointMap.get(bar.id) as PersistencePoint | undefined;
                  const width = ((bar.death - bar.birth) / maxValue) * 100;
                  const left = (bar.birth / maxValue) * 100;
                  const isHovered = hoveredBar === bar.id;
                  const color = dimensionColors[barcode.dimension] || '#999';

                  return (
                    <div
                      key={bar.id}
                      className={`barcode-bar ${isHovered ? 'hovered' : ''}`}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        backgroundColor: color,
                        opacity: isHovered ? 1 : 0.7,
                      }}
                      onClick={() => handleBarClick(bar.id)}
                      onMouseEnter={() => handleBarHover(bar.id)}
                      onMouseLeave={() => handleBarHover(null)}
                      title={point?.label || `Birth: ${bar.birth.toFixed(3)}, Death: ${bar.death.toFixed(3)}`}
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="barcode-scale">
        <span>0</span>
        <span>{maxValue.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default PersistenceBarcode;
