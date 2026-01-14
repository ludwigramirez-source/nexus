import React from 'react';

const Tabs = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`border-b border-border ${className}`}>
      <nav className="flex space-x-1" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              px-4 py-3 text-sm font-medium transition-all duration-200
              border-b-2 -mb-px
              ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            disabled={tab.disabled}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <div className="flex items-center space-x-2">
              {tab.icon && <span className="text-lg">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                  {tab.count}
                </span>
              )}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
