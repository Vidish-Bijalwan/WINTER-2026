import React, { useState } from 'react';
import { ExportFormat, exportAsJSON, exportAsCSV, downloadFile, getMimeType } from '../../utils/exportFormats';
import html2canvas from 'html2canvas';
import './ExportDialog.css';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
  elementToExport?: HTMLElement | null;
  defaultFilename?: string;
}

const ExportDialog: React.FC<ExportDialogProps> = ({
  isOpen,
  onClose,
  data,
  elementToExport,
  defaultFilename = 'export',
}) => {
  const [format, setFormat] = useState<ExportFormat>('json');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [filename, setFilename] = useState(defaultFilename);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);

    try {
      let content: string = '';
      let mimeType: string = '';
      let fileExtension: string = '';

      switch (format) {
        case 'json':
          content = exportAsJSON(data || {}, { format, includeMetadata, filename });
          mimeType = getMimeType('json');
          fileExtension = 'json';
          break;

        case 'csv':
          if (Array.isArray(data)) {
            content = exportAsCSV(data);
            mimeType = getMimeType('csv');
            fileExtension = 'csv';
          } else {
            alert('CSV export requires array data');
            setIsExporting(false);
            return;
          }
          break;

        case 'png':
        case 'svg':
          if (elementToExport) {
            const canvas = await html2canvas(elementToExport);
            if (format === 'png') {
              canvas.toBlob(blob => {
                if (blob) {
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `${filename}.png`;
                  link.click();
                  URL.revokeObjectURL(url);
                }
              });
            } else {
              // SVG export would require additional library
              alert('SVG export not yet implemented');
            }
            setIsExporting(false);
            return;
          } else {
            alert('No element selected for image export');
            setIsExporting(false);
            return;
          }

        default:
          alert(`Export format ${format} not yet implemented`);
          setIsExporting(false);
          return;
      }

      downloadFile(content, `${filename}.${fileExtension}`, mimeType);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="export-dialog-overlay" onClick={onClose}>
      <div className="export-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Export Data</h2>
          <button onClick={onClose} className="dialog-close" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="dialog-content">
          <div className="form-group">
            <label htmlFor="format">Export Format</label>
            <select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value as ExportFormat)}
              className="input"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="png">PNG Image</option>
              <option value="svg">SVG Image</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="filename">Filename</label>
            <input
              id="filename"
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="input"
            />
          </div>

          {format === 'json' && (
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                />
                Include Metadata
              </label>
            </div>
          )}
        </div>

        <div className="dialog-actions">
          <button onClick={onClose} className="btn btn-secondary" disabled={isExporting}>
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="btn btn-primary"
            disabled={isExporting || !filename.trim()}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;
