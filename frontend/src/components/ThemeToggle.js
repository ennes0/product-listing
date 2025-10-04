import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <button 
        className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      >
        <div className="toggle-track">
          <div className="toggle-thumb">
            <span className="toggle-icon">
              {isDarkMode ? '🌙' : '☀️'}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ThemeToggle;