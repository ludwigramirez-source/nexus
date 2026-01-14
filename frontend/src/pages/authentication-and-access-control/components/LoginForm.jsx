import React, { useState } from 'react';
import { authService } from '../../../services/authService';

const LoginForm = ({ onLogin, onForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberDevice: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({ ...prev, rememberDevice: e.target.checked }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Formato de correo electrónico inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔵 Login submit started');

    if (!validateForm()) {
      console.log('❌ Validation failed');
      return;
    }

    setIsLoading(true);
    console.log('🔄 Calling authService.login with:', formData.email);

    try {
      const response = await authService.login(formData.email, formData.password);
      console.log('✅ Login response:', response);

      // authService ya guardó el access_token
      // La respuesta es {user: {...}, tokens: {...}}
      if (response && response.user && response.tokens) {
        console.log('✅ Login successful, saving additional tokens...');
        localStorage.setItem('refresh_token', response.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));

        console.log('✅ Tokens saved, calling onLogin...');
        onLogin({
          ...response.user,
          rememberDevice: formData.rememberDevice,
          loginTime: new Date().toISOString()
        });
        console.log('✅ onLogin called');
      } else {
        console.log('❌ Invalid login response structure');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      console.error('❌ Error details:', error.response?.data);
      setErrors({
        email: error.response?.data?.message || 'Credenciales inválidas. Verifique su correo y contraseña.',
        password: error.response?.data?.message || 'Credenciales inválidas. Verifique su correo y contraseña.'
      });
    } finally {
      setIsLoading(false);
      console.log('🔵 Login submit finished');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          {/* Shield SVG Icon */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground mb-2">
          IPTEGRA Nexus
        </h1>
        <p className="text-sm md:text-base font-caption text-muted-foreground">
          Inicie sesión para acceder a su cuenta
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="usuario@iptegra.com"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
              errors.email ? 'border-red-500' : 'border-border'
            }`}
            required
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Contraseña
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="Ingrese su contraseña"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth ${
              errors.password ? 'border-red-500' : 'border-border'
            }`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Remember Device & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.rememberDevice}
              onChange={handleCheckboxChange}
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm text-foreground">Recordar dispositivo</span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-caption text-primary hover:text-primary/80 transition-smooth"
          >
            ¿Olvidó su contraseña?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Iniciando sesión...
            </>
          ) : (
            <>
              Iniciar Sesión
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Test Credentials */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-xs font-caption text-muted-foreground text-center mb-2">
          Credenciales de prueba disponibles:
        </p>
        <div className="space-y-1 text-xs font-caption text-muted-foreground">
          <p>Admin (CEO): admin@iptegra.com / admin123</p>
          <p>Director Desarrollo: dev1@iptegra.com / dev123</p>
          <p>Desarrollador: dev2@iptegra.com / dev123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
