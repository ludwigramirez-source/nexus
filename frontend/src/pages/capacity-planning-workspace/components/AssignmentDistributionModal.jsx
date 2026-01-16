import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AssignmentDistributionModal = ({
  request,
  user,
  initialDate,  // Día donde se hizo drop
  onConfirm,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('quick');  // 'quick' | 'advanced'
  const [quickConfig, setQuickConfig] = useState({
    hoursPerDay: 2,
    totalHours: request.estimatedHours
  });

  const [advancedDays, setAdvancedDays] = useState(() => {
    // Inicializar 5 días laborables desde initialDate
    const days = [];
    // Crear fecha local para evitar problemas de timezone
    const [year, month, day] = initialDate.split('-').map(Number);
    let currentDate = new Date(year, month - 1, day);

    // Si el día inicial es fin de semana, ajustar al siguiente lunes
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0) {
      // Domingo -> avanzar 1 día al lunes
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (dayOfWeek === 6) {
      // Sábado -> avanzar 2 días al lunes
      currentDate.setDate(currentDate.getDate() + 2);
    }

    while (days.length < 5) {
      // Skip weekends (por si acaso, aunque ya ajustamos arriba)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        // Usar fecha local en lugar de toISOString para evitar problema de timezone
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        days.push({
          date: dateStr,
          hours: 0,
          enabled: false
        });
      }

      // Avanzar al siguiente día
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  });

  const [errors, setErrors] = useState({});

  // Calcular distribución automática para tab "Rápida"
  const quickDistribution = useMemo(() => {
    const { hoursPerDay, totalHours } = quickConfig;

    if (hoursPerDay <= 0 || totalHours <= 0) return [];

    const days = [];
    let remainingHours = totalHours;

    // Crear fecha local para evitar problemas de timezone
    const [year, month, day] = initialDate.split('-').map(Number);
    let currentDate = new Date(year, month - 1, day);

    // Si el día inicial es fin de semana, ajustar al siguiente lunes
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0) {
      // Domingo -> avanzar 1 día al lunes
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (dayOfWeek === 6) {
      // Sábado -> avanzar 2 días al lunes
      currentDate.setDate(currentDate.getDate() + 2);
    }

    while (remainingHours > 0) {
      // Skip weekends (por si acaso durante la iteración)
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
      }

      const allocate = Math.min(hoursPerDay, remainingHours, 8);

      // Usar fecha local en lugar de toISOString para evitar problema de timezone
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      days.push({
        date: dateStr,
        dayName: currentDate.toLocaleDateString('es', { weekday: 'short' }),
        hours: allocate
      });

      remainingHours -= allocate;

      // Avanzar al siguiente día
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, [quickConfig, initialDate]);

  // Calcular total de tab "Avanzada"
  const advancedTotal = useMemo(() => {
    return advancedDays
      .filter(d => d.enabled)
      .reduce((sum, d) => sum + parseFloat(d.hours || 0), 0);
  }, [advancedDays]);

  // Validar
  const validate = () => {
    const newErrors = {};

    if (activeTab === 'quick') {
      if (quickConfig.totalHours > request.estimatedHours) {
        newErrors.totalHours = `No puede exceder ${request.estimatedHours}h estimadas`;
      }
      if (quickConfig.hoursPerDay > 8) {
        newErrors.hoursPerDay = 'No puede exceder 8h por día';
      }
      if (quickConfig.hoursPerDay <= 0) {
        newErrors.hoursPerDay = 'Debe ser mayor a 0';
      }
      if (quickConfig.totalHours <= 0) {
        newErrors.totalHours = 'Debe ser mayor a 0';
      }
    } else {
      // Validar advanced
      const enabledDays = advancedDays.filter(d => d.enabled);

      if (enabledDays.length === 0) {
        newErrors.advanced = 'Debe seleccionar al menos un día';
      }

      enabledDays.forEach((day, idx) => {
        if (day.hours > 8) {
          newErrors[`day_${idx}`] = 'Máximo 8h';
        }
        if (day.hours <= 0) {
          newErrors[`day_${idx}`] = 'Debe ser > 0';
        }
      });

      if (advancedTotal > request.estimatedHours) {
        newErrors.advanced = `⚠️ El total de ${advancedTotal}h excede las ${request.estimatedHours}h estimadas para esta tarea. Por favor ajusta las horas asignadas.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!validate()) {
      return;
    }

    // Construir payload con fechas en formato ISO datetime
    const assignments = activeTab === 'quick'
      ? quickDistribution.map(d => {
          // Crear fecha local a mediodía para evitar problemas de timezone
          // Al usar mediodía local, cuando el backend lo parsee y trunce a medianoche,
          // mantendrá el día correcto independientemente del timezone
          const [year, month, day] = d.date.split('-').map(Number);
          const dateTime = new Date(year, month - 1, day, 12, 0, 0);
          return {
            userId: user.id,
            requestId: request.id,
            assignedDate: dateTime.toISOString(),
            allocatedHours: d.hours,
            notes: ''
          };
        })
      : advancedDays
          .filter(d => d.enabled && d.hours > 0)
          .map(d => {
            // Crear fecha local a mediodía para evitar problemas de timezone
            const [year, month, day] = d.date.split('-').map(Number);
            const dateTime = new Date(year, month - 1, day, 12, 0, 0);
            return {
              userId: user.id,
              requestId: request.id,
              assignedDate: dateTime.toISOString(),
              allocatedHours: parseFloat(d.hours),
              notes: ''
            };
          });

    onConfirm(assignments);
  };

  const handleAdvancedToggleDay = (index) => {
    const updated = [...advancedDays];
    updated[index].enabled = !updated[index].enabled;
    if (updated[index].enabled && updated[index].hours === 0) {
      updated[index].hours = 2;  // Default 2h
    }
    setAdvancedDays(updated);
  };

  const handleAdvancedHoursChange = (index, value) => {
    const updated = [...advancedDays];
    updated[index].hours = value;
    setAdvancedDays(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-lg border border-border shadow-elevation-3 w-full max-w-2xl max-h-[90vh] flex flex-col m-4">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
              Asignar Tarea
            </h2>
            <p className="text-sm text-muted-foreground truncate">
              {request.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-muted rounded-lg transition-smooth"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Info Cards */}
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card p-3 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Usuario</p>
              <p className="text-sm font-medium text-foreground">{user.name}</p>
            </div>
            <div className="bg-card p-3 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Horas Estimadas</p>
              <p className="text-sm font-medium text-foreground">{request.estimatedHours}h</p>
            </div>
            <div className="bg-card p-3 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Capacidad Diaria</p>
              <p className="text-sm font-medium text-foreground">{user.capacity / 5}h/día</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-smooth ${
              activeTab === 'quick'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="Zap" size={16} />
              <span>Distribución Rápida</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-smooth ${
              activeTab === 'advanced'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icon name="Settings" size={16} />
              <span>Distribución Avanzada</span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'quick' ? (
            // TAB RÁPIDA
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Horas a asignar"
                  type="number"
                  min="0"
                  max={request.estimatedHours}
                  step="0.5"
                  value={quickConfig.totalHours}
                  onChange={(e) => setQuickConfig({
                    ...quickConfig,
                    totalHours: parseFloat(e.target.value) || 0
                  })}
                  error={errors.totalHours}
                  required
                />
                <Input
                  label="Horas por día"
                  type="number"
                  min="0.5"
                  max="8"
                  step="0.5"
                  value={quickConfig.hoursPerDay}
                  onChange={(e) => setQuickConfig({
                    ...quickConfig,
                    hoursPerDay: parseFloat(e.target.value) || 0
                  })}
                  error={errors.hoursPerDay}
                  required
                />
              </div>

              {/* Preview de distribución */}
              {quickDistribution.length > 0 && (
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <p className="text-sm font-medium text-foreground mb-3">
                    Vista Previa de Distribución
                  </p>
                  <div className="space-y-2">
                    {quickDistribution.map((day, idx) => {
                      // Parsear fecha manualmente para evitar problema de timezone
                      const [year, month, dayNum] = day.date.split('-').map(Number);
                      const localDate = new Date(year, month - 1, dayNum);

                      return (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground capitalize">
                            {localDate.toLocaleDateString('es', {
                              weekday: 'short',
                              day: '2-digit',
                              month: 'short'
                            })}
                          </span>
                          <span className="font-medium text-foreground">{day.hours}h</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Total</span>
                    <span className="text-base font-semibold text-primary">
                      {quickConfig.totalHours}h
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // TAB AVANZADA
            <div className="space-y-4">
              {errors.advanced && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-sm text-destructive">{errors.advanced}</p>
                </div>
              )}

              {advancedDays.map((day, idx) => {
                // Parsear fecha manualmente para evitar problema de timezone
                const [year, month, dayNum] = day.date.split('-').map(Number);
                const dayDate = new Date(year, month - 1, dayNum);
                const dayName = dayDate.toLocaleDateString('es', { weekday: 'long' });
                const dayNumFormatted = dayDate.toLocaleDateString('es', { day: '2-digit', month: 'short' });

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 p-3 rounded-lg border transition-smooth ${
                      day.enabled
                        ? 'bg-primary/5 border-primary/20'
                        : 'bg-muted/30 border-border'
                    }`}
                  >
                    <button
                      onClick={() => handleAdvancedToggleDay(idx)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-smooth ${
                        day.enabled
                          ? 'bg-primary border-primary'
                          : 'bg-background border-border hover:border-primary/50'
                      }`}
                    >
                      {day.enabled && <Icon name="Check" size={14} className="text-primary-foreground" />}
                    </button>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground capitalize">{dayName}</p>
                      <p className="text-xs text-muted-foreground">{dayNumFormatted}</p>
                    </div>

                    <div className="w-32">
                      <Input
                        type="number"
                        min="0"
                        max="8"
                        step="0.5"
                        value={day.hours}
                        onChange={(e) => handleAdvancedHoursChange(idx, parseFloat(e.target.value) || 0)}
                        disabled={!day.enabled}
                        error={errors[`day_${idx}`]}
                        className="text-right"
                      />
                    </div>

                    <span className="text-sm text-muted-foreground w-8">h</span>
                  </div>
                );
              })}

              {/* Total */}
              <div className="bg-card rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Total Asignado</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-xl font-semibold ${
                      advancedTotal > request.estimatedHours
                        ? 'text-destructive'
                        : 'text-primary'
                    }`}>
                      {advancedTotal}h
                    </span>
                    <span className="text-sm text-muted-foreground">
                      de {request.estimatedHours}h
                    </span>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      advancedTotal > request.estimatedHours
                        ? 'bg-destructive'
                        : 'bg-primary'
                    }`}
                    style={{
                      width: `${Math.min((advancedTotal / request.estimatedHours) * 100, 100)}%`
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            <Icon name="Check" size={16} />
            Asignar {activeTab === 'quick' ? quickConfig.totalHours : advancedTotal}h
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDistributionModal;
