import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TeamPerformanceTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'velocity', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = [...data]?.sort((a, b) => {
    if (sortConfig?.direction === 'asc') {
      return a?.[sortConfig?.key] > b?.[sortConfig?.key] ? 1 : -1;
    }
    return a?.[sortConfig?.key] < b?.[sortConfig?.key] ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData?.slice(startIndex, startIndex + itemsPerPage);

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) return 'ChevronsUpDown';
    return sortConfig?.direction === 'asc' ? 'ChevronUp' : 'ChevronDown';
  };

  const getUtilizationColor = (value) => {
    if (value >= 90) return 'text-error';
    if (value >= 75) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
          Rendimiento del Equipo
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 md:px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-2 text-xs md:text-sm font-caption font-medium text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <span>Miembro</span>
                  <Icon name={getSortIcon('name')} size={16} />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-left hidden md:table-cell">
                <button
                  onClick={() => handleSort('role')}
                  className="flex items-center space-x-2 text-xs md:text-sm font-caption font-medium text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <span>Rol</span>
                  <Icon name={getSortIcon('role')} size={16} />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('velocity')}
                  className="flex items-center space-x-2 text-xs md:text-sm font-caption font-medium text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <span>Velocidad</span>
                  <Icon name={getSortIcon('velocity')} size={16} />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-left hidden lg:table-cell">
                <button
                  onClick={() => handleSort('utilization')}
                  className="flex items-center space-x-2 text-xs md:text-sm font-caption font-medium text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <span>Utilización</span>
                  <Icon name={getSortIcon('utilization')} size={16} />
                </button>
              </th>
              <th className="px-4 md:px-6 py-3 text-left hidden lg:table-cell">
                <button
                  onClick={() => handleSort('completed')}
                  className="flex items-center space-x-2 text-xs md:text-sm font-caption font-medium text-muted-foreground hover:text-foreground transition-smooth"
                >
                  <span>Completadas</span>
                  <Icon name={getSortIcon('completed')} size={16} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData?.map((member) => (
              <tr key={member?.id} className="hover:bg-muted/30 transition-smooth">
                <td className="px-4 md:px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={member?.avatar}
                      alt={member?.avatarAlt}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-caption font-medium text-foreground truncate">
                        {member?.name}
                      </p>
                      <p className="text-xs font-caption text-muted-foreground md:hidden">
                        {member?.role}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                  <span className="text-sm font-caption text-foreground">
                    {member?.role}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="Zap" size={16} className="text-primary" />
                    <span className="text-sm font-caption font-medium text-foreground">
                      {member?.velocity}
                    </span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 hidden lg:table-cell">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-caption font-medium ${getUtilizationColor(member?.utilization)}`}>
                      {member?.utilization}%
                    </span>
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 hidden lg:table-cell">
                  <span className="text-sm font-caption text-foreground">
                    {member?.completed}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t border-border">
          <p className="text-xs md:text-sm font-caption text-muted-foreground">
            Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedData?.length)} de {sortedData?.length}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronLeft"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            />
            <span className="text-sm font-caption text-foreground px-2">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName="ChevronRight"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPerformanceTable;