import React, { useState } from 'react';
import './ReportBuilder.css';

export interface ReportSection {
  id: string;
  type: 'text' | 'chart' | 'table' | 'image';
  title: string;
  content: any;
}

interface ReportBuilderProps {
  onGenerate?: (sections: ReportSection[]) => void;
}

const ReportBuilder: React.FC<ReportBuilderProps> = ({ onGenerate }) => {
  const [sections, setSections] = useState<ReportSection[]>([]);
  const [title, setTitle] = useState('');

  const addSection = (type: ReportSection['type']) => {
    const newSection: ReportSection = {
      id: `section-${Date.now()}`,
      type,
      title: `New ${type} Section`,
      content: '',
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const updateSection = (id: string, updates: Partial<ReportSection>) => {
    setSections(sections.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleGenerate = () => {
    onGenerate?.(sections);
  };

  return (
    <div className="report-builder card">
      <div className="builder-header">
        <h2>Report Builder</h2>
        <div className="builder-actions">
          <input
            type="text"
            placeholder="Report Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            style={{ maxWidth: '300px' }}
          />
          <button onClick={handleGenerate} className="btn btn-primary">
            Generate Report
          </button>
        </div>
      </div>

      <div className="builder-toolbar">
        <button onClick={() => addSection('text')} className="btn btn-secondary">
          Add Text
        </button>
        <button onClick={() => addSection('chart')} className="btn btn-secondary">
          Add Chart
        </button>
        <button onClick={() => addSection('table')} className="btn btn-secondary">
          Add Table
        </button>
        <button onClick={() => addSection('image')} className="btn btn-secondary">
          Add Image
        </button>
      </div>

      <div className="builder-sections">
        {sections.length === 0 ? (
          <div className="builder-empty">
            <p>No sections added yet. Click the buttons above to add sections.</p>
          </div>
        ) : (
          sections.map(section => (
            <div key={section.id} className="builder-section">
              <div className="section-header">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                  className="input section-title-input"
                />
                <button
                  onClick={() => removeSection(section.id)}
                  className="btn btn-secondary btn-sm"
                >
                  Remove
                </button>
              </div>
              <div className="section-content">
                {section.type === 'text' && (
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, { content: e.target.value })}
                    className="input"
                    rows={4}
                    placeholder="Enter text content..."
                  />
                )}
                {section.type === 'chart' && (
                  <div className="section-placeholder">
                    Chart: {section.title} (Chart configuration UI would go here)
                  </div>
                )}
                {section.type === 'table' && (
                  <div className="section-placeholder">
                    Table: {section.title} (Table configuration UI would go here)
                  </div>
                )}
                {section.type === 'image' && (
                  <div className="section-placeholder">
                    Image: {section.title} (Image upload UI would go here)
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportBuilder;
