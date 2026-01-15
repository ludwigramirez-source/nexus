import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { timeEntryService } from '../../../services/timeEntryService';

const TimeTracker = ({ requestId, onTimeUpdated }) => {
  const [activeEntry, setActiveEntry] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadData();
  }, [requestId]);

  // Timer interval for active sessions
  useEffect(() => {
    let interval = null;

    if (activeEntry && activeEntry.status === 'ACTIVE') {
      interval = setInterval(() => {
        const startTime = new Date(activeEntry.startedAt);
        const now = new Date();
        const diffMs = now - startTime;
        const diffSeconds = Math.floor(diffMs / 1000);
        setCurrentTime(diffSeconds);
      }, 1000);
    } else if (activeEntry && activeEntry.status === 'PAUSED') {
      // Show paused time
      const durationSeconds = Math.floor(activeEntry.duration * 3600);
      setCurrentTime(durationSeconds);
    } else {
      setCurrentTime(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeEntry]);

  const loadData = async () => {
    try {
      const [active, entries] = await Promise.all([
        timeEntryService.getActiveEntry(requestId).catch(() => null),
        timeEntryService.getTimeEntries(requestId),
      ]);

      setActiveEntry(active);
      setTimeEntries(entries || []);
    } catch (error) {
      console.error('Error loading time tracking data:', error);
    }
  };

  const handleStart = async () => {
    try {
      setLoading(true);
      const entry = await timeEntryService.startTimeEntry(requestId, description);
      setActiveEntry(entry);
      setDescription('');
      await loadData();
      if (onTimeUpdated) onTimeUpdated();
    } catch (error) {
      console.error('Error starting timer:', error);
      alert(error?.response?.data?.message || 'Error al iniciar el timer');
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    try {
      setLoading(true);
      const entry = await timeEntryService.pauseTimeEntry(requestId, description);
      setActiveEntry(entry);
      setDescription('');
      await loadData();
    } catch (error) {
      console.error('Error pausing timer:', error);
      alert(error?.response?.data?.message || 'Error al pausar el timer');
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    try {
      setLoading(true);
      const entry = await timeEntryService.resumeTimeEntry(requestId);
      setActiveEntry(entry);
      await loadData();
    } catch (error) {
      console.error('Error resuming timer:', error);
      alert(error?.response?.data?.message || 'Error al reanudar el timer');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!confirm('¿Terminar esta sesión de tiempo? El tiempo se sumará a las horas reales de la solicitud.')) {
      return;
    }

    try {
      setLoading(true);
      await timeEntryService.completeTimeEntry(requestId, description);
      setActiveEntry(null);
      setDescription('');
      setCurrentTime(0);
      await loadData();
      if (onTimeUpdated) onTimeUpdated();
    } catch (error) {
      console.error('Error completing timer:', error);
      alert(error?.response?.data?.message || 'Error al terminar el timer');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (timeEntryId) => {
    if (!confirm('¿Eliminar esta entrada de tiempo?')) {
      return;
    }

    try {
      await timeEntryService.deleteTimeEntry(requestId, timeEntryId);
      await loadData();
      if (onTimeUpdated) onTimeUpdated();
    } catch (error) {
      console.error('Error deleting time entry:', error);
      alert(error?.response?.data?.message || 'Error al eliminar la entrada');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatDuration = (hours) => {
    const totalMinutes = Math.floor(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalHours = timeEntries
    .filter((entry) => entry.status === 'COMPLETED')
    .reduce((sum, entry) => sum + entry.duration, 0);

  return (
    <div className="space-y-4">
      {/* Timer Display */}
      <div className="bg-muted/30 rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-caption font-semibold text-foreground">Time Tracker</h3>
          {activeEntry && (
            <span
              className={`px-2 py-1 text-xs font-caption font-medium rounded-md ${
                activeEntry.status === 'ACTIVE'
                  ? 'bg-success/10 text-success'
                  : 'bg-warning/10 text-warning'
              }`}
            >
              {activeEntry.status === 'ACTIVE' ? 'Activo' : 'Pausado'}
            </span>
          )}
        </div>

        {/* Timer */}
        <div className="text-center py-4">
          <div className="text-4xl font-heading font-bold text-foreground mb-2 data-text">
            {formatTime(currentTime)}
          </div>
          <div className="text-xs font-caption text-muted-foreground">
            Total registrado: {formatDuration(totalHours)}
          </div>
        </div>

        {/* Description Input */}
        {activeEntry && (
          <div className="mb-3">
            <input
              type="text"
              placeholder="Nota sobre el trabajo realizado (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm font-caption bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {!activeEntry ? (
            <Button
              variant="default"
              iconName="Play"
              iconPosition="left"
              onClick={handleStart}
              disabled={loading}
              className="flex-1"
            >
              Iniciar
            </Button>
          ) : (
            <>
              {activeEntry.status === 'ACTIVE' ? (
                <Button
                  variant="outline"
                  iconName="Pause"
                  iconPosition="left"
                  onClick={handlePause}
                  disabled={loading}
                  className="flex-1"
                >
                  Pausar
                </Button>
              ) : (
                <Button
                  variant="outline"
                  iconName="Play"
                  iconPosition="left"
                  onClick={handleResume}
                  disabled={loading}
                  className="flex-1"
                >
                  Reanudar
                </Button>
              )}
              <Button
                variant="default"
                iconName="Check"
                iconPosition="left"
                onClick={handleComplete}
                disabled={loading}
                className="flex-1"
              >
                Terminar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* History Toggle */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-caption font-medium text-foreground hover:bg-muted rounded-lg transition-smooth"
      >
        <span>Historial de tiempo ({timeEntries.length})</span>
        <Icon name={showHistory ? 'ChevronUp' : 'ChevronDown'} size={16} />
      </button>

      {/* Time Entries History */}
      {showHistory && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {timeEntries.length === 0 ? (
            <div className="text-center py-6 text-sm font-caption text-muted-foreground">
              No hay entradas de tiempo registradas
            </div>
          ) : (
            timeEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-card border border-border rounded-lg p-3 hover:shadow-sm transition-smooth"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-caption font-medium text-foreground">
                        {entry.user?.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs font-caption font-medium rounded ${
                          entry.status === 'COMPLETED'
                            ? 'bg-success/10 text-success'
                            : entry.status === 'ACTIVE'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-warning/10 text-warning'
                        }`}
                      >
                        {entry.status === 'COMPLETED'
                          ? 'Completada'
                          : entry.status === 'ACTIVE'
                          ? 'Activa'
                          : 'Pausada'}
                      </span>
                    </div>
                    <div className="text-xs font-caption text-muted-foreground">
                      {formatDate(entry.startedAt)}
                      {entry.endedAt && ` - ${formatDate(entry.endedAt)}`}
                    </div>
                    {entry.description && (
                      <div className="text-xs font-caption text-foreground mt-1">
                        {entry.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-caption font-semibold text-foreground data-text">
                      {formatDuration(entry.duration)}
                    </span>
                    {entry.status === 'COMPLETED' && (
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-1 text-error hover:bg-error/10 rounded transition-smooth"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TimeTracker;
