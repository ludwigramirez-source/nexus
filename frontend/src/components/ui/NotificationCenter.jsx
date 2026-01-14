import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const NotificationCenter = ({ notifications = [], onMarkAsRead, onMarkAllAsRead, onClearAll }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const dropdownRef = useRef(null);

  const defaultNotifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Capacity Overallocation Alert',
      message: 'Development team capacity exceeded by 15% for Q1 2026',
      timestamp: '2026-01-07T01:30:00',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'OKR Milestone Completed',
      message: 'Product launch milestone achieved ahead of schedule',
      timestamp: '2026-01-06T16:45:00',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Request Status Update',
      message: 'Client request #2847 moved to in-progress status',
      timestamp: '2026-01-06T14:20:00',
      read: true
    }
  ];

  const currentNotifications = notifications?.length > 0 ? notifications : defaultNotifications;
  const unreadCount = currentNotifications?.filter(n => !n?.read)?.length;

  const filteredNotifications = filter === 'all'
    ? currentNotifications
    : currentNotifications?.filter(n => !n?.read);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      default:
        return 'Info';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-primary';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date?.toLocaleDateString();
    }
  };

  const handleMarkAsRead = (id) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={togglePanel}
        className="relative p-2 rounded-lg hover:bg-muted transition-smooth focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Icon name="Bell" size={22} className="text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-caption font-medium text-error-foreground bg-error rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-popover border border-border rounded-lg shadow-elevation-3 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-base font-heading font-semibold text-popover-foreground">
              Notifications
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
                className="text-xs font-caption text-primary hover:text-primary/80 transition-smooth"
              >
                {filter === 'all' ? 'Unread only' : 'Show all'}
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Icon name="Bell" size={48} className="text-muted-foreground mb-3" />
                <p className="text-sm font-caption text-muted-foreground text-center">
                  No notifications to display
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredNotifications?.map((notification) => (
                  <div
                    key={notification?.id}
                    className={`
                      px-4 py-3 hover:bg-muted transition-smooth cursor-pointer
                      ${!notification?.read ? 'bg-muted/50' : ''}
                    `}
                    onClick={() => handleMarkAsRead(notification?.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon
                        name={getNotificationIcon(notification?.type)}
                        size={20}
                        className={`mt-0.5 flex-shrink-0 ${getNotificationColor(notification?.type)}`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-caption font-medium text-popover-foreground">
                            {notification?.title}
                          </p>
                          {!notification?.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2 mt-1.5" />
                          )}
                        </div>
                        <p className="text-sm font-caption text-muted-foreground mt-1 line-clamp-2">
                          {notification?.message}
                        </p>
                        <p className="text-xs font-caption text-muted-foreground mt-1.5">
                          {formatTimestamp(notification?.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {filteredNotifications?.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-caption text-primary hover:text-primary/80 transition-smooth"
              >
                Mark all as read
              </button>
              <button
                onClick={handleClearAll}
                className="text-xs font-caption text-error hover:text-error/80 transition-smooth"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;