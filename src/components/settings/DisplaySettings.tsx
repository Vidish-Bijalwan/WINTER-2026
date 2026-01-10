import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const DisplaySettings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="settings-section card">
      <h2>Display Settings</h2>
      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
            className="input"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
          <p className="setting-description">
            Choose your preferred color theme
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="fontSize">Font Size</label>
          <select id="fontSize" className="input" defaultValue="medium">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          <p className="setting-description">
            Adjust the font size for better readability
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="density">Information Density</label>
          <select id="density" className="input" defaultValue="comfortable">
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="spacious">Spacious</option>
          </select>
          <p className="setting-description">
            Control how much information is displayed at once
          </p>
        </div>

        <div className="form-group">
          <label>
            <input type="checkbox" defaultChecked />
            Show Animations
          </label>
          <p className="setting-description">
            Enable smooth transitions and animations
          </p>
        </div>

        <button className="btn btn-primary">Save Display Settings</button>
      </div>
    </div>
  );
};

export default DisplaySettings;
