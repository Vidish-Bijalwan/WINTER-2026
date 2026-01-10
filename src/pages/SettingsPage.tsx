import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import NotificationSettings from '../components/settings/NotificationSettings';
import DisplaySettings from '../components/settings/DisplaySettings';
import DataSourceSettings from '../components/settings/DataSourceSettings';
import './SettingsPage.css';

type SettingsTab = 'notifications' | 'display' | 'data' | 'advanced';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('notifications');
  const { setTheme: _setTheme } = useTheme();
  
  // setTheme is used in DisplaySettings component
  // Keeping it available for future use

  const tabs: Array<{ id: SettingsTab; label: string; icon: string }> = [
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'display', label: 'Display', icon: '🎨' },
    { id: 'data', label: 'Data Sources', icon: '📊' },
    { id: 'advanced', label: 'Advanced', icon: '⚙️' },
  ];

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <div className="settings-container">
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'display' && <DisplaySettings />}
          {activeTab === 'data' && <DataSourceSettings />}
          {activeTab === 'advanced' && (
            <div className="settings-section card">
              <h2>Advanced Settings</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label>API Endpoint</label>
                  <input
                    type="text"
                    defaultValue="https://api.topoforge.com"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label>Cache Duration (seconds)</label>
                  <input type="number" defaultValue={300} className="input" />
                </div>
                <div className="form-group">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Enable Debug Mode
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    <input type="checkbox" />
                    Enable Analytics
                  </label>
                </div>
                <button className="btn btn-primary">Save Advanced Settings</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
