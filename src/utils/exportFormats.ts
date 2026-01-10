export type ExportFormat = 'json' | 'csv' | 'png' | 'svg' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  includeMetadata?: boolean;
  filename?: string;
}

export const exportAsJSON = (data: any, options: ExportOptions): string => {
  const exportData = {
    ...data,
    ...(options.includeMetadata && {
      metadata: {
        exportedAt: new Date().toISOString(),
        exportedBy: 'TopoForge',
        version: '1.0.0',
      },
    }),
  };
  return JSON.stringify(exportData, null, 2);
};

export const exportAsCSV = (data: Array<Record<string, any>>): string => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value).replace(/"/g, '""');
    })
  );

  const csvRows = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ];

  return csvRows.join('\n');
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getMimeType = (format: ExportFormat): string => {
  switch (format) {
    case 'json':
      return 'application/json';
    case 'csv':
      return 'text/csv';
    case 'png':
      return 'image/png';
    case 'svg':
      return 'image/svg+xml';
    case 'pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
};

export const getFileExtension = (format: ExportFormat): string => {
  return format;
};
