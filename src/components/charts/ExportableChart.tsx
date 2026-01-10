import React, { useRef, useState } from 'react';
import ExportDialog from '../export/ExportDialog';
import './ExportableChart.css';

interface ExportableChartProps {
  children: React.ReactNode;
  data?: any;
  title?: string;
}

const ExportableChart: React.FC<ExportableChartProps> = ({
  children,
  data,
  title = 'chart',
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);

  return (
    <div className="exportable-chart">
      <div className="chart-header">
        {title && <h3>{title}</h3>}
        <button
          onClick={() => setShowExportDialog(true)}
          className="btn btn-secondary btn-sm"
        >
          Export
        </button>
      </div>
      <div ref={chartRef} className="chart-content">
        {children}
      </div>
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        data={data}
        elementToExport={chartRef.current}
        defaultFilename={title}
      />
    </div>
  );
};

export default ExportableChart;
