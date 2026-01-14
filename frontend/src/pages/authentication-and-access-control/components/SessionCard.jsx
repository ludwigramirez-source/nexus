import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionCard = ({ session, onTerminate, isCurrent }) => {
  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'desktop':
        return 'Monitor';
      case 'mobile':
        return 'Smartphone';
      case 'tablet':
        return 'Tablet';
      default:
        return 'Laptop';
    }
  };

  const getBrowserIcon = (browser) => {
    switch (browser?.toLowerCase()) {
      case 'chrome':
        return 'Chrome';
      case 'firefox':
        return 'Firefox';
      case 'safari':
        return 'Safari';
      default:
        return 'Globe';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSince = (dateString) => {
    const now = new Date();
    const sessionDate = new Date(dateString);
    const diffMs = now - sessionDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    return `Hace ${diffDays} días`;
  };

  return (
    <div className={`
      p-4 md:p-5 rounded-lg border transition-smooth
      ${isCurrent 
        ? 'bg-primary/5 border-primary shadow-elevation-2' 
        : 'bg-card border-border hover:shadow-elevation-1'
      }
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className={`
            p-2 rounded-lg
            ${isCurrent ? 'bg-primary/10' : 'bg-muted'}
          `}>
            <Icon 
              name={getDeviceIcon(session?.deviceType)} 
              size={24} 
              className={isCurrent ? 'text-primary' : 'text-muted-foreground'}
            />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm md:text-base font-caption font-medium text-foreground">
                {session?.deviceName}
              </h3>
              {isCurrent && (
                <span className="px-2 py-0.5 text-xs font-caption font-medium text-success-foreground bg-success rounded-full">
                  Actual
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm font-caption text-muted-foreground">
              {session?.location}
            </p>
          </div>
        </div>
        {!isCurrent && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={() => onTerminate(session?.id)}
          >
            Cerrar
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <Icon name={getBrowserIcon(session?.browser)} size={16} className="text-muted-foreground" />
          <span className="text-xs md:text-sm font-caption text-muted-foreground">
            {session?.browser} {session?.browserVersion}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="MapPin" size={16} className="text-muted-foreground" />
          <span className="text-xs md:text-sm font-caption text-muted-foreground">
            {session?.ipAddress}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={14} className="text-muted-foreground" />
          <span className="text-xs font-caption text-muted-foreground">
            {getTimeSince(session?.lastActivity)}
          </span>
        </div>
        <span className="text-xs font-caption text-muted-foreground">
          Inicio: {formatDate(session?.loginTime)}
        </span>
      </div>
    </div>
  );
};

export default SessionCard;