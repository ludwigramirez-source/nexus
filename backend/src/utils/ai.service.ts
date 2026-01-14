import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/env';
import logger from '../config/logger';

// Initialize AI clients
const openaiClient = config.ai.openai.apiKey 
  ? new OpenAI({ apiKey: config.ai.openai.apiKey })
  : null;

const anthropicClient = config.ai.anthropic.apiKey
  ? new Anthropic({ apiKey: config.ai.anthropic.apiKey })
  : null;

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  tokens?: number;
}

/**
 * Generate AI completion using configured provider
 */
export const generateAICompletion = async (
  messages: AIMessage[],
  options?: {
    provider?: 'openai' | 'claude';
    maxTokens?: number;
    temperature?: number;
  }
): Promise<AIResponse> => {
  const provider = options?.provider || config.ai.provider;
  const maxTokens = options?.maxTokens || 1000;
  const temperature = options?.temperature || 0.7;

  try {
    if (provider === 'openai') {
      if (!openaiClient) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await openaiClient.chat.completions.create({
        model: config.ai.openai.model,
        messages: messages.map(m => ({
          role: m.role === 'user' ? 'user' : m.role === 'assistant' ? 'assistant' : 'system',
          content: m.content,
        })),
        max_tokens: maxTokens,
        temperature,
      });

      return {
        content: response.choices[0].message.content || '',
        tokens: response.usage?.total_tokens,
      };
    } else {
      // Claude
      if (!anthropicClient) {
        throw new Error('Anthropic API key not configured');
      }

      // Separate system message from other messages
      const systemMessage = messages.find(m => m.role === 'system');
      const conversationMessages = messages.filter(m => m.role !== 'system');

      const response = await anthropicClient.messages.create({
        model: config.ai.anthropic.model,
        max_tokens: maxTokens,
        temperature,
        system: systemMessage?.content,
        messages: conversationMessages.map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        })),
      });

      const content = response.content[0];
      return {
        content: content.type === 'text' ? content.text : '',
        tokens: response.usage.input_tokens + response.usage.output_tokens,
      };
    }
  } catch (error) {
    logger.error('AI generation error:', error);
    throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Generate insights for analytics using AI
 */
export const generateAnalyticsInsights = async (data: any): Promise<string[]> => {
  const prompt = `Analyze this project management data and provide 3-5 actionable insights:

Data:
${JSON.stringify(data, null, 2)}

Provide insights in a JSON array format like:
["Insight 1", "Insight 2", "Insight 3"]`;

  try {
    const response = await generateAICompletion([
      {
        role: 'system',
        content: 'You are an expert project management analyst. Provide clear, actionable insights based on data.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    // Try to parse JSON response
    const jsonMatch = response.content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback: split by newlines
    return response.content
      .split('\n')
      .filter(line => line.trim().length > 0)
      .slice(0, 5);
  } catch (error) {
    logger.error('Analytics insights generation error:', error);
    return [];
  }
};

/**
 * Analyze request similarity using AI
 */
export const analyzeRequestSimilarity = async (
  newRequest: { title: string; description: string },
  existingRequests: Array<{ id: string; title: string; description: string }>
): Promise<Array<{ id: string; similarity: number }>> => {
  const prompt = `Compare this new request with existing requests and return similarity scores (0-1):

New Request:
Title: ${newRequest.title}
Description: ${newRequest.description}

Existing Requests:
${existingRequests.map((r, i) => `${i + 1}. [${r.id}] ${r.title}: ${r.description}`).join('\n')}

Return a JSON array with format: [{"id": "request_id", "similarity": 0.85}, ...]
Only include requests with similarity > 0.5`;

  try {
    const response = await generateAICompletion([
      {
        role: 'system',
        content: 'You are an expert at analyzing text similarity. Be precise with similarity scores.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    const jsonMatch = response.content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return [];
  } catch (error) {
    logger.error('Request similarity analysis error:', error);
    return [];
  }
};
