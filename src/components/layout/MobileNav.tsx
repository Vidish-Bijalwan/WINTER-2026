import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MobileNav.css';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

interface MobileNavProps {
  items: NavItem[];
  currentPath: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ items, currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="mobile-nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
      >
        {isOpen ? '✕' : '☰'}
      </button>
      {isOpen && (
        <>
          <div className="mobile-nav-overlay" onClick={() => setIsOpen(false)} />
          <nav className="mobile-nav">
            <div className="mobile-nav-header">
              <h2>TopoForge</h2>
              <button onClick={() => setIsOpen(false)} aria-label="Close navigation">
                ✕
              </button>
            </div>
            <ul className="mobile-nav-links">
              {items.map(item => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={currentPath === item.path ? 'active' : ''}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </>
  );
};

export default MobileNav;
