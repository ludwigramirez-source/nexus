import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { generateAnalyticsInsights, analyzeTeamPerformance } from '../../../services/openaiAnalyticsService';

const AIInsightsPanel = ({ analyticsData, teamData }) => {
  const [insights, setInsights] = useState(null);
  const [teamAnalysis, setTeamAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('insights');

  const handleGenerateInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await generateAnalyticsInsights(analyticsData);
      setInsights(result);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeTeam = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyzeTeamPerformance(teamData);
      setTeamAnalysis(result);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta':
        return 'text-error bg-error/10 border-error/20';
      case 'media':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'baja':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Sparkles" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Análisis con IA
              </h3>
              <p className="text-sm text-muted-foreground">
                Insights generados por OpenAI GPT-5
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeView === 'insights' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('insights')}
            >
              Insights Generales
            </Button>
            <Button
              variant={activeView === 'team' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('team')}
            >
              Análisis de Equipo
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          {activeView === 'insights' && (
            <Button
              onClick={handleGenerateInsights}
              loading={loading}
              iconName="Zap"
              disabled={loading}
            >
              Generar Insights
            </Button>
          )}
          {activeView === 'team' && (
            <Button
              onClick={handleAnalyzeTeam}
              loading={loading}
              iconName="Users"
              disabled={loading}
            >
              Analizar Equipo
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 md:p-6">
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Icon name="AlertCircle" size={20} className="text-error mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-error mb-1">Error al generar análisis</p>
                <p className="text-sm text-error/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-sm text-muted-foreground">Generando análisis con IA...</p>
          </div>
        )}

        {!loading && !error && activeView === 'insights' && insights && (
          <div className="space-y-6">
            <div className="bg-primary/5 rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Icon name="FileText" size={16} />
                Resumen Ejecutivo
              </h4>
              <p className="text-sm text-muted-foreground">{insights?.resumen}</p>
            </div>

            {insights?.insights && insights?.insights?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Icon name="Lightbulb" size={16} />
                  Insights Clave
                </h4>
                <div className="space-y-2">
                  {insights?.insights?.map((insight, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Icon name="ChevronRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {insights?.recomendaciones && insights?.recomendaciones?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Icon name="Target" size={16} />
                  Recomendaciones
                </h4>
                <div className="space-y-3">
                  {insights?.recomendaciones?.map((rec, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-sm font-medium text-foreground">{rec?.titulo}</h5>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(rec?.prioridad)}`}>
                          {rec?.prioridad?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec?.descripcion}</p>
                      {rec?.impacto && (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Impacto:</span> {rec?.impacto}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {insights?.alertas && insights?.alertas?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Icon name="AlertTriangle" size={16} className="text-warning" />
                  Alertas
                </h4>
                <div className="space-y-2">
                  {insights?.alertas?.map((alerta, index) => (
                    <div key={index} className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                      <p className="text-sm text-warning">{alerta}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !error && activeView === 'team' && teamAnalysis && (
          <div className="space-y-6">
            {teamAnalysis?.fortalezas && teamAnalysis?.fortalezas?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Icon name="TrendingUp" size={16} className="text-success" />
                  Fortalezas del Equipo
                </h4>
                <div className="space-y-2">
                  {teamAnalysis?.fortalezas?.map((fortaleza, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Icon name="CheckCircle" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span>{fortaleza}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {teamAnalysis?.areasDeMejora && teamAnalysis?.areasDeMejora?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Icon name="AlertCircle" size={16} className="text-warning" />
                  Áreas de Mejora
                </h4>
                <div className="space-y-2">
                  {teamAnalysis?.areasDeMejora?.map((area, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Icon name="ArrowRight" size={16} className="text-warning mt-0.5 flex-shrink-0" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {teamAnalysis?.recomendaciones && teamAnalysis?.recomendaciones?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Icon name="Target" size={16} />
                  Recomendaciones
                </h4>
                <div className="space-y-2">
                  {teamAnalysis?.recomendaciones?.map((rec, index) => (
                    <div key={index} className="border border-border rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {teamAnalysis?.miembrosDestacados && teamAnalysis?.miembrosDestacados?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Icon name="Award" size={16} className="text-primary" />
                  Miembros Destacados
                </h4>
                <div className="space-y-2">
                  {teamAnalysis?.miembrosDestacados?.map((miembro, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Icon name="Star" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>{miembro}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && !error && !insights && !teamAnalysis && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-muted/30 rounded-full mb-4">
              <Icon name="Sparkles" size={32} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Haz clic en el botón de arriba para generar análisis con IA
            </p>
            <p className="text-xs text-muted-foreground">
              Los insights se generarán basados en tus datos actuales
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsightsPanel;