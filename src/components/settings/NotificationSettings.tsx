import React, { useState } from 'react';

const NotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    anomalyAlerts: true,
    systemUpdates: true,
    weeklyReports: false,
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  return (
    <div className="settings-section card">
      <h2>Notification Settings</h2>
      <div className="settings-form">
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
            />
            Email Notifications
          </label>
          <p className="setting-description">
            Receive notifications via email
          </p>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={() => handleToggle('pushNotifications')}
            />
            Push Notifications
          </label>
          <p className="setting-description">
            Receive browser push notifications
          </p>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={settings.anomalyAlerts}
              onChange={() => handleToggle('anomalyAlerts')}
            />
            Anomaly Alerts
          </label>
          <p className="setting-description">
            Get notified when anomalies are detected
          </p>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={settings.systemUpdates}
              onChange={() => handleToggle('systemUpdates')}
            />
            System Updates
          </label>
          <p className="setting-description">
            Receive notifications about system updates and maintenance
          </p>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={settings.weeklyReports}
              onChange={() => handleToggle('weeklyReports')}
            />
            Weekly Reports
          </label>
          <p className="setting-description">
            Receive weekly summary reports
          </p>
        </div>

        <button className="btn btn-primary">Save Notification Settings</button>
      </div>
    </div>
  );
};

export default NotificationSettings;
