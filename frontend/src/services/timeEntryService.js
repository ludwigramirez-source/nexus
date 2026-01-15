import api from './api';

class TimeEntryService {
  /**
   * Get all time entries for a request
   */
  async getTimeEntries(requestId) {
    const { data } = await api.get(`/requests/${requestId}/time-entries`);
    return data.data;
  }

  /**
   * Get active time entry for current user
   */
  async getActiveEntry(requestId) {
    const { data } = await api.get(`/requests/${requestId}/time-entries/active`);
    return data.data;
  }

  /**
   * Start a new time entry
   */
  async startTimeEntry(requestId, description = '') {
    const { data } = await api.post(`/requests/${requestId}/time-entries/start`, {
      description,
    });
    return data.data;
  }

  /**
   * Pause active time entry
   */
  async pauseTimeEntry(requestId, description = '') {
    const { data } = await api.put(`/requests/${requestId}/time-entries/pause`, {
      description,
    });
    return data.data;
  }

  /**
   * Resume paused time entry
   */
  async resumeTimeEntry(requestId) {
    const { data } = await api.put(`/requests/${requestId}/time-entries/resume`);
    return data.data;
  }

  /**
   * Complete active time entry
   */
  async completeTimeEntry(requestId, description = '') {
    const { data } = await api.put(`/requests/${requestId}/time-entries/complete`, {
      description,
    });
    return data.data;
  }

  /**
   * Delete a time entry
   */
  async deleteTimeEntry(requestId, timeEntryId) {
    const { data } = await api.delete(`/requests/${requestId}/time-entries/${timeEntryId}`);
    return data;
  }
}

export const timeEntryService = new TimeEntryService();
