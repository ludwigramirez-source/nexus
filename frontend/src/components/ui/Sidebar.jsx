import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      section: 'Panel de Control',
      items: [
        {
          label: 'Panel Ejecutivo',
          path: '/executive-dashboard',
          icon: 'LayoutDashboard'
        }
      ]
    },
    {
      section: 'Operaciones',
      items: [
        {
          label: 'Gestión de Solicitudes',
          path: '/request-management-center',
          icon: 'Inbox'
        },
        {
          label: 'Planificación de Capacidad',
          path: '/capacity-planning-workspace',
          icon: 'Calendar'
        },
        {
          label: 'OKRs y Roadmap',
          path: '/ok-rs-and-roadmap-management',
          icon: 'Target'
        },
        {
          label: 'Productos y Clientes',
          path: '/products-and-client-portfolio',
          icon: 'Briefcase'
        }
      ]
    },
    {
      section: 'Analíticas',
      items: [
        {
          label: 'Analíticas e Insights',
          path: '/analytics-and-insights-dashboard',
          icon: 'BarChart3'
        },
        {
          label: 'Dashboard Predictivo',
          path: '/predictive-risk-dashboard',
          icon: 'Activity'
        }
      ]
    },
    {
      section: 'Administración',
      items: [
        {
          label: 'Equipo y Sistema',
          path: '/team-and-system-administration',
          icon: 'Settings'
        },
        {
          label: 'Registro de Actividades',
          path: '/activity-logs',
          icon: 'FileText'
        }
      ]
    }
  ];

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLinkClick = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      <button
        onClick={handleMobileToggle}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card shadow-elevation-2 text-foreground hover:bg-muted transition-smooth"
        aria-label="Toggle mobile menu"
      >
        <Icon name={isMobileOpen ? 'X' : 'Menu'} size={24} />
      </button>
      <aside
        className={`
          fixed top-0 left-0 h-full bg-card border-r border-border z-40 transition-smooth
          ${isCollapsed ? 'w-20' : 'w-60'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'sidebar-collapsed' : ''}
        `}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Icon name="Shield" size={28} className="sidebar-logo-icon" />
          </div>
          {!isCollapsed && (
            <span className="sidebar-logo-text ml-3 text-lg font-heading font-semibold text-foreground">
              IPTEGRA Nexus
            </span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {navigationItems?.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {!isCollapsed && (
                <h3 className="px-3 mb-2 text-xs font-caption font-medium text-muted-foreground uppercase tracking-wider">
                  {section?.section}
                </h3>
              )}
              <ul className="space-y-1">
                {section?.items?.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      to={item?.path}
                      onClick={handleLinkClick}
                      className={`
                        flex items-center px-3 py-2.5 rounded-lg transition-smooth
                        ${isActiveRoute(item?.path)
                          ? 'bg-primary text-primary-foreground shadow-elevation-1'
                          : 'text-foreground hover:bg-muted hover:text-foreground'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                      title={isCollapsed ? item?.label : ''}
                    >
                      <Icon
                        name={item?.icon}
                        size={20}
                        className={isCollapsed ? '' : 'mr-3'}
                      />
                      {!isCollapsed && (
                        <span className="text-sm font-caption font-medium">
                          {item?.label}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {onToggleCollapse && (
          <div className="hidden lg:block p-4 border-t border-border">
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-smooth"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon
                name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'}
                size={20}
              />
              {!isCollapsed && (
                <span className="ml-2 text-sm font-caption font-medium">
                  Contraer
                </span>
              )}
            </button>
          </div>
        )}
      </aside>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background z-50 lg:hidden"
          onClick={handleMobileToggle}
        />
      )}
    </>
  );
};

export default Sidebar;