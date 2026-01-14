import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';
import ThemeSwitcher from './ThemeSwitcher';
import { authService } from '../../services/authService';

const UserProfileHeader = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const userData = await authService.getMe();
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error fetching current user:', error);
        // If error, redirect to login
        navigate('/authentication-and-access-control');
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchCurrentUser();
    } else {
      setCurrentUser(user);
      setLoading(false);
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsDropdownOpen(false);
      navigate('/authentication-and-access-control');
    } catch (error) {
      console.error('Error during logout:', error);
      // Clear local storage and redirect anyway
      localStorage.removeItem('access_token');
      navigate('/authentication-and-access-control');
    }
  };

  const menuItems = [
    {
      label: 'Mi Perfil',
      icon: 'User',
      action: () => {
        navigate('/team-and-system-administration');
        setIsDropdownOpen(false);
      }
    },
    {
      label: 'Registro de Actividades',
      icon: 'Activity',
      action: () => {
        navigate('/activity-logs');
        setIsDropdownOpen(false);
      }
    },
    {
      label: 'Cerrar Sesión',
      icon: 'LogOut',
      action: handleLogout,
      variant: 'danger'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdownOpen]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-3 px-3 py-2">
        <Icon name="Loader2" size={20} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted transition-smooth focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm font-caption font-medium text-foreground">
            {currentUser?.name}
          </span>
          <span className="text-xs font-caption text-muted-foreground">
            {currentUser?.role}
          </span>
        </div>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-border">
            <Icon name="User" size={20} className="text-primary" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
        </div>
        <Icon
          name={isDropdownOpen ? 'ChevronUp' : 'ChevronDown'}
          size={16}
          className="text-muted-foreground hidden md:block"
        />
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevation-3 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-caption font-medium text-popover-foreground">
              {currentUser?.name}
            </p>
            <p className="text-xs font-caption text-muted-foreground mt-0.5">
              {currentUser?.email}
            </p>
          </div>

          <div className="py-2">
            {menuItems?.map((item, index) => (
              <button
                key={index}
                onClick={item?.action}
                className={`
                  w-full flex items-center px-4 py-2.5 text-sm font-caption transition-smooth
                  ${item?.variant === 'danger' ?'text-error hover:bg-error/10' :'text-popover-foreground hover:bg-muted'
                  }
                `}
              >
                <Icon
                  name={item?.icon}
                  size={18}
                  className="mr-3"
                />
                {item?.label}
              </button>
            ))}
            <div className="border-t border-border my-2" />
            <ThemeSwitcher variant="menu-item" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileHeader;