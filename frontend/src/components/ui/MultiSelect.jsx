import React, { useState } from 'react';
import Icon from '../AppIcon';

const MultiSelect = ({
  label,
  options = [],
  value = [],
  onChange,
  placeholder = 'Seleccionar...',
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleRemove = (optionValue) => {
    onChange(value.filter(v => v !== optionValue));
  };

  const getSelectedLabels = () => {
    return options
      .filter(opt => value.includes(opt.value))
      .map(opt => opt.label);
  };

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-caption font-medium text-foreground mb-2">
          {label}
        </label>
      )}

      {/* Selected items display */}
      <div className="mb-2 flex flex-wrap gap-2">
        {getSelectedLabels().map((label, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-primary/10 text-primary"
          >
            {label}
            <button
              type="button"
              onClick={() => handleRemove(value[idx])}
              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
            >
              <Icon name="X" className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Dropdown trigger */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-3 py-2 text-left border rounded-lg bg-background
            focus:outline-none focus:ring-2 focus:ring-primary transition-smooth
            ${error ? 'border-destructive' : 'border-border'}
            ${isOpen ? 'ring-2 ring-primary' : ''}
          `}
        >
          <div className="flex items-center justify-between">
            <span className={value.length === 0 ? 'text-muted-foreground' : 'text-foreground'}>
              {value.length === 0 ? placeholder : `${value.length} seleccionado(s)`}
            </span>
            <Icon name={isOpen ? 'ChevronUp' : 'ChevronDown'} className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-elevation-3 max-h-64 overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b border-border">
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Options list */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                  No se encontraron opciones
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center px-4 py-2 hover:bg-muted cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(option.value)}
                      onChange={() => handleToggle(option.value)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span className="ml-3 text-sm text-foreground">{option.label}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default MultiSelect;
