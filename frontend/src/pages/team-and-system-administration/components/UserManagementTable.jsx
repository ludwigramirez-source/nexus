import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserManagementTable = ({ users, onEdit, onDelete, onToggleStatus, onBulkAction }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const roleOptions = [
    { value: 'all', label: 'Todos los roles' },
    { value: 'ceo', label: 'CEO' },
    { value: 'director', label: 'Director de Desarrollo' },
    { value: 'backend', label: 'Desarrollador Backend' },
    { value: 'frontend', label: 'Desarrollador Frontend' }
  ];

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      setSelectedUsers(filteredUsers?.map(user => user?.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev?.includes(userId) 
        ? prev?.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredUsers = users?.filter(user => {
      const matchesSearch = user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                          user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesRole = roleFilter === 'all' || user?.role === roleFilter;
      return matchesSearch && matchesRole;
    })?.sort((a, b) => {
      const aValue = a?.[sortConfig?.key];
      const bValue = b?.[sortConfig?.key];
      const modifier = sortConfig?.direction === 'asc' ? 1 : -1;
      return aValue > bValue ? modifier : -modifier;
    });

  const getRoleBadgeColor = (role) => {
    const colors = {
      ceo: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      director: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      backend: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      frontend: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
    };
    return colors?.[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const getStatusColor = (status) => {
    return status === 'active' ?'text-success' :'text-muted-foreground';
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              options={roleOptions}
              value={roleFilter}
              onChange={setRoleFilter}
              placeholder="Filtrar por rol"
              className="w-full sm:w-48"
            />
            {selectedUsers?.length > 0 && (
              <Button
                variant="outline"
                iconName="Trash2"
                iconPosition="left"
                onClick={() => onBulkAction('delete', selectedUsers)}
              >
                Eliminar ({selectedUsers?.length})
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers?.length === filteredUsers?.length && filteredUsers?.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-sm font-caption font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Usuario
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                <button
                  onClick={() => handleSort('role')}
                  className="flex items-center gap-2 text-sm font-caption font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Rol
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">
                <button
                  onClick={() => handleSort('capacity')}
                  className="flex items-center gap-2 text-sm font-caption font-medium text-foreground hover:text-primary transition-smooth"
                >
                  Capacidad
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left hidden xl:table-cell">
                <span className="text-sm font-caption font-medium text-foreground">Habilidades</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-caption font-medium text-foreground">Estado</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-sm font-caption font-medium text-foreground">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers?.map((user) => (
              <tr key={user?.id} className="hover:bg-muted/30 transition-smooth">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers?.includes(user?.id)}
                    onChange={() => handleSelectUser(user?.id)}
                    className="rounded border-border"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-caption font-medium text-foreground truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs font-caption text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-caption font-medium ${getRoleBadgeColor(user?.role)}`}>
                    {user?.roleLabel}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-sm font-caption text-foreground">
                    {user?.capacity}h/semana
                  </span>
                </td>
                <td className="px-4 py-3 hidden xl:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {user?.skills?.slice(0, 3)?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-caption bg-muted text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                    {user?.skills?.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-caption bg-muted text-muted-foreground">
                        +{user?.skills?.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user?.status === 'active' ? 'bg-success' : 'bg-muted-foreground'}`} />
                    <span className={`text-sm font-caption ${getStatusColor(user?.status)}`}>
                      {user?.statusLabel}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName={user?.status === 'active' ? 'Lock' : 'CheckCircle'}
                      onClick={() => onToggleStatus(user?.id, user?.status)}
                      className={`h-8 w-8 ${user?.status === 'active' ? 'text-warning hover:text-warning' : 'text-success hover:text-success'}`}
                      title={user?.status === 'active' ? 'Desactivar usuario' : 'Activar usuario'}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="Edit"
                      onClick={() => onEdit(user)}
                      className="h-8 w-8"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="Trash2"
                      onClick={() => onDelete(user?.id)}
                      className="h-8 w-8 text-error hover:text-error"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredUsers?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <Icon name="Users" size={48} className="text-muted-foreground mb-3" />
          <p className="text-sm font-caption text-muted-foreground text-center">
            No se encontraron usuarios
          </p>
        </div>
      )}
      <div className="px-4 md:px-6 py-4 border-t border-border bg-muted/30">
        <p className="text-sm font-caption text-muted-foreground">
          Mostrando {filteredUsers?.length} de {users?.length} usuarios
        </p>
      </div>
    </div>
  );
};

export default UserManagementTable;