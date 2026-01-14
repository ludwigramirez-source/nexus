import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportPanel = ({ onExport }) => {
  const [exportConfig, setExportConfig] = useState({
    format: 'csv',
    dateRange: 'current',
    includeCharts: false,
    includeRawData: true,
    includeInsights: true
  });

  const formatOptions = [
    { value: 'csv', label: 'CSV (Excel)' },
    { value: 'json', label: 'JSON' },
    { value: 'pdf', label: 'PDF Report' },
    { value: 'xlsx', label: 'Excel (XLSX)' }
  ];

  const dateRangeOptions = [
    { value: 'current', label: 'Período actual' },
    { value: 'last30days', label: 'Últimos 30 días' },
    { value: 'last90days', label: 'Últimos 90 días' },
    { value: 'thisYear', label: 'Este año' },
    { value: 'all', label: 'Todos los datos' }
  ];

  const handleExport = () => {
    onExport(exportConfig);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-4 md:mb-6">
        <Icon name="Download" size={20} className="text-primary" />
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
          Exportar Datos
        </h3>
      </div>
      <div className="space-y-4">
        <Select
          label="Formato de exportación"
          options={formatOptions}
          value={exportConfig?.format}
          onChange={(value) => setExportConfig(prev => ({ ...prev, format: value }))}
        />

        <Select
          label="Rango de datos"
          options={dateRangeOptions}
          value={exportConfig?.dateRange}
          onChange={(value) => setExportConfig(prev => ({ ...prev, dateRange: value }))}
        />

        <div className="space-y-3 pt-2">
          <p className="text-sm font-caption font-medium text-foreground">
            Incluir en la exportación:
          </p>
          
          <Checkbox
            label="Gráficos y visualizaciones"
            checked={exportConfig?.includeCharts}
            onChange={(e) => setExportConfig(prev => ({ ...prev, includeCharts: e?.target?.checked }))}
          />

          <Checkbox
            label="Datos sin procesar"
            checked={exportConfig?.includeRawData}
            onChange={(e) => setExportConfig(prev => ({ ...prev, includeRawData: e?.target?.checked }))}
          />

          <Checkbox
            label="Insights y recomendaciones"
            checked={exportConfig?.includeInsights}
            onChange={(e) => setExportConfig(prev => ({ ...prev, includeInsights: e?.target?.checked }))}
          />
        </div>

        <Button
          variant="default"
          iconName="Download"
          iconPosition="left"
          onClick={handleExport}
          fullWidth
          className="mt-4"
        >
          Exportar Datos
        </Button>
      </div>
    </div>
  );
};

export default ExportPanel;