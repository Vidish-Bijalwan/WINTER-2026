import React from 'react';
import './OfflinePage.css';

const OfflinePage: React.FC = () => {
  return (
    <div className="offline-page">
      <div className="offline-content">
        <h1>You're Offline</h1>
        <p>It looks like you're not connected to the internet.</p>
        <p>Please check your connection and try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default OfflinePage;
