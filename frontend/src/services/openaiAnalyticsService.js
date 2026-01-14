import { getClient } from './openaiClient';
import {
  APIConnectionError,
  AuthenticationError,
  PermissionDeniedError,
  RateLimitError,
  InternalServerError
} from 'openai';

/**
 * Maps OpenAI API error types to user-friendly error messages.
 * @param {Error} error - The error object from OpenAI API.
 * @returns {Object} Error info with message and isInternal flag
 */
function getErrorMessage(error) {
  if (error instanceof AuthenticationError) {
    return { isInternal: true, message: 'Clave API inválida o autenticación fallida. Por favor verifica tu clave API de OpenAI.' };
  } else if (error instanceof PermissionDeniedError) {
    return { isInternal: true, message: 'Cuota excedida o autorización fallida. Puede que hayas excedido tus límites de uso.' };
  } else if (error instanceof RateLimitError) {
    return { isInternal: true, message: 'Límite de tasa excedido. Estás enviando solicitudes muy rápido. Por favor espera un momento.' };
  } else if (error instanceof InternalServerError) {
    return { isInternal: true, message: 'Servicio de OpenAI no disponible actualmente. Por favor intenta más tarde.' };
  } else if (error instanceof APIConnectionError) {
    return { isInternal: true, message: 'No se puede conectar al servicio de OpenAI. Verifica tu clave API y conexión a internet.' };
  } else {
    return { isInternal: false, message: error?.message || 'Ocurrió un error inesperado. Por favor intenta de nuevo.' };
  }
}

/**
 * Generates analytics insights using GPT-5
 * @param {Object} analyticsData - Current analytics data
 * @returns {Promise<Object>} Analytics insights
 */
export async function generateAnalyticsInsights(analyticsData) {
  const openai = getClient();
  
  if (!openai) {
    throw new Error('OpenAI no está configurado. Por favor configura tu clave API en Configuración del Sistema.');
  }

  try {
    const prompt = `Analiza los siguientes datos de analítica de un equipo de desarrollo de software y proporciona insights accionables en español:

Métricas Clave:
- Ratio Producto/Personalización: ${analyticsData?.productCustomRatio || 'N/A'}
- Velocidad del Equipo: ${analyticsData?.teamVelocity || 'N/A'} puntos/semana
- Utilización de Capacidad: ${analyticsData?.capacityUtilization || 'N/A'}%
- Deuda de Personalización: ${analyticsData?.customizationDebt || 'N/A'}

Proporciona un análisis detallado con recomendaciones específicas.`;

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini',
      messages: [
        { 
          role: 'system', 
          content: 'Eres un experto analista de datos de equipos de desarrollo de software. Proporciona análisis detallados y recomendaciones accionables en español.' 
        },
        { role: 'user', content: prompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'analytics_insights',
          schema: {
            type: 'object',
            properties: {
              resumen: { type: 'string', description: 'Resumen ejecutivo del análisis' },
              insights: {
                type: 'array',
                items: { type: 'string' },
                description: 'Lista de insights clave identificados'
              },
              recomendaciones: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    titulo: { type: 'string' },
                    descripcion: { type: 'string' },
                    prioridad: { type: 'string', enum: ['alta', 'media', 'baja'] },
                    impacto: { type: 'string' }
                  },
                  required: ['titulo', 'descripcion', 'prioridad']
                }
              },
              alertas: {
                type: 'array',
                items: { type: 'string' },
                description: 'Alertas o áreas que requieren atención inmediata'
              }
            },
            required: ['resumen', 'insights', 'recomendaciones'],
            additionalProperties: false,
          },
        },
      },
      reasoning_effort: 'medium',
      verbosity: 'medium',
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    const errorInfo = getErrorMessage(error);
    if (errorInfo?.isInternal) {
      console.log(errorInfo?.message);
    } else {
      console.error('Error in analytics insights generation:', error);
    }
    throw new Error(errorInfo.message);
  }
}

/**
 * Generates team performance analysis
 * @param {Array} teamData - Team performance data
 * @returns {Promise<Object>} Team analysis
 */
export async function analyzeTeamPerformance(teamData) {
  const openai = getClient();
  
  if (!openai) {
    throw new Error('OpenAI no está configurado. Por favor configura tu clave API en Configuración del Sistema.');
  }

  try {
    const teamSummary = teamData?.map(member => 
      `${member?.name} (${member?.role}): Velocidad ${member?.velocity}, Utilización ${member?.utilization}%, Completados ${member?.completed}`
    )?.join('\n');

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini',
      messages: [
        { 
          role: 'system', 
          content: 'Eres un experto en gestión de equipos de desarrollo. Analiza el rendimiento del equipo y proporciona recomendaciones en español.' 
        },
        { 
          role: 'user', 
          content: `Analiza el rendimiento de este equipo:\n\n${teamSummary}\n\nProporciona insights sobre fortalezas, áreas de mejora y recomendaciones.` 
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'team_analysis',
          schema: {
            type: 'object',
            properties: {
              fortalezas: {
                type: 'array',
                items: { type: 'string' }
              },
              areasDeMejora: {
                type: 'array',
                items: { type: 'string' }
              },
              recomendaciones: {
                type: 'array',
                items: { type: 'string' }
              },
              miembrosDestacados: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['fortalezas', 'areasDeMejora', 'recomendaciones'],
            additionalProperties: false,
          },
        },
      },
      reasoning_effort: 'minimal',
      verbosity: 'low',
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    const errorInfo = getErrorMessage(error);
    if (errorInfo?.isInternal) {
      console.log(errorInfo?.message);
    } else {
      console.error('Error in team performance analysis:', error);
    }
    throw new Error(errorInfo.message);
  }
}

/**
 * Tests the OpenAI API connection
 * @returns {Promise<boolean>} True if connection successful
 */
export async function testConnection() {
  const openai = getClient();
  
  if (!openai) {
    throw new Error('OpenAI no está configurado. Por favor configura tu clave API.');
  }

  try {
    await openai?.chat?.completions?.create({
      model: 'gpt-5-mini',
      messages: [{ role: 'user', content: 'Test' }],
      max_completion_tokens: 5,
    });
    return true;
  } catch (error) {
    const errorInfo = getErrorMessage(error);
    if (errorInfo?.isInternal) {
      console.log(errorInfo?.message);
    } else {
      console.error('Error testing OpenAI connection:', error);
    }
    throw new Error(errorInfo.message);
  }
}

export default {
  generateAnalyticsInsights,
  analyzeTeamPerformance,
  testConnection
};