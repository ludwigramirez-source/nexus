import React from 'react';
import Icon from '../../../components/AppIcon';

const PasswordPolicyCard = ({ policy }) => {
  const requirements = [
    {
      id: 'length',
      label: `Mínimo ${policy?.minLength} caracteres`,
      met: policy?.minLength >= 8,
      icon: 'Type'
    },
    {
      id: 'uppercase',
      label: 'Al menos una letra mayúscula',
      met: policy?.requireUppercase,
      icon: 'CaseSensitive'
    },
    {
      id: 'lowercase',
      label: 'Al menos una letra minúscula',
      met: policy?.requireLowercase,
      icon: 'CaseSensitive'
    },
    {
      id: 'number',
      label: 'Al menos un número',
      met: policy?.requireNumber,
      icon: 'Hash'
    },
    {
      id: 'special',
      label: 'Al menos un carácter especial',
      met: policy?.requireSpecial,
      icon: 'Asterisk'
    },
    {
      id: 'expiration',
      label: `Cambio cada ${policy?.expirationDays} días`,
      met: policy?.expirationDays > 0,
      icon: 'Calendar'
    }
  ];

  return (
    <div className="p-4 md:p-6 bg-card rounded-lg border border-border shadow-elevation-1">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon name="Key" size={24} className="text-primary" />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Política de Contraseñas
          </h3>
          <p className="text-xs md:text-sm font-caption text-muted-foreground">
            Requisitos de seguridad activos
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {requirements?.map(req => (
          <div key={req?.id} className="flex items-start space-x-3">
            <div className={`
              p-1 rounded-full flex-shrink-0
              ${req?.met ? 'bg-success/10' : 'bg-muted'}
            `}>
              <Icon
                name={req?.met ? 'Check' : 'X'}
                size={16}
                className={req?.met ? 'text-success' : 'text-muted-foreground'}
              />
            </div>
            <div className="flex items-center space-x-2 flex-1">
              <Icon name={req?.icon} size={16} className="text-muted-foreground" />
              <span className={`
                text-xs md:text-sm font-caption
                ${req?.met ? 'text-foreground' : 'text-muted-foreground'}
              `}>
                {req?.label}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs md:text-sm font-caption text-muted-foreground">
            Intentos fallidos permitidos
          </span>
          <span className="text-xs md:text-sm font-caption font-medium text-foreground">
            {policy?.maxFailedAttempts}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs md:text-sm font-caption text-muted-foreground">
            Tiempo de bloqueo
          </span>
          <span className="text-xs md:text-sm font-caption font-medium text-foreground">
            {policy?.lockoutDuration} minutos
          </span>
        </div>
      </div>
    </div>
  );
};

export default PasswordPolicyCard;