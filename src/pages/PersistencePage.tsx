import React, { useState } from 'react';
import PersistenceDiagram from '../components/visualizations/PersistenceDiagram';
import PersistenceBarcode from '../components/visualizations/PersistenceBarcode';
import { PersistencePoint } from '../utils/persistenceCalculations';
import './PersistencePage.css';

const PersistencePage: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<PersistencePoint | null>(null);

  const handlePointClick = (point: PersistencePoint) => {
    setSelectedPoint(point);
  };

  return (
    <div className="persistence-page">
      <h1>Persistence Diagrams</h1>
      {selectedPoint && (
        <div className="selected-point-info">
          <h3>Selected Point: {selectedPoint.label || selectedPoint.id}</h3>
          <p>Dimension: {selectedPoint.dimension} | Birth: {selectedPoint.birth.toFixed(3)} | Death: {selectedPoint.death.toFixed(3)}</p>
        </div>
      )}
      <div className="persistence-container">
        <div className="persistence-diagram-section">
          <h2>Persistence Diagram</h2>
          <PersistenceDiagram onPointClick={handlePointClick} />
        </div>
        <div className="persistence-barcode-section">
          <h2>Persistence Barcode</h2>
          <PersistenceBarcode onBarClick={handlePointClick} />
        </div>
      </div>
    </div>
  );
};

export default PersistencePage;
