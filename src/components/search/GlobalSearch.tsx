import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import './GlobalSearch.css';

export interface SearchResult {
  id: string;
  type: 'node' | 'edge' | 'anomaly' | 'source';
  title: string;
  description?: string;
  path: string;
}

interface GlobalSearchProps {
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  placeholder?: string;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
  onSearch,
  onResultSelect,
  placeholder = 'Search...',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      performSearch(debouncedQuery);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const performSearch = (searchQuery: string) => {
    // Mock search results - in a real app, this would call an API
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'node' as const,
        title: `Node matching "${searchQuery}"`,
        description: 'Network node',
        path: '/network',
      },
      {
        id: '2',
        type: 'anomaly' as const,
        title: `Anomaly: ${searchQuery}`,
        description: 'Recent anomaly detected',
        path: '/',
      },
      {
        id: '3',
        type: 'source' as const,
        title: `Data Source: ${searchQuery}`,
        description: 'Data source configuration',
        path: '/settings',
      },
    ].filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));

    setResults(mockResults);
    onSearch?.(searchQuery);
  };

  const handleResultClick = (result: SearchResult) => {
    onResultSelect?.(result);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="global-search" onKeyDown={handleKeyDown}>
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      {isOpen && results.length > 0 && (
        <div className="search-results">
          {results.map(result => (
            <div
              key={result.id}
              className="search-result-item"
              onClick={() => handleResultClick(result)}
            >
              <div className="result-type">{result.type}</div>
              <div className="result-content">
                <div className="result-title">{result.title}</div>
                {result.description && (
                  <div className="result-description">{result.description}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {isOpen && query && results.length === 0 && (
        <div className="search-results">
          <div className="search-no-results">No results found</div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
