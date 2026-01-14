import api from './api';

// Get AI provider from system config
let aiProvider = localStorage.getItem('ai_provider') || 'claude';

export const aiService = {
  setProvider(provider) {
    aiProvider = provider;
    localStorage.setItem('ai_provider', provider);
  },

  getProvider() {
    return aiProvider;
  },

  async generateCompletion(prompt, options = {}) {
    try {
      const { data } = await api.post('/ai/completion', {
        prompt,
        provider: options.provider || aiProvider,
        maxTokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
      });

      return data.data;
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    }
  },

  async generateInsights(analyticsData, focus = null) {
    try {
      const { data } = await api.post('/ai/insights', {
        data: analyticsData,
        focus,
        provider: aiProvider,
      });

      return data.data;
    } catch (error) {
      console.error('Insights generation error:', error);
      return {
        insights: [],
        recommendations: [],
        trends: [],
        alerts: []
      };
    }
  },

  async analyzeSimilarity(requestId, threshold = 0.7) {
    try {
      const { data } = await api.post('/ai/analyze-similarity', {
        requestId,
        threshold,
        provider: aiProvider,
      });

      return data.data.similarRequests || [];
    } catch (error) {
      console.error('Similarity analysis error:', error);
      return [];
    }
  },
};
