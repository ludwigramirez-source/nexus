import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WeeklyCalendarGrid = ({ 
  weekStart, 
  teamMembers, 
  assignments, 
  onDrop, 
  onAssignmentClick,
  onWeekChange 
}) => {
  const [dragOverCell, setDragOverCell] = useState(null);

  const getWeekDays = () => {
    const days = [];
    const start = new Date(weekStart);
    for (let i = 0; i < 5; i++) {
      const day = new Date(start);
      day?.setDate(start?.getDate() + i);
      days?.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const formatDate = (date) => {
    return date?.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
  };

  const getDayKey = (date) => {
    return date?.toISOString()?.split('T')?.[0];
  };

  const getCapacityColor = (percentage) => {
    if (percentage >= 100) return 'bg-error text-error-foreground';
    if (percentage >= 80) return 'bg-warning text-warning-foreground';
    if (percentage >= 60) return 'bg-accent text-accent-foreground';
    return 'bg-success text-success-foreground';
  };

  const getAssignmentsForCell = (memberId, date) => {
    const dayKey = getDayKey(date);
    return assignments?.filter(
      a => a?.memberId === memberId && a?.date === dayKey
    );
  };

  const calculateDayCapacity = (memberId, date) => {
    const cellAssignments = getAssignmentsForCell(memberId, date);
    const totalHours = cellAssignments?.reduce((sum, a) => sum + a?.hours, 0);
    const member = teamMembers?.find(m => m?.id === memberId);
    const dailyCapacity = member ? member?.weeklyCapacity / 5 : 8;
    return Math.round((totalHours / dailyCapacity) * 100);
  };

  const handleDragOver = (e, memberId, date) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCell(`${memberId}-${getDayKey(date)}`);
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e, memberId, date) => {
    e?.preventDefault();
    setDragOverCell(null);
    
    try {
      const requestData = JSON.parse(e?.dataTransfer?.getData('application/json'));
      if (onDrop) {
        onDrop(requestData, memberId, getDayKey(date));
      }
    } catch (error) {
      console.error('Error processing drop:', error);
    }
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(weekStart);
    newDate?.setDate(newDate?.getDate() - 7);
    if (onWeekChange) {
      onWeekChange(newDate);
    }
  };

  const handleNextWeek = () => {
    const newDate = new Date(weekStart);
    newDate?.setDate(newDate?.getDate() + 7);
    if (onWeekChange) {
      onWeekChange(newDate);
    }
  };

  const handleToday = () => {
    const today = new Date();
    const monday = new Date(today);
    monday?.setDate(today?.getDate() - today?.getDay() + 1);
    if (onWeekChange) {
      onWeekChange(monday);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronLeft"
            onClick={handlePreviousWeek}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
          >
            Hoy
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronRight"
            iconPosition="right"
            onClick={handleNextWeek}
          >
            Siguiente
          </Button>
        </div>

        <h3 className="text-base font-heading font-semibold text-foreground">
          Semana del {formatDate(weekDays?.[0])} - {formatDate(weekDays?.[4])}
        </h3>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconName="Download">
            Exportar
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-muted/50 backdrop-blur-sm">
            <tr>
              <th className="w-48 p-3 text-left text-sm font-caption font-semibold text-foreground border-b border-r border-border">
                Miembro del Equipo
              </th>
              {weekDays?.map((day, idx) => (
                <th key={idx} className="p-3 text-center text-sm font-caption font-semibold text-foreground border-b border-border min-w-[180px]">
                  <div>{day?.toLocaleDateString('es-MX', { weekday: 'short' })}</div>
                  <div className="text-xs text-muted-foreground font-normal">{formatDate(day)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamMembers?.map((member) => (
              <tr key={member?.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
                <td className="p-3 border-r border-border bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-caption font-semibold text-primary">
                        {member?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-caption font-medium text-foreground truncate">
                        {member?.name}
                      </p>
                      <p className="text-xs font-caption text-muted-foreground">
                        {member?.weeklyCapacity}h/semana
                      </p>
                    </div>
                  </div>
                </td>
                {weekDays?.map((day, idx) => {
                  const cellKey = `${member?.id}-${getDayKey(day)}`;
                  const cellAssignments = getAssignmentsForCell(member?.id, day);
                  const capacityPercentage = calculateDayCapacity(member?.id, day);
                  const isDragOver = dragOverCell === cellKey;

                  return (
                    <td
                      key={idx}
                      className={`p-2 border-border align-top transition-smooth ${
                        isDragOver ? 'bg-primary/10 border-2 border-primary' : 'border'
                      }`}
                      onDragOver={(e) => handleDragOver(e, member?.id, day)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, member?.id, day)}
                    >
                      <div className="space-y-1 min-h-[100px]">
                        {cellAssignments?.map((assignment) => (
                          <div
                            key={assignment?.id}
                            onClick={() => onAssignmentClick && onAssignmentClick(assignment)}
                            className="p-2 bg-primary/10 border border-primary/20 rounded cursor-pointer hover:shadow-elevation-1 transition-smooth"
                          >
                            <p className="text-xs font-caption font-medium text-foreground line-clamp-2 mb-1">
                              {assignment?.requestTitle}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-caption text-muted-foreground">
                                {assignment?.hours}h
                              </span>
                              <Icon name="GripVertical" size={12} className="text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                        
                        {cellAssignments?.length > 0 && (
                          <div className={`mt-2 px-2 py-1 text-xs font-caption font-medium rounded text-center ${getCapacityColor(capacityPercentage)}`}>
                            {capacityPercentage}%
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyCalendarGrid;