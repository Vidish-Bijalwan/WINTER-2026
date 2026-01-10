import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import MobileNav from './MobileNav';
import GlobalSearch from '../search/GlobalSearch';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/network', label: 'Network', icon: '🕸️' },
    { path: '/persistence', label: 'Persistence', icon: '📈' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="layout">
      <nav className="nav-desktop">
        <div className="nav-brand">
          <h1>TopoForge</h1>
        </div>
        <ul className="nav-links">
          {navItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <div className="nav-search">
            <GlobalSearch
              onResultSelect={(result) => navigate(result.path)}
              placeholder="Search..."
            />
          </div>
          <button onClick={toggleTheme} className="btn-theme" aria-label="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>
      <MobileNav items={navItems} currentPath={location.pathname} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
