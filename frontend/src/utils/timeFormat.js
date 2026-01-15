/**
 * Formatea horas decimales a formato legible
 * @param {number} hours - Horas en formato decimal
 * @param {string} format - Formato de salida: 'short' (2h 30m) o 'long' (02:30:00)
 * @returns {string} Tiempo formateado
 */
export const formatHours = (hours, format = 'short') => {
  if (!hours || hours === 0) {
    return format === 'short' ? '0h' : '00:00:00';
  }

  const totalMinutes = Math.floor(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const s = Math.floor((hours * 3600) % 60);

  if (format === 'long') {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // Format: short
  if (h > 0 && m > 0) {
    return `${h}h ${m}m`;
  } else if (h > 0) {
    return `${h}h`;
  } else if (m > 0) {
    return `${m}m`;
  } else if (s > 0) {
    return `${s}s`;
  }

  return '0h';
};

/**
 * Formatea horas decimales a formato compacto con una cifra decimal
 * @param {number} hours - Horas en formato decimal
 * @returns {string} Tiempo formateado (ej: "2.5h")
 */
export const formatHoursCompact = (hours) => {
  if (!hours || hours === 0) {
    return '0h';
  }

  // Si es menos de 1 hora, mostrar en minutos
  if (hours < 1) {
    const minutes = Math.floor(hours * 60);
    const seconds = Math.floor((hours * 3600) % 60);

    if (minutes > 0) {
      return `${minutes}m`;
    } else if (seconds > 0) {
      return `${seconds}s`;
    }
  }

  // Si es 1 hora o más, mostrar con 1 decimal
  return `${hours.toFixed(1)}h`;
};
