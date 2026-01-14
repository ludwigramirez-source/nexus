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
 * Detects operational risks using GPT-5
 * @param {Object} operationalData - Current operational data
 * @returns {Promise<Object>} Risk analysis with alerts
 */
export async function detectOperationalRisks(operationalData) {
  const openai = getClient();
  
  if (!openai) {
    throw new Error('OpenAI no está configurado. Por favor configura tu clave API en Configuración del Sistema.');
  }

  try {
    const prompt = `Analiza los siguientes datos operacionales de un equipo de desarrollo de software y detecta riesgos automáticamente:

Datos Operacionales:
- Utilización de Capacidad: ${operationalData?.capacityUtilization || 'N/A'}%
- Velocidad del Equipo: ${operationalData?.teamVelocity || 'N/A'} puntos/sprint
- Ratio Producto/Personalización: ${operationalData?.productCustomRatio || 'N/A'}
- MRR Total: ${operationalData?.mrr || 'N/A'}
- Solicitudes Pendientes: ${operationalData?.pendingRequests || 'N/A'}
- Progreso OKRs: ${operationalData?.okrProgress || 'N/A'}%

Equipo:
${operationalData?.teamMembers?.map(m => `- ${m?.name} (${m?.role}): Utilización ${m?.utilization}%, Velocidad ${m?.velocity}`)?.join('\n')}

Detecta automáticamente:
1. Sobrecarga de equipo (utilización > 95%)
2. Clientes en riesgo (baja velocidad, alta personalización)
3. Desviaciones de OKRs (progreso < 70%)
4. Oportunidades de productización (patrones de personalización repetidos)

Proporciona análisis detallado con alertas inteligentes y recomendaciones accionables.`;

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5',
      messages: [
        { 
          role: 'system', 
          content: 'Eres un experto analista de riesgos operacionales para equipos de desarrollo de software. Detectas automáticamente riesgos críticos y proporcionas alertas inteligentes con recomendaciones accionables en español. Sé específico y directo en tus análisis.' 
        },
        { role: 'user', content: prompt },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'risk_detection',
          schema: {
            type: 'object',
            properties: {
              resumenEjecutivo: { 
                type: 'string', 
                description: 'Resumen ejecutivo del análisis de riesgos' 
              },
              sobrecargaEquipo: {
                type: 'object',
                properties: {
                  detectado: { type: 'boolean' },
                  severidad: { type: 'string', enum: ['critica', 'alta', 'media', 'baja', 'ninguna'] },
                  miembrosAfectados: { type: 'array', items: { type: 'string' } },
                  descripcion: { type: 'string' },
                  recomendaciones: { type: 'array', items: { type: 'string' } }
                },
                required: ['detectado', 'severidad']
              },
              clientesEnRiesgo: {
                type: 'object',
                properties: {
                  detectado: { type: 'boolean' },
                  severidad: { type: 'string', enum: ['critica', 'alta', 'media', 'baja', 'ninguna'] },
                  clientesIdentificados: { type: 'array', items: { type: 'string' } },
                  descripcion: { type: 'string' },
                  recomendaciones: { type: 'array', items: { type: 'string' } }
                },
                required: ['detectado', 'severidad']
              },
              desviacionesOKR: {
                type: 'object',
                properties: {
                  detectado: { type: 'boolean' },
                  severidad: { type: 'string', enum: ['critica', 'alta', 'media', 'baja', 'ninguna'] },
                  objetivosAfectados: { type: 'array', items: { type: 'string' } },
                  descripcion: { type: 'string' },
                  recomendaciones: { type: 'array', items: { type: 'string' } }
                },
                required: ['detectado', 'severidad']
              },
              oportunidadesProductizacion: {
                type: 'object',
                properties: {
                  detectado: { type: 'boolean' },
                  potencial: { type: 'string', enum: ['alto', 'medio', 'bajo', 'ninguno'] },
                  patronesIdentificados: { type: 'array', items: { type: 'string' } },
                  descripcion: { type: 'string' },
                  recomendaciones: { type: 'array', items: { type: 'string' } }
                },
                required: ['detectado', 'potencial']
              },
              alertasInteligentes: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    tipo: { type: 'string', enum: ['sobrecarga', 'cliente_riesgo', 'okr', 'productizacion', 'general'] },
                    severidad: { type: 'string', enum: ['critica', 'alta', 'media', 'baja'] },
                    titulo: { type: 'string' },
                    mensaje: { type: 'string' },
                    metrica: { type: 'string' },
                    accionRecomendada: { type: 'string' }
                  },
                  required: ['tipo', 'severidad', 'titulo', 'mensaje']
                }
              },
              scoreRiesgoGeneral: {
                type: 'number',
                minimum: 0,
                maximum: 100,
                description: 'Score de riesgo general del 0-100 (100 = riesgo crítico)'
              }
            },
            required: ['resumenEjecutivo', 'sobrecargaEquipo', 'clientesEnRiesgo', 'desviacionesOKR', 'oportunidadesProductizacion', 'alertasInteligentes', 'scoreRiesgoGeneral'],
            additionalProperties: false,
          },
        },
      },
      reasoning_effort: 'high',
      verbosity: 'high',
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    const errorInfo = getErrorMessage(error);
    if (errorInfo?.isInternal) {
      console.log(errorInfo?.message);
    } else {
      console.error('Error in risk detection:', error);
    }
    throw new Error(errorInfo.message);
  }
}

/**
 * Generates predictive insights for future risks
 * @param {Object} historicalData - Historical operational data
 * @returns {Promise<Object>} Predictive insights
 */
export async function generatePredictiveInsights(historicalData) {
  const openai = getClient();
  
  if (!openai) {
    throw new Error('OpenAI no está configurado. Por favor configura tu clave API en Configuración del Sistema.');
  }

  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini',
      messages: [
        { 
          role: 'system', 
          content: 'Eres un experto en análisis predictivo para equipos de desarrollo. Identifica tendencias y predice riesgos futuros basándote en datos históricos.' 
        },
        { 
          role: 'user', 
          content: `Analiza estos datos históricos y predice riesgos futuros:\n\n${JSON.stringify(historicalData, null, 2)}\n\nProporciona predicciones para las próximas 2-4 semanas.` 
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'predictive_insights',
          schema: {
            type: 'object',
            properties: {
              tendencias: {
                type: 'array',
                items: { type: 'string' }
              },
              predicciones: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    categoria: { type: 'string' },
                    prediccion: { type: 'string' },
                    probabilidad: { type: 'string', enum: ['alta', 'media', 'baja'] },
                    impacto: { type: 'string', enum: ['alto', 'medio', 'bajo'] }
                  },
                  required: ['categoria', 'prediccion', 'probabilidad']
                }
              },
              recomendacionesPreventivas: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['tendencias', 'predicciones', 'recomendacionesPreventivas'],
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
      console.error('Error in predictive insights:', error);
    }
    throw new Error(errorInfo.message);
  }
}

export default {
  detectOperationalRisks,
  generatePredictiveInsights
};