import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Icon from '../AppIcon';

const ThemeSwitcher = ({ variant = 'button' }) => {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'menu-item') {
    return (
      <button
        onClick={toggleTheme}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-caption transition-smooth text-popover-foreground hover:bg-muted"
      >
        <div className="flex items-center">
          <Icon
            name={theme === 'dark' ? 'Moon' : 'Sun'}
            size={18}
            className="mr-3"
          />
          <span>Tema {theme === 'dark' ? 'Oscuro' : 'Claro'}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className={`w-10 h-5 rounded-full transition-smooth ${theme === 'dark' ? 'bg-primary' : 'bg-muted'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-smooth transform mt-0.5 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-smooth focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <Icon
        name={theme === 'dark' ? 'Moon' : 'Sun'}
        size={20}
        className="text-foreground"
      />
    </button>
  );
};

export default ThemeSwitcher;
