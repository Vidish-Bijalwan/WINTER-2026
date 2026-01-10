import React, { useState } from 'react';
import './AdvancedFilters.css';

export interface FilterOptions {
  dateRange?: {
    start: Date;
    end: Date;
  };
  severity?: string[];
  type?: string[];
  source?: string[];
  minValue?: number;
  maxValue?: number;
}

interface AdvancedFiltersProps {
  onFilterChange?: (filters: FilterOptions) => void;
  availableSources?: string[];
  availableTypes?: string[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFilterChange,
  availableSources = [],
  availableTypes = [],
}) => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSeverityToggle = (severity: string) => {
    const current = filters.severity || [];
    const updated = current.includes(severity)
      ? current.filter(s => s !== severity)
      : [...current, severity];
    updateFilter('severity', updated);
  };

  const handleTypeToggle = (type: string) => {
    const current = filters.type || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    updateFilter('type', updated);
  };

  const handleSourceToggle = (source: string) => {
    const current = filters.source || [];
    const updated = current.includes(source)
      ? current.filter(s => s !== source)
      : [...current, source];
    updateFilter('source', updated);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange?.({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="advanced-filters">
      <div className="filters-header">
        <button
          className="filters-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>Advanced Filters</span>
          <span className="filters-icon">{isExpanded ? '▼' : '▶'}</span>
        </button>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="btn btn-secondary btn-sm">
            Clear All
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="filters-content">
          <div className="filter-group">
            <label>Severity</label>
            <div className="filter-checkboxes">
              {['low', 'medium', 'high', 'critical'].map(severity => (
                <label key={severity} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.severity?.includes(severity) || false}
                    onChange={() => handleSeverityToggle(severity)}
                  />
                  <span>{severity}</span>
                </label>
              ))}
            </div>
          </div>

          {availableTypes.length > 0 && (
            <div className="filter-group">
              <label>Type</label>
              <div className="filter-checkboxes">
                {availableTypes.map(type => (
                  <label key={type} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.type?.includes(type) || false}
                      onChange={() => handleTypeToggle(type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {availableSources.length > 0 && (
            <div className="filter-group">
              <label>Source</label>
              <div className="filter-checkboxes">
                {availableSources.map(source => (
                  <label key={source} className="filter-checkbox">
                    <input
                      type="checkbox"
                      checked={filters.source?.includes(source) || false}
                      onChange={() => handleSourceToggle(source)}
                    />
                    <span>{source}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="filter-group">
            <label htmlFor="minValue">Min Value</label>
            <input
              id="minValue"
              type="number"
              value={filters.minValue || ''}
              onChange={(e) =>
                updateFilter('minValue', e.target.value ? Number(e.target.value) : undefined)
              }
              className="input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="maxValue">Max Value</label>
            <input
              id="maxValue"
              type="number"
              value={filters.maxValue || ''}
              onChange={(e) =>
                updateFilter('maxValue', e.target.value ? Number(e.target.value) : undefined)
              }
              className="input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              id="startDate"
              type="date"
              value={
                filters.dateRange?.start
                  ? filters.dateRange.start.toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) =>
                updateFilter('dateRange', {
                  ...filters.dateRange,
                  start: e.target.value ? new Date(e.target.value) : new Date(),
                  end: filters.dateRange?.end || new Date(),
                })
              }
              className="input"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              value={
                filters.dateRange?.end
                  ? filters.dateRange.end.toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) =>
                updateFilter('dateRange', {
                  ...filters.dateRange,
                  start: filters.dateRange?.start || new Date(),
                  end: e.target.value ? new Date(e.target.value) : new Date(),
                })
              }
              className="input"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
