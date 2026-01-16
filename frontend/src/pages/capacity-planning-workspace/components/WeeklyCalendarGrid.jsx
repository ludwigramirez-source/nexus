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
    // Usar fecha local en vez de UTC para evitar desfase por timezone
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    const dailyCapacity = member ? member?.capacity / 5 : 8;

    return {
      totalHours,
      dailyCapacity,
      percentage: Math.round((totalHours / dailyCapacity) * 100),
      available: dailyCapacity - totalHours
    };
  };

  const calculateWeeklyCapacity = (memberId) => {
    const member = teamMembers?.find(m => m?.id === memberId);
    if (!member) return { total: 0, used: 0, percentage: 0 };

    const weeklyCapacity = member?.capacity;
    const weekEnd = new Date(weekStart);
    weekEnd?.setDate(weekStart?.getDate() + 4);

    const weekAssignments = assignments?.filter(a => {
      const assignDate = new Date(a?.date);
      return a?.memberId === memberId && assignDate >= weekStart && assignDate <= weekEnd;
    });

    const totalUsed = weekAssignments?.reduce((sum, a) => sum + a?.hours, 0);
    const percentage = Math.round((totalUsed / weeklyCapacity) * 100);

    return {
      total: weeklyCapacity,
      used: totalUsed,
      available: weeklyCapacity - totalUsed,
      percentage
    };
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
      const dayKey = getDayKey(date);

      if (onDrop) {
        onDrop(requestData, memberId, dayKey);
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
            {teamMembers?.map((member) => {
              const weeklyStats = calculateWeeklyCapacity(member?.id);

              return (
                <React.Fragment key={member?.id}>
                  <tr className="border-b border-border hover:bg-muted/30 transition-smooth">
                <td className="p-3 border-r border-border bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-caption font-semibold text-primary">
                        {member?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-caption font-medium text-foreground truncate">
                        {member?.name}
                      </p>
                      <p className="text-xs font-caption text-muted-foreground">
                        {calculateWeeklyCapacity(member?.id).used}h / {member?.capacity}h
                      </p>
                    </div>
                  </div>
                </td>
                {weekDays?.map((day, idx) => {
                  const cellKey = `${member?.id}-${getDayKey(day)}`;
                  const cellAssignments = getAssignmentsForCell(member?.id, day);
                  const dayStats = calculateDayCapacity(member?.id, day);
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
                      <div className="space-y-1 min-h-[120px]">
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
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">
                                {dayStats.totalHours}h / {dayStats.dailyCapacity}h
                              </span>
                              <span className={`font-medium ${
                                dayStats.percentage >= 100 ? 'text-destructive' :
                                dayStats.percentage >= 80 ? 'text-warning' :
                                'text-success'
                              }`}>
                                {dayStats.percentage}%
                              </span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  dayStats.percentage >= 100 ? 'bg-destructive' :
                                  dayStats.percentage >= 80 ? 'bg-warning' :
                                  'bg-success'
                                }`}
                                style={{ width: `${Math.min(dayStats.percentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
                  </tr>

                  {/* Weekly Capacity Bar Row */}
                  <tr className="border-b border-border bg-muted/10">
                    <td colSpan={6} className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-muted-foreground w-40">
                          Capacidad Semanal:
                        </span>
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                weeklyStats.percentage >= 100 ? 'bg-destructive' :
                                weeklyStats.percentage >= 80 ? 'bg-warning' :
                                'bg-primary'
                              }`}
                              style={{ width: `${Math.min(weeklyStats.percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-medium text-foreground w-24 text-right">
                          {weeklyStats.used}h / {weeklyStats.total}h
                        </span>
                        <span className={`text-xs font-semibold w-12 text-right ${
                          weeklyStats.percentage >= 100 ? 'text-destructive' :
                          weeklyStats.percentage >= 80 ? 'text-warning' :
                          'text-primary'
                        }`}>
                          {weeklyStats.percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyCalendarGrid;