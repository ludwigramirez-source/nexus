# GUÍA DE MODIFICACIONES AL FRONTEND
## IPTEGRA Nexus - Conectar Frontend con Backend API

**Fecha:** Enero 2025  
**Propósito:** Reemplazar Supabase por API REST + Socket.io

---

## 📋 RESUMEN DE CAMBIOS

El frontend actual usa **Supabase** para todo. Vamos a reemplazarlo con:
- ✅ **API REST** (Axios) para CRUD operations
- ✅ **Socket.io** para real-time updates
- ✅ **JWT** para autenticación
- ✅ **Selector de IA** (OpenAI vs Claude)

---

## 🗂️ ARCHIVOS A MODIFICAR/CREAR

### 1. **CREAR**: `src/services/api.js` (Nuevo cliente API)

```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para cookies httpOnly
});

// Request interceptor - añadir token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - manejar errores y refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no hemos intentado refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refresh token
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Guardar nuevo token
        localStorage.setItem('access_token', data.data.accessToken);

        // Reintentar request original
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falló - logout
        localStorage.removeItem('access_token');
        window.location.href = '/authentication-and-access-control';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

### 2. **CREAR**: `src/services/socketService.js` (Socket.io client)

```javascript
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) return;

    const token = localStorage.getItem('access_token');
    
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (!this.socket) this.connect();
    
    this.socket.on(event, callback);
    
    // Guardar listener para cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
    
    // Remover de listeners
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (!this.socket) this.connect();
    this.socket.emit(event, data);
  }

  // Métodos específicos para Nexus
  joinRequestRoom(requestId) {
    this.emit('join_request', { requestId });
  }

  leaveRequestRoom(requestId) {
    this.emit('leave_request', { requestId });
  }
}

export default new SocketService();
```

---

### 3. **REEMPLAZAR**: `src/services/activityService.js`

**ANTES (Supabase):**
```javascript
import { supabase } from './supabaseClient';

export const activityService = {
  async getActivitiesByRequestId(requestId) {
    const { data, error } = await supabase
      .from('request_activities')
      .select('*')
      .eq('request_id', requestId);
    // ...
  }
};
```

**DESPUÉS (API REST):**
```javascript
import api from './api';

export const activityService = {
  async getActivitiesByRequestId(requestId) {
    try {
      const { data } = await api.get(`/requests/${requestId}/activities`);
      return data.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  async createActivity(requestId, activityData) {
    try {
      const { data } = await api.post(`/requests/${requestId}/activities`, activityData);
      return data.data;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  },
};
```

---

### 4. **REEMPLAZAR**: `src/services/commentService.js`

```javascript
import api from './api';

export const commentService = {
  async getCommentsByRequestId(requestId) {
    const { data } = await api.get(`/requests/${requestId}/comments`);
    return data.data;
  },

  async createComment(requestId, content) {
    const { data } = await api.post(`/requests/${requestId}/comments`, { content });
    return data.data;
  },

  async updateComment(requestId, commentId, content) {
    const { data } = await api.put(`/requests/${requestId}/comments/${commentId}`, { content });
    return data.data;
  },

  async deleteComment(requestId, commentId) {
    await api.delete(`/requests/${requestId}/comments/${commentId}`);
  },
};
```

---

### 5. **CREAR**: `src/services/requestService.js`

```javascript
import api from './api';

export const requestService = {
  // Get all requests with filters
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.type) params.append('type', filters.type);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.product) params.append('product', filters.product);
    if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const { data } = await api.get(`/requests?${params.toString()}`);
    return data;
  },

  // Get single request
  async getById(id) {
    const { data } = await api.get(`/requests/${id}`);
    return data.data;
  },

  // Create request
  async create(requestData) {
    const { data } = await api.post('/requests', requestData);
    return data.data;
  },

  // Update request
  async update(id, requestData) {
    const { data } = await api.put(`/requests/${id}`, requestData);
    return data.data;
  },

  // Delete request
  async delete(id) {
    await api.delete(`/requests/${id}`);
  },

  // Change status
  async updateStatus(id, status, notes) {
    const { data } = await api.patch(`/requests/${id}/status`, { status, notes });
    return data.data;
  },

  // Assign users
  async assignUsers(id, userIds) {
    const { data } = await api.patch(`/requests/${id}/assign`, { userIds });
    return data.data;
  },

  // Get activities
  async getActivities(id) {
    const { data } = await api.get(`/requests/${id}/activities`);
    return data.data;
  },

  // Get comments
  async getComments(id) {
    const { data } = await api.get(`/requests/${id}/comments`);
    return data.data;
  },

  // Add comment
  async addComment(id, content) {
    const { data } = await api.post(`/requests/${id}/comments`, { content });
    return data.data;
  },
};
```

---

### 6. **CREAR**: `src/services/authService.js`

```javascript
import api from './api';

export const authService = {
  async register(userData) {
    const { data } = await api.post('/auth/register', userData);
    
    // Guardar token
    localStorage.setItem('access_token', data.data.accessToken);
    
    return data.data;
  },

  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    
    // Guardar token
    localStorage.setItem('access_token', data.data.accessToken);
    
    return data.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
    }
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return data.data;
  },

  async refreshToken() {
    const { data } = await api.post('/auth/refresh');
    localStorage.setItem('access_token', data.data.accessToken);
    return data.data;
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },
};
```

---

### 7. **MODIFICAR**: `src/services/openaiClient.js` → `src/services/aiService.js`

```javascript
import api from './api';

// Get AI provider from system config
let aiProvider = localStorage.getItem('ai_provider') || 'claude';

export const aiService = {
  setProvider(provider) {
    aiProvider = provider;
    localStorage.setItem('ai_provider', provider);
  },

  getProvider() {
    return aiProvider;
  },

  async generateCompletion(messages, options = {}) {
    try {
      const { data } = await api.post('/ai/completion', {
        messages,
        provider: options.provider || aiProvider,
        maxTokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
      });
      
      return data.data;
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    }
  },

  async generateInsights(analyticsData) {
    try {
      const { data } = await api.post('/ai/insights', {
        data: analyticsData,
        provider: aiProvider,
      });
      
      return data.data.insights;
    } catch (error) {
      console.error('Insights generation error:', error);
      return [];
    }
  },

  async analyzeSimilarRequests(requestData) {
    try {
      const { data } = await api.post('/ai/analyze-similarity', {
        request: requestData,
        provider: aiProvider,
      });
      
      return data.data.similar;
    } catch (error) {
      console.error('Similarity analysis error:', error);
      return [];
    }
  },
};
```

---

### 8. **MODIFICAR**: `src/pages/authentication-and-access-control/components/LoginForm.jsx`

Buscar la función de login y reemplazar con:

```javascript
import { authService } from '../../../services/authService';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate('/'); // Redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

---

### 9. **MODIFICAR**: Cualquier página que use datos

**PATRÓN GENERAL:**

**ANTES:**
```javascript
const { data, error } = await supabase.from('requests').select('*');
```

**DESPUÉS:**
```javascript
import { requestService } from '../../services/requestService';

const data = await requestService.getAll();
```

---

### 10. **AGREGAR**: Socket.io listeners en páginas relevantes

**Ejemplo en `src/pages/request-management-center/index.jsx`:**

```javascript
import { useEffect } from 'react';
import socketService from '../../services/socketService';

const RequestManagementCenter = () => {
  useEffect(() => {
    // Conectar socket
    socketService.connect();

    // Escuchar eventos
    const handleRequestUpdate = (data) => {
      console.log('Request updated:', data);
      // Refrescar lista de requests
      fetchRequests();
    };

    const handleNewRequest = (data) => {
      console.log('New request:', data);
      // Agregar a lista
      setRequests(prev => [data, ...prev]);
    };

    socketService.on('request:updated', handleRequestUpdate);
    socketService.on('request:created', handleNewRequest);

    // Cleanup
    return () => {
      socketService.off('request:updated', handleRequestUpdate);
      socketService.off('request:created', handleNewRequest);
    };
  }, []);

  // ... rest of component
};
```

---

### 11. **AGREGAR**: Selector de IA en Settings

**En `src/pages/team-and-system-administration/components/SystemConfigPanel.jsx`:**

```javascript
import { aiService } from '../../../services/aiService';

const AIProviderSelector = () => {
  const [provider, setProvider] = useState(aiService.getProvider());

  const handleChange = (newProvider) => {
    aiService.setProvider(newProvider);
    setProvider(newProvider);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">AI Provider</h3>
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="openai"
            checked={provider === 'openai'}
            onChange={() => handleChange('openai')}
          />
          <span>OpenAI (GPT-4)</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="claude"
            checked={provider === 'claude'}
            onChange={() => handleChange('claude')}
          />
          <span>Claude (Anthropic)</span>
        </label>
      </div>
    </div>
  );
};
```

---

### 12. **ACTUALIZAR**: `.env` del frontend

Crear archivo `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

---

## 📦 ARCHIVOS A ELIMINAR

```bash
# Ya no necesitamos estos archivos de Supabase
rm src/services/supabaseClient.js
rm src/services/encryptionService.js  # (opcional, si no lo usas)
```

---

## 🔄 MAPEO DE SERVICIOS

| Función Antigua (Supabase) | Nueva Función (API REST) |
|----------------------------|--------------------------|
| `supabase.from('requests').select()` | `requestService.getAll()` |
| `supabase.from('requests').insert()` | `requestService.create()` |
| `supabase.from('requests').update()` | `requestService.update()` |
| `supabase.from('requests').delete()` | `requestService.delete()` |
| `supabase.channel().subscribe()` | `socketService.on()` |
| `supabase.auth.signIn()` | `authService.login()` |
| `supabase.auth.signOut()` | `authService.logout()` |

---

## 🚀 ORDEN DE IMPLEMENTACIÓN

**Fase 1: Servicios Base (15 min)**
1. Crear `api.js`
2. Crear `socketService.js`
3. Crear `authService.js`

**Fase 2: Servicios de Datos (30 min)**
4. Crear `requestService.js`
5. Modificar `activityService.js`
6. Modificar `commentService.js`
7. Crear servicios para otros módulos (users, okrs, etc.)

**Fase 3: Componentes UI (45 min)**
8. Modificar `LoginForm.jsx`
9. Actualizar todas las páginas que usan Supabase
10. Agregar listeners de Socket.io donde sea necesario

**Fase 4: Config y Testing (30 min)**
11. Configurar `.env`
12. Eliminar archivos viejos
13. Probar login/logout
14. Probar CRUD de requests
15. Probar real-time updates

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] `api.js` creado y configurado
- [ ] `socketService.js` creado
- [ ] `authService.js` creado  
- [ ] `requestService.js` creado
- [ ] Login funciona
- [ ] Logout funciona
- [ ] CRUD de requests funciona
- [ ] Real-time updates funcionan
- [ ] Selector de IA agregado
- [ ] Variables de entorno configuradas
- [ ] Archivos de Supabase eliminados
- [ ] No hay errores en consola

---

## 🐛 DEBUGGING COMÚN

**Error: "Network Error"**
- Verificar que el backend esté corriendo en puerto 3001
- Verificar CORS en el backend
- Verificar `.env` del frontend

**Error: "401 Unauthorized"**
- Verificar que el token esté en localStorage
- Verificar interceptor de Axios
- Intentar logout y login de nuevo

**Socket.io no conecta:**
- Verificar que Socket.io esté corriendo en el backend
- Verificar URL en `socketService.js`
- Revisar consola del navegador

---

## 📝 NOTAS IMPORTANTES

1. **Cookies vs LocalStorage**: Usamos cookies httpOnly para refresh token (más seguro) y localStorage para access token (más fácil de usar con Axios)

2. **Real-time**: Socket.io solo se usa para notificaciones en tiempo real. Los datos iniciales siempre vienen de la API REST.

3. **Error Handling**: Todos los servicios deben tener try/catch y mostrar errores al usuario apropiadamente.

4. **Loading States**: No olvides agregar loading states en los componentes UI.

---

**ESTE DOCUMENTO ES TU GUÍA COMPLETA. Sigue los pasos en orden y tendrás el frontend conectado al backend en ~2 horas.**

¿Dudas? Usa Claude Code para ayudarte con cada paso.
