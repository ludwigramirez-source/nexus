# MEGA-PROMPT PARA CLAUDE CODE
## Generar Backend Completo de IPTEGRA Nexus

**INSTRUCCIONES:**
1. Copia este prompt completo
2. Pégalo en Claude Code en tu terminal
3. Claude Code generará TODOS los archivos del backend automáticamente

---

**PROMPT:**

Necesito que crees el backend completo para IPTEGRA Nexus, un sistema de gestión de proyectos.

Ya tengo la estructura base creada con:
- ✅ Prisma schema completo (en `prisma/schema.prisma`)
- ✅ Configuración (en `src/config/`)
- ✅ Utilidades (en `src/utils/`)
- ✅ Middlewares (en `src/middlewares/`)

**LO QUE NECESITO QUE GENERES:**

## 1. MÓDULOS COMPLETOS

Crea los siguientes módulos en `src/modules/`, cada uno con esta estructura:
- `[modulo].types.ts` - Interfaces y DTOs
- `[modulo].service.ts` - Lógica de negocio
- `[modulo].controller.ts` - Controladores Express
- `[modulo].routes.ts` - Rutas API

### Módulo: AUTH (`src/modules/auth/`)

**Endpoints requeridos:**
- POST `/api/auth/register` - Registro de usuario
- POST `/api/auth/login` - Login con email/password
- POST `/api/auth/refresh` - Refresh token
- POST `/api/auth/logout` - Logout
- GET `/api/auth/me` - Obtener usuario actual

**Funcionalidades:**
- Hash de passwords con bcrypt
- Generación de JWT (access + refresh tokens)
- Refresh token en cookies httpOnly
- Validación de datos con Zod
- Manejo de sesiones en base de datos

### Módulo: REQUESTS (`src/modules/requests/`)

**Endpoints requeridos:**
- GET `/api/requests` - Lista con filtros, paginación, búsqueda
- GET `/api/requests/:id` - Detalle de request
- POST `/api/requests` - Crear request
- PUT `/api/requests/:id` - Actualizar request
- DELETE `/api/requests/:id` - Eliminar request
- PATCH `/api/requests/:id/status` - Cambiar estado (con email notification)
- PATCH `/api/requests/:id/assign` - Asignar usuarios (con email notification)
- GET `/api/requests/:id/activities` - Timeline de actividades
- POST `/api/requests/:id/activities` - Crear actividad
- GET `/api/requests/:id/comments` - Comentarios
- POST `/api/requests/:id/comments` - Crear comentario

**Funcionalidades:**
- Filtros: status, type, priority, product, assignedTo, search, dateRange
- Paginación con cursor
- Envío de emails cuando cambia estado o se asigna
- Análisis de similitud con IA (opcional)
- Emit events de Socket.io para real-time

### Módulo: USERS (`src/modules/users/`)

**Endpoints requeridos:**
- GET `/api/users` - Lista de usuarios
- GET `/api/users/:id` - Detalle de usuario
- PUT `/api/users/:id` - Actualizar usuario
- DELETE `/api/users/:id` - Eliminar (soft delete)
- PATCH `/api/users/:id/status` - Cambiar status

**Funcionalidades:**
- Solo CEO y DEV_DIRECTOR pueden modificar
- Verificar que no tenga assignments activos antes de eliminar
- Estadísticas de usuario (requests asignados, etc.)

### Módulo: ASSIGNMENTS (`src/modules/assignments/`)

**Endpoints requeridos:**
- GET `/api/assignments` - Lista con filtros (userId, weekStart)
- GET `/api/assignments/:id` - Detalle
- POST `/api/assignments` - Crear asignación
- PUT `/api/assignments/:id` - Actualizar
- DELETE `/api/assignments/:id` - Eliminar
- GET `/api/assignments/by-week/:weekStart` - Por semana
- GET `/api/assignments/by-user/:userId` - Por usuario
- GET `/api/assignments/capacity-summary` - Resumen de capacidad

**Funcionalidades:**
- Validar que no se sobre-asigne capacidad
- Calcular utilización automáticamente
- Filtros por usuario, semana, status

### Módulo: OKRS (`src/modules/okrs/`)

**Endpoints requeridos:**
- GET `/api/okrs` - Lista (filtro por quarter)
- GET `/api/okrs/:id` - Detalle con key results
- POST `/api/okrs` - Crear OKR
- PUT `/api/okrs/:id` - Actualizar
- DELETE `/api/okrs/:id` - Eliminar
- PATCH `/api/okrs/:id/status` - Cambiar status
- POST `/api/okrs/:id/key-results` - Agregar key result
- PUT `/api/okrs/:okrId/key-results/:krId` - Actualizar key result
- DELETE `/api/okrs/:okrId/key-results/:krId` - Eliminar key result
- PATCH `/api/okrs/:okrId/key-results/:krId/progress` - Actualizar progreso

### Módulo: PRODUCTS (`src/modules/products/`)

**Endpoints requeridos:**
- GET `/api/products` - Lista de productos
- GET `/api/products/:id` - Detalle
- POST `/api/products` - Crear
- PUT `/api/products/:id` - Actualizar
- DELETE `/api/products/:id` - Eliminar
- GET `/api/products/:id/roadmap` - Items del roadmap
- POST `/api/products/:id/roadmap` - Agregar item
- PUT `/api/products/:productId/roadmap/:itemId` - Actualizar item
- DELETE `/api/products/:productId/roadmap/:itemId` - Eliminar item

### Módulo: CLIENTS (`src/modules/clients/`)

**Endpoints requeridos:**
- GET `/api/clients` - Lista
- GET `/api/clients/:id` - Detalle
- POST `/api/clients` - Crear
- PUT `/api/clients/:id` - Actualizar
- DELETE `/api/clients/:id` - Eliminar
- GET `/api/clients/:id/requests` - Requests del cliente
- PATCH `/api/clients/:id/health-score` - Actualizar health score

### Módulo: METRICS (`src/modules/metrics/`)

**Endpoints requeridos:**
- GET `/api/metrics/overview` - Dashboard principal
- GET `/api/metrics/weekly` - Métricas semanales
- POST `/api/metrics/weekly` - Crear métrica semanal
- GET `/api/metrics/capacity` - Capacidad del equipo
- GET `/api/metrics/requests-funnel` - Funnel de requests
- GET `/api/metrics/product-vs-custom` - Ratio producto/custom
- GET `/api/metrics/team-velocity` - Velocidad del equipo
- POST `/api/metrics/generate-insights` - Generar insights con IA

**Funcionalidades:**
- Cálculos automáticos de ratios
- Agregación de datos por semana/mes
- Insights generados por IA

### Módulo: AI (`src/modules/ai/`)

**Endpoints requeridos:**
- POST `/api/ai/completion` - Generar completion (OpenAI o Claude)
- POST `/api/ai/insights` - Generar insights de analytics
- POST `/api/ai/analyze-similarity` - Analizar similitud de requests

**Funcionalidades:**
- Soporte para OpenAI y Claude (configurable)
- Usar servicio de IA de `src/utils/ai.service.ts`

## 2. APP.TS Y SERVER.TS

**`src/app.ts`:**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import { errorHandler } from './middlewares/error.middleware';
import logger from './config/logger';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import requestsRoutes from './modules/requests/requests.routes';
import assignmentsRoutes from './modules/assignments/assignments.routes';
import okrsRoutes from './modules/okrs/okrs.routes';
import productsRoutes from './modules/products/products.routes';
import clientsRoutes from './modules/clients/clients.routes';
import metricsRoutes from './modules/metrics/metrics.routes';
import aiRoutes from './modules/ai/ai.routes';

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
const API_PREFIX = '/api';
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, usersRoutes);
app.use(`${API_PREFIX}/requests`, requestsRoutes);
app.use(`${API_PREFIX}/assignments`, assignmentsRoutes);
app.use(`${API_PREFIX}/okrs`, okrsRoutes);
app.use(`${API_PREFIX}/products`, productsRoutes);
app.use(`${API_PREFIX}/clients`, clientsRoutes);
app.use(`${API_PREFIX}/metrics`, metricsRoutes);
app.use(`${API_PREFIX}/ai`, aiRoutes);

// Error handling
app.use(errorHandler);

export default app;
```

**`src/server.ts`:**
```typescript
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { config } from './config/env';
import logger from './config/logger';
import prisma from './config/database';
import { verifyAccessToken } from './utils/jwt.util';

const server = http.createServer(app);

// Socket.io setup
const io = new SocketIOServer(server, {
  cors: {
    origin: config.cors.allowedOrigins,
    credentials: true,
  },
});

// Socket.io authentication
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (token) {
      const payload = verifyAccessToken(token);
      socket.data.user = payload;
    }
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  // Join request room
  socket.on('join_request', ({ requestId }) => {
    socket.join(`request:${requestId}`);
    logger.debug(`Socket ${socket.id} joined room request:${requestId}`);
  });

  // Leave request room
  socket.on('leave_request', ({ requestId }) => {
    socket.leave(`request:${requestId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Export io for use in other modules
export { io };

// Start server
const PORT = config.app.port;

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📝 API: http://localhost:${PORT}/api`);
  logger.info(`💚 Health: http://localhost:${PORT}/health`);
  logger.info(`🔌 Socket.io ready`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing server...');
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Server closed');
    process.exit(0);
  });
});
```

## 3. FUNCIONALIDADES ESPECIALES

### Socket.io Events
Emitir estos eventos desde los servicios:

```typescript
// En request.service.ts
import { io } from '../../server';

// Cuando se crea un request
io.emit('request:created', requestData);

// Cuando se actualiza
io.to(`request:${requestId}`).emit('request:updated', requestData);

// Cuando cambia status
io.to(`request:${requestId}`).emit('request:status_changed', { 
  requestId, 
  oldStatus, 
  newStatus 
});
```

### Email Notifications
Usar el servicio de email de `src/utils/email.service.ts`:

```typescript
import { sendRequestStatusNotification } from '../../utils/email.service';

// Cuando cambia status
await sendRequestStatusNotification(request, assignedUsers, changedBy);
```

### AI Integration
Usar el servicio de IA de `src/utils/ai.service.ts`:

```typescript
import { generateAnalyticsInsights } from '../../utils/ai.service';

const insights = await generateAnalyticsInsights(metricsData);
```

## 4. VALIDACIONES CON ZOD

Crear schemas de validación en cada módulo:

```typescript
// Example: requests.types.ts
import { z } from 'zod';

export const createRequestSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  type: z.enum(['PRODUCT_FEATURE', 'CUSTOMIZATION', 'BUG', 'SUPPORT', 'INFRASTRUCTURE']),
  priority: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  estimatedHours: z.number().positive(),
  product: z.enum(['MAWI', 'OMNILEADS', 'NEW_PRODUCT_1', 'NEW_PRODUCT_2', 'NEW_PRODUCT_3', 'INTERNAL']).optional(),
  tags: z.array(z.string()).optional(),
  assignedUserIds: z.array(z.string()).optional(),
});
```

## 5. RESPONSE FORMAT

Todos los endpoints deben usar las utilidades de respuesta:

```typescript
import { successResponse, errorResponse, paginatedResponse } from '../../utils/response.util';

// Success
return successResponse(res, data, 'Operation successful', 200);

// Error
return errorResponse(res, 'Error message', 400);

// Paginated
return paginatedResponse(res, items, page, limit, total);
```

## 6. AUTENTICACIÓN Y AUTORIZACIÓN

Proteger rutas con middlewares:

```typescript
import { authenticate, authorize } from '../../middlewares/auth.middleware';

// Protected route
router.get('/', authenticate, controller.getAll);

// Role-based
router.delete('/:id', authenticate, authorize(['CEO', 'DEV_DIRECTOR']), controller.delete);
```

---

**GENERA TODO ESTE CÓDIGO AHORA. Usa las mejores prácticas de TypeScript, Express y Prisma. Incluye manejo de errores completo y validación en todos los endpoints.**

**IMPORTANTE:**
- Usa Prisma para todas las operaciones de base de datos
- Implementa paginación en endpoints de listado
- Emite eventos de Socket.io para real-time
- Envía emails en cambios de estado y asignaciones
- Valida todos los inputs con Zod
- Usa transacciones de Prisma donde sea necesario
- Logging completo con Winston

**EMPEZAR A GENERAR CÓDIGO AHORA.**
