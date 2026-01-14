import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityLogTable = ({ activities }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getActivityIcon = (type) => {
    switch (type) {
      case 'login':
        return { name: 'LogIn', color: 'text-success' };
      case 'logout':
        return { name: 'LogOut', color: 'text-muted-foreground' };
      case 'failed_login':
        return { name: 'AlertTriangle', color: 'text-warning' };
      case 'password_change':
        return { name: 'Key', color: 'text-primary' };
      case 'permission_change':
        return { name: 'Shield', color: 'text-accent' };
      case 'session_timeout':
        return { name: 'Clock', color: 'text-error' };
      default:
        return { name: 'Activity', color: 'text-muted-foreground' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const totalPages = Math.ceil(activities?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = activities?.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-xs md:text-sm font-caption font-medium text-muted-foreground uppercase tracking-wider">
                Tipo
              </th>
              <th className="text-left py-3 px-4 text-xs md:text-sm font-caption font-medium text-muted-foreground uppercase tracking-wider">
                Descripción
              </th>
              <th className="text-left py-3 px-4 text-xs md:text-sm font-caption font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                Ubicación
              </th>
              <th className="text-left py-3 px-4 text-xs md:text-sm font-caption font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                IP
              </th>
              <th className="text-left py-3 px-4 text-xs md:text-sm font-caption font-medium text-muted-foreground uppercase tracking-wider">
                Fecha y Hora
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentActivities?.map((activity) => {
              const iconConfig = getActivityIcon(activity?.type);
              return (
                <tr key={activity?.id} className="hover:bg-muted/50 transition-smooth">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={iconConfig?.name} 
                        size={18} 
                        className={iconConfig?.color}
                      />
                      <span className="text-xs md:text-sm font-caption text-foreground hidden sm:inline">
                        {activity?.typeLabel}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-xs md:text-sm font-caption text-foreground">
                      {activity?.description}
                    </p>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <p className="text-xs md:text-sm font-caption text-muted-foreground">
                      {activity?.location}
                    </p>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <p className="text-xs md:text-sm font-caption font-mono text-muted-foreground">
                      {activity?.ipAddress}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-xs md:text-sm font-caption text-muted-foreground whitespace-nowrap">
                      {formatDate(activity?.timestamp)}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-xs md:text-sm font-caption text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(endIndex, activities?.length)} de {activities?.length} registros
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronLeft"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="text-sm font-caption text-foreground px-3">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronRight"
              iconPosition="right"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLogTable;