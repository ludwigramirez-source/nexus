import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SearchBar = ({ onSearch, onDateRangeChange, onSavedFilterSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const savedFilterOptions = [
    { value: 'my_tasks', label: 'Mis Tareas' },
    { value: 'urgent', label: 'Urgentes' },
    { value: 'unassigned', label: 'Sin Asignar' },
    { value: 'overdue', label: 'Atrasadas' },
    { value: 'this_week', label: 'Esta Semana' }
  ];

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleDateChange = (field, value) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    onDateRangeChange(newDateRange);
  };

  return (
    <div className="bg-card border-b border-border p-4 md:p-5 lg:p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 w-full">
          <div className="relative">
            <Icon
              name="Search"
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Buscar por ID, título, cliente..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-caption bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Input
              type="date"
              value={dateRange?.start}
              onChange={(e) => handleDateChange('start', e?.target?.value)}
              className="w-full sm:w-40"
            />
            <span className="text-sm font-caption text-muted-foreground">-</span>
            <Input
              type="date"
              value={dateRange?.end}
              onChange={(e) => handleDateChange('end', e?.target?.value)}
              className="w-full sm:w-40"
            />
          </div>

          <Select
            placeholder="Filtros guardados"
            options={savedFilterOptions}
            onChange={onSavedFilterSelect}
            className="w-full sm:w-48"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;