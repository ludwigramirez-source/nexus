import OpenAI from 'openai';
import { retrieveEncrypted } from './encryptionService';

/**
 * Gets the OpenAI API key from localStorage or environment
 * @returns {string} API key
 */
const getApiKey = () => {
  // First try to get from localStorage (user-configured)
  const storedKey = retrieveEncrypted('openai_api_key');
  if (storedKey) return storedKey;
  
  // Fallback to environment variable
  return import.meta.env?.VITE_OPENAI_API_KEY || '';
};

/**
 * Initializes the OpenAI client with the API key
 * @returns {OpenAI|null} Configured OpenAI client instance or null if no key
 */
const initializeClient = () => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    return null;
  }
  
  try {
    return new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for client-side usage in React
    });
  } catch (error) {
    console.error('Error initializing OpenAI client:', error);
    return null;
  }
};

let openaiClient = initializeClient();

/**
 * Reinitializes the OpenAI client (call after API key update)
 */
export const reinitializeClient = () => {
  openaiClient = initializeClient();
};

/**
 * Gets the current OpenAI client instance
 * @returns {OpenAI|null}
 */
export const getClient = () => openaiClient;

export default openaiClient;