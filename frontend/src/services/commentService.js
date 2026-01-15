import api from './api';

export const commentService = {
  async getCommentsByRequestId(requestId) {
    try {
      const { data } = await api.get(`/requests/${requestId}/comments`);
      return data.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  async createComment(requestId, content, parentId) {
    try {
      const payload = { content };

      // Only include parentId if it's actually provided
      if (parentId) {
        payload.parentId = parentId;
      }

      const { data } = await api.post(`/requests/${requestId}/comments`, payload);
      return data.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },

  async updateComment(requestId, commentId, content) {
    try {
      const { data } = await api.put(`/requests/${requestId}/comments/${commentId}`, { content });
      return data.data;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  },

  async deleteComment(requestId, commentId) {
    try {
      await api.delete(`/requests/${requestId}/comments/${commentId}`);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },
};
