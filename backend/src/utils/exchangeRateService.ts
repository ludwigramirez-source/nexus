import axios from 'axios';
import logger from '../config/logger';

interface ExchangeRateCache {
  rate: number;
  timestamp: number;
  lastUpdated: Date;
}

// Cache en memoria (válido por 24 horas)
let exchangeRateCache: ExchangeRateCache | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

/**
 * Obtiene la tasa de cambio USD/COP desde una API pública
 */
export async function getUSDtoCOPRate(): Promise<{ rate: number; lastUpdated: Date }> {
  try {
    // Verificar si tenemos un valor en cache válido
    if (exchangeRateCache) {
      const now = Date.now();
      const cacheAge = now - exchangeRateCache.timestamp;

      if (cacheAge < CACHE_DURATION) {
        logger.debug('Using cached exchange rate');
        return {
          rate: exchangeRateCache.rate,
          lastUpdated: exchangeRateCache.lastUpdated,
        };
      }
    }

    // Consultar la API
    logger.info('Fetching exchange rate from API...');
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
      timeout: 5000, // 5 segundos de timeout
    });

    if (!response.data || !response.data.rates || !response.data.rates.COP) {
      throw new Error('Invalid response from exchange rate API');
    }

    const rate = response.data.rates.COP;
    const lastUpdated = new Date();

    // Actualizar cache
    exchangeRateCache = {
      rate,
      timestamp: Date.now(),
      lastUpdated,
    };

    logger.info(`Exchange rate updated: 1 USD = ${rate} COP`);

    return { rate, lastUpdated };
  } catch (error) {
    logger.error('Error fetching exchange rate:', error);

    // Si tenemos un valor en cache (aunque esté vencido), usarlo
    if (exchangeRateCache) {
      logger.warn('Using expired cached exchange rate due to API error');
      return {
        rate: exchangeRateCache.rate,
        lastUpdated: exchangeRateCache.lastUpdated,
      };
    }

    // Si no hay cache, usar valor por defecto
    logger.warn('Using default exchange rate (4200) due to API error');
    return {
      rate: 4200,
      lastUpdated: new Date(),
    };
  }
}

/**
 * Invalida el cache (útil para forzar actualización)
 */
export function invalidateExchangeRateCache(): void {
  exchangeRateCache = null;
  logger.info('Exchange rate cache invalidated');
}
