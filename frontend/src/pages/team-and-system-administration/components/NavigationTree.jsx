import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const NavigationTree = ({ activeSection, onSectionChange }) => {
  const [expandedSections, setExpandedSections] = useState(['team', 'system']);

  const navigationItems = [
    {
      id: 'team',
      label: 'Gestión de Equipo',
      icon: 'Users',
      children: [
        { id: 'users', label: 'Usuarios', icon: 'User' },
        { id: 'roles', label: 'Permisos', icon: 'Shield' }
      ]
    },
    {
      id: 'system',
      label: 'Configuración del Sistema',
      icon: 'Settings',
      children: [
        { id: 'general', label: 'General', icon: 'Sliders' },
        { id: 'products', label: 'Productos', icon: 'Package' },
        { id: 'clients', label: 'Clientes', icon: 'Briefcase' },
        { id: 'company', label: 'Empresa', icon: 'Building2' },
        { id: 'okrs', label: 'OKRs', icon: 'Target' },
        { id: 'integrations', label: 'Integraciones', icon: 'Plug' }
      ]
    },
    {
      id: 'data',
      label: 'Gestión de Datos',
      icon: 'Database',
      children: [
        { id: 'export', label: 'Exportar Datos', icon: 'Download' },
        { id: 'import', label: 'Importar Datos', icon: 'Upload' },
        { id: 'backup', label: 'Respaldos', icon: 'HardDrive' }
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev =>
      prev?.includes(sectionId)
        ? prev?.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <nav className="bg-card rounded-lg border border-border shadow-elevation-1 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-caption font-semibold text-foreground uppercase tracking-wider">
          Navegación
        </h3>
      </div>
      <div className="space-y-2">
        {navigationItems?.map((section) => (
          <div key={section?.id}>
            <button
              onClick={() => toggleSection(section?.id)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-foreground hover:bg-muted transition-smooth"
            >
              <div className="flex items-center gap-2">
                <Icon name={section?.icon} size={18} />
                <span className="text-sm font-caption font-medium">
                  {section?.label}
                </span>
              </div>
              <Icon
                name={expandedSections?.includes(section?.id) ? 'ChevronDown' : 'ChevronRight'}
                size={16}
                className="text-muted-foreground"
              />
            </button>

            {expandedSections?.includes(section?.id) && section?.children && (
              <div className="ml-4 mt-1 space-y-1">
                {section?.children?.map((child) => (
                  <button
                    key={child?.id}
                    onClick={() => onSectionChange(child?.id)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-caption transition-smooth
                      ${activeSection === child?.id
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    <Icon name={child?.icon} size={16} />
                    {child?.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default NavigationTree;