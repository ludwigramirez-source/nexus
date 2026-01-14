import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const PermissionMatrix = ({ roles, modules, permissions, onPermissionChange }) => {
  const [expandedModules, setExpandedModules] = useState([]);

  const toggleModule = (moduleId) => {
    setExpandedModules(prev =>
      prev?.includes(moduleId)
        ? prev?.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const hasPermission = (roleId, moduleId, permissionType) => {
    return permissions?.some(
      p => p?.roleId === roleId && p?.moduleId === moduleId && p?.type === permissionType
    );
  };

  const getPermissionIcon = (type) => {
    switch (type) {
      case 'read':
        return 'Eye';
      case 'write':
        return 'Edit';
      case 'delete':
        return 'Trash2';
      case 'admin':
        return 'Shield';
      default:
        return 'Check';
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left py-3 px-4 text-xs md:text-sm font-caption font-medium text-muted-foreground uppercase tracking-wider min-w-[200px]">
                Módulo
              </th>
              {roles?.map(role => (
                <th key={role?.id} className="text-center py-3 px-2 md:px-4 text-xs md:text-sm font-caption font-medium text-muted-foreground uppercase tracking-wider min-w-[120px]">
                  <div className="flex flex-col items-center space-y-1">
                    <Icon name={role?.icon} size={20} className="text-primary" />
                    <span>{role?.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {modules?.map(module => (
              <React.Fragment key={module.id}>
                <tr className="hover:bg-muted/50 transition-smooth">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="flex items-center space-x-2 w-full text-left"
                    >
                      <Icon
                        name={expandedModules?.includes(module.id) ? 'ChevronDown' : 'ChevronRight'}
                        size={18}
                        className="text-muted-foreground"
                      />
                      <Icon name={module.icon} size={20} className="text-primary" />
                      <span className="text-sm md:text-base font-caption font-medium text-foreground">
                        {module.name}
                      </span>
                    </button>
                  </td>
                  {roles?.map(role => (
                    <td key={role?.id} className="py-3 px-2 md:px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {['read', 'write', 'delete']?.map(permType => (
                          <div
                            key={permType}
                            className={`
                              p-1 rounded transition-smooth
                              ${hasPermission(role?.id, module.id, permType)
                                ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                              }
                            `}
                            title={permType}
                          >
                            <Icon name={getPermissionIcon(permType)} size={14} />
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                {expandedModules?.includes(module.id) && module.subModules && (
                  <>
                    {module.subModules?.map(subModule => (
                      <tr key={subModule?.id} className="bg-muted/30 hover:bg-muted/50 transition-smooth">
                        <td className="py-2 px-4 pl-12">
                          <div className="flex items-center space-x-2">
                            <Icon name="CornerDownRight" size={16} className="text-muted-foreground" />
                            <span className="text-xs md:text-sm font-caption text-foreground">
                              {subModule?.name}
                            </span>
                          </div>
                        </td>
                        {roles?.map(role => (
                          <td key={role?.id} className="py-2 px-2 md:px-4 text-center">
                            <Checkbox
                              checked={hasPermission(role?.id, subModule?.id, 'read')}
                              onChange={(e) => onPermissionChange(role?.id, subModule?.id, 'read', e?.target?.checked)}
                              size="sm"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-success/10">
              <Icon name="Eye" size={14} className="text-success" />
            </div>
            <span className="text-xs md:text-sm font-caption text-muted-foreground">Lectura</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-success/10">
              <Icon name="Edit" size={14} className="text-success" />
            </div>
            <span className="text-xs md:text-sm font-caption text-muted-foreground">Escritura</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-success/10">
              <Icon name="Trash2" size={14} className="text-success" />
            </div>
            <span className="text-xs md:text-sm font-caption text-muted-foreground">Eliminar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionMatrix;