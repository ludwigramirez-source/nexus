# IPTEGRA NEXUS - Resumen del Proyecto

**Repositorio GitHub:** https://github.com/ludwigramirez-source/nexus.git

**Fecha de última actualización:** 14 de Enero 2026
**Estado:** ✅ Sistema de Roles + Activity Logs + Tema Dark/Light + Dashboard + UI/UX Unificada implementados

---

## 📋 DESCRIPCIÓN DEL PROYECTO

**IPTEGRA Nexus** es una plataforma de gestión empresarial integral que incluye:

- 🔐 **Autenticación y Control de Acceso**
- 📊 **Panel Ejecutivo** (Executive Dashboard)
- 📥 **Centro de Gestión de Solicitudes** (Request Management)
- 📅 **Planificación de Capacidad** (Capacity Planning)
- 🎯 **Gestión de OKRs y Roadmap**
- 💼 **Portafolio de Productos y Clientes**
- 👥 **Administración de Equipos y Sistema**
- 📈 **Dashboard de Analíticas e Insights**

---

## 🏗️ ARQUITECTURA

### **Stack Tecnológico**

**FRONTEND** (Puerto 4028)
- ⚛️ React 18.2.0
- ⚡ Vite 5.0.0
- 🎨 TailwindCSS 3.4.6
- 🔌 Socket.io Client 4.8.3
- 📡 Axios 1.13.2
- 🎯 React Router DOM 6.0.2
- 🎨 Lucide React 0.263.1 (iconos)
- 🎭 Framer Motion 10.16.4

**BACKEND** (Puerto 3001)
- 🟢 Node.js + Express
- 📘 TypeScript
- 🗄️ PostgreSQL (Puerto 5435)
- 🔷 Prisma ORM
- 🔌 Socket.io Server
- 🔑 JWT Authentication
- 🤖 OpenAI + Anthropic Claude
- 📧 Nodemailer (Email)

---

## 📁 ESTRUCTURA DE CARPETAS CLAVE

```
iptegra-nexus-full/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Autenticación (login, register, refresh)
│   │   │   ├── users/         # Gestión de usuarios
│   │   │   ├── requests/      # Solicitudes
│   │   │   ├── assignments/   # Asignaciones
│   │   │   ├── okrs/          # OKRs
│   │   │   ├── products/      # Productos
│   │   │   ├── clients/       # Clientes
│   │   │   ├── metrics/       # Métricas y analytics
│   │   │   └── notifications/ # Notificaciones
│   │   ├── middlewares/       # Auth, error handling, etc.
│   │   ├── utils/             # Helpers
│   │   └── server.ts          # Punto de entrada
│   ├── prisma/
│   │   ├── schema.prisma      # Modelos de base de datos
│   │   └── seed.ts            # Datos iniciales
│   └── .env                   # Variables de entorno
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── authentication-and-access-control/
    │   │   ├── executive-dashboard/
    │   │   ├── request-management-center/
    │   │   ├── capacity-planning-workspace/
    │   │   ├── ok-rs-and-roadmap-management/
    │   │   ├── products-and-client-portfolio/
    │   │   ├── team-and-system-administration/
    │   │   └── analytics-and-insights-dashboard/
    │   ├── services/
    │   │   ├── api.js             # Cliente Axios con interceptors
    │   │   ├── authService.js     # Login, logout, refresh
    │   │   ├── socketService.js   # Socket.io client
    │   │   ├── requestService.js  # CRUD de requests
    │   │   ├── userService.js     # CRUD de usuarios
    │   │   ├── metricsService.js  # Métricas
    │   │   └── ...otros servicios
    │   ├── components/
    │   │   ├── ui/                # Componentes reutilizables
    │   │   ├── AppIcon.jsx        # Sistema de iconos
    │   │   └── iconMap.js         # Mapa de iconos de lucide-react
    │   └── App.jsx                # Routing principal
    └── .env                       # Variables de entorno
```

---

## 🔑 CREDENCIALES Y ACCESO

### **Base de Datos PostgreSQL**
```
Host: localhost
Puerto: 5435
Base de datos: nexus_db
Usuario: nexus
Password: nexus_password
```

### **Usuarios del Sistema**

| Email | Password | Rol | Descripción |
|-------|----------|-----|-------------|
| admin@iptegra.com | admin123 | CEO | Administrador principal |
| dev1@iptegra.com | dev123 | DEV_DIRECTOR | Director de Desarrollo |
| dev2@iptegra.com | dev123 | FULLSTACK | Desarrollador Full Stack |
| dev3@iptegra.com | dev123 | BACKEND | Desarrollador Backend |
| dev4@iptegra.com | dev123 | FRONTEND | Desarrollador Frontend |

### **URLs de Acceso**
```
Frontend: http://localhost:4028
Backend API: http://localhost:3001/api
Backend Health: http://localhost:3001/health
```

### **Acceso a Nuevas Páginas** 🆕
```
Dashboard Ejecutivo:        http://localhost:4028/executive-dashboard
Administración de Equipo:   http://localhost:4028/team-and-system-administration
Registro de Actividades:    http://localhost:4028/activity-logs
Gestión de Solicitudes:     http://localhost:4028/request-management-center
Planificación Capacidad:    http://localhost:4028/capacity-planning-workspace
OKRs y Roadmap:            http://localhost:4028/ok-rs-and-roadmap-management
Productos y Clientes:       http://localhost:4028/products-and-client-portfolio
Analytics e Insights:       http://localhost:4028/analytics-and-insights-dashboard
```

---

## 🚀 CÓMO LEVANTAR EL PROYECTO

### **1. Base de Datos (PostgreSQL)**
```bash
# Asegurarse de que PostgreSQL está corriendo en puerto 5435
# O levantar con Docker:
docker run --name nexus-postgres -e POSTGRES_DB=nexus_db -e POSTGRES_USER=nexus -e POSTGRES_PASSWORD=nexus_password -p 5435:5432 -d postgres
```

### **2. Backend**
```bash
cd backend

# Instalar dependencias (si es necesario)
npm install

# Ejecutar migraciones de Prisma (incluye roles y activity_logs)
npx prisma migrate dev

# Seed de datos (crear usuarios iniciales + roles del sistema)
npx prisma db seed

# Levantar servidor de desarrollo
npm run dev

# ✅ Backend corriendo en http://localhost:3001

# NOTA: Si hay problemas con migraciones, resetear DB:
# npx prisma migrate reset --force
```

### **3. Frontend**
```bash
cd frontend

# Instalar dependencias (si es necesario)
npm install

# Levantar servidor de desarrollo
npm start

# ✅ Frontend corriendo en http://localhost:4028
```

### **4. Verificar que todo funciona**
1. Ir a http://localhost:4028
2. Hacer login con `admin@iptegra.com` / `admin123`
3. Deberías ver el dashboard ejecutivo

---

## 🔌 ENDPOINTS PRINCIPALES DEL BACKEND

### **Autenticación** (`/api/auth`)
```
POST   /api/auth/register        - Registrar usuario
POST   /api/auth/login           - Iniciar sesión
POST   /api/auth/logout          - Cerrar sesión
POST   /api/auth/refresh         - Refrescar access token
GET    /api/auth/me              - Obtener usuario actual
```

### **Usuarios** (`/api/users`)
```
GET    /api/users                - Listar usuarios
GET    /api/users/:id            - Obtener usuario por ID
POST   /api/users                - Crear usuario
PUT    /api/users/:id            - Actualizar usuario
DELETE /api/users/:id            - Eliminar usuario
PATCH  /api/users/:id/activate   - Activar usuario
PATCH  /api/users/:id/deactivate - Desactivar usuario
```

### **Solicitudes** (`/api/requests`)
```
GET    /api/requests             - Listar solicitudes
POST   /api/requests             - Crear solicitud
GET    /api/requests/:id         - Obtener solicitud
PUT    /api/requests/:id         - Actualizar solicitud
DELETE /api/requests/:id         - Eliminar solicitud
PATCH  /api/requests/:id/status  - Cambiar estado
PATCH  /api/requests/:id/assign  - Asignar usuarios
GET    /api/requests/:id/activities - Obtener actividades
GET    /api/requests/:id/comments   - Obtener comentarios
POST   /api/requests/:id/comments   - Agregar comentario
```

### **Métricas** (`/api/metrics`)
```
GET    /api/metrics/overview          - Métricas generales
GET    /api/metrics/weekly            - Métricas semanales
POST   /api/metrics/weekly            - Crear métrica semanal
GET    /api/metrics/capacity          - Métricas de capacidad
GET    /api/metrics/requests-funnel   - Funnel de solicitudes
GET    /api/metrics/product-vs-custom - Ratio producto vs custom
GET    /api/metrics/team-velocity     - Velocidad del equipo
POST   /api/metrics/generate-insights - Generar insights con IA
```

### **Productos** (`/api/products`)
```
GET    /api/products             - Listar productos
POST   /api/products             - Crear producto
GET    /api/products/:id         - Obtener producto
PUT    /api/products/:id         - Actualizar producto
DELETE /api/products/:id         - Eliminar producto
```

### **Clientes** (`/api/clients`)
```
GET    /api/clients              - Listar clientes
POST   /api/clients              - Crear cliente
GET    /api/clients/:id          - Obtener cliente
PUT    /api/clients/:id          - Actualizar cliente
DELETE /api/clients/:id          - Eliminar cliente
PATCH  /api/clients/:id/health-score - Actualizar health score
```

### **OKRs** (`/api/okrs`)
```
GET    /api/okrs                 - Listar OKRs
POST   /api/okrs                 - Crear OKR
GET    /api/okrs/:id             - Obtener OKR
PUT    /api/okrs/:id             - Actualizar OKR
DELETE /api/okrs/:id             - Eliminar OKR
POST   /api/okrs/:id/key-results - Agregar key result
PUT    /api/okrs/:id/key-results/:krId - Actualizar key result
```

### **Roles** (`/api/roles`) 🆕
```
GET    /api/roles                - Listar roles
GET    /api/roles/:id            - Obtener rol por ID
POST   /api/roles                - Crear rol
PUT    /api/roles/:id            - Actualizar rol
DELETE /api/roles/:id            - Eliminar rol
GET    /api/roles/permissions    - Obtener estructura de permisos disponibles
```

### **Activity Logs** (`/api/activity-logs`) 🆕
```
GET    /api/activity-logs        - Listar logs con filtros y paginación
                                  Query params: userId, action, entity, startDate, endDate, search, page, limit
GET    /api/activity-logs/recent - Obtener logs recientes (últimos 5-10)
                                  Query params: limit (default: 10)
GET    /api/activity-logs/export - Exportar logs a CSV
                                  Query params: mismos filtros que GET principal
```

### **Dashboard** (`/api/dashboard`) 🆕
```
GET    /api/dashboard/metrics                    - Obtener métricas del dashboard
                                                   (productos, servicios, facturación, MRR, IVA)
GET    /api/dashboard/products-with-clients      - Listar productos con sus clientes y métricas
GET    /api/dashboard/products/:productId/clients - Obtener clientes de un producto específico
```

---

## 🔥 PROBLEMAS RESUELTOS EN ESTA SESIÓN

### **1. Error SVG de Hexagon en lucide-react** ✅
- **Problema:** `Error: <path> attribute d: Expected arc flag ('0' or '1')`
- **Causa:** Bug en el ícono Hexagon de lucide-react
- **Solución:**
  - Downgrade a lucide-react v0.263.1
  - Crear `iconMap.js` con imports selectivos (sin Hexagon)
  - Reescribir LoginForm con SVG inline en lugar de componentes de lucide-react

### **2. Autenticación no funcionaba** ✅
- **Problema:** Login generaba error 500 por `Unique constraint failed on refresh_token`
- **Causa:** Intento de crear múltiples sesiones con mismo refresh token
- **Solución:** Agregar `deleteMany` antes de crear sesión nueva en `auth.service.ts`

### **3. Estructura de respuesta incorrecta** ✅
- **Problema:** LoginForm esperaba `response.success` pero authService devolvía `{user, tokens}`
- **Solución:** Actualizar LoginForm para manejar estructura correcta

### **4. Endpoints de métricas incorrectos** ✅
- **Problema:** Frontend llamaba `/metrics/dashboard` pero backend tiene `/metrics/overview`
- **Solución:** Actualizar `metricsService.js` con endpoints correctos del backend

### **5. Iconos faltantes** ✅
- **Problema:** `Icon "BarChart3" not found in iconMap`
- **Solución:** Agregar iconos faltantes (BarChart3, Lock, Globe, Laptop, etc.) a `iconMap.js`

---

## 🆕 NUEVAS FUNCIONALIDADES IMPLEMENTADAS (8 Enero 2026)

### **1. Sistema de Roles Dinámicos** ✅
- **Descripción:** Sistema completo de gestión de roles con permisos granulares
- **Backend:**
  - Tabla `roles` con nombre, descripción, permisos JSON
  - Endpoints CRUD para roles: `/api/roles/*`
  - Middleware de permisos: `permissions.middleware.ts`
  - Validación de permisos por módulo y acción
  - Roles predefinidos: CEO, DEV_DIRECTOR, FULLSTACK, BACKEND, FRONTEND
- **Frontend:**
  - Página de gestión de roles en Team & System Administration
  - Componente `RoleManagementTable.jsx` con filtros y búsqueda
  - Modal de edición de roles con checkboxes de permisos por módulo
- **Archivos clave:**
  - `backend/src/modules/roles/` (service, controller, types, validators)
  - `backend/src/middlewares/permissions.middleware.ts`
  - `backend/prisma/migrations/*_add_roles_system/`
  - `frontend/src/services/rolesService.js`

### **2. Sistema de Activity Logs (Auditoría)** ✅
- **Descripción:** Registro completo de todas las acciones de usuarios en el sistema
- **Backend:**
  - Tabla `activity_logs` con campos: userId, userName, userEmail, action, entity, entityId, description, metadata, ipAddress, userAgent
  - Servicio `ActivityLogsService` para crear y consultar logs
  - Endpoints: `/api/activity-logs/*` con filtros avanzados
  - Captura automática de IP y User Agent en todos los endpoints
  - Exportación a CSV de logs filtrados
- **Frontend:**
  - Página completa `/activity-logs` con filtros avanzados
  - Componente `ActivityLogPanel.jsx` (panel lateral con últimas 5 actividades)
  - Filtros por: usuario, acción, entidad, rango de fechas, búsqueda
  - Paginación y diseño responsive
  - Auto-refresh cada 30 segundos en panel lateral
- **Acciones registradas:**
  - LOGIN, LOGOUT, REGISTER (autenticación)
  - CREATE, UPDATE, DELETE (CRUD en cualquier entidad)
  - STATUS_CHANGE (cambios de estado de usuarios, requests, etc.)
- **Archivos clave:**
  - `backend/src/modules/activity-logs/` (service, controller, types, validators)
  - `backend/prisma/migrations/*_add_activity_logs/`
  - `frontend/src/services/activityLogsService.js`
  - `frontend/src/pages/activity-logs/index.jsx`

### **3. Captura de IP y User Agent para Auditoría** ✅
- **Problema:** Los logs de actividad no capturaban IP ni User Agent
- **Solución implementada:**
  - Configuración de `trust proxy` en Express (`app.ts`)
  - Utilidad `request.util.ts` con detección robusta de IP:
    - X-Forwarded-For (proxies y load balancers)
    - X-Real-IP (Nginx)
    - CF-Connecting-IP (Cloudflare)
    - req.ip (Express default)
    - socket.remoteAddress (fallback)
  - Función `getUserAgent()` para capturar navegador/device
  - Función `getSessionData()` que retorna `{ ipAddress, userAgent }`
  - Actualización de todos los controllers para capturar session data:
    - `auth.controller.ts` (login, register, logout)
    - `users.controller.ts` (update, updateStatus, delete)
  - Services actualizados para recibir y pasar sessionData a ActivityLogsService
- **Resultado:** Auditoría completa con IP y User Agent en cada acción
- **Archivos clave:**
  - `backend/src/utils/request.util.ts` (NEW)
  - `backend/src/app.ts` (trust proxy)
  - `backend/src/modules/auth/auth.controller.ts`
  - `backend/src/modules/users/users.controller.ts`
  - `backend/src/modules/users/users.service.ts`

### **4. Correcciones de UI/UX** ✅

#### **a) Fix de layout del sidebar**
- **Problema:** Contenido de activity-logs aparecía detrás del sidebar
- **Solución:**
  - Sidebar con `fixed` positioning consistente
  - Páginas usan patrón `lg:ml-60` (expandido) y `lg:ml-20` (colapsado)
  - Header sticky con `z-30` y sidebar con `z-40`

#### **b) Eliminación de menú "Autenticación"**
- **Problema:** Menú "Autenticación" cerraba la página sin necesidad
- **Solución:** Removido del `navigationItems` en `Sidebar.jsx`

#### **c) Fix de props de Button component**
- **Problema:** Warning de React por prop `leftIcon` no reconocida
- **Solución:** Cambio de `leftIcon={<Icon />}` a `iconName="X" iconPosition="left"`

#### **d) Reemplazo de avatares por iconos genéricos**
- **Problema:** Fotos de usuario inconsistentes entre vistas
- **Solución:**
  - Reemplazo de `<Image>` por iconos genéricos en:
    - `UserManagementTable.jsx`
    - `activity-logs/index.jsx`
    - `ActivityLogPanel.jsx`
  - Diseño consistente: círculo con `bg-primary/10` y `<Icon name="User" />`

---

## ⚙️ CONFIGURACIÓN IMPORTANTE

### **Backend `.env`**
```env
NODE_ENV=development
PORT=3001
API_PREFIX=/api

DATABASE_URL=postgresql://nexus:nexus_password@localhost:5435/nexus_db?schema=public

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:4028
ALLOWED_ORIGINS=http://localhost:4028,http://localhost:5173,http://localhost:3000

AI_PROVIDER=claude
ANTHROPIC_API_KEY=your-anthropic-api-key-here
ANTHROPIC_MODEL=claude-sonnet-4-20250514

ENABLE_EMAIL_NOTIFICATIONS=true
NOTIFICATION_ADMIN_EMAILS=lramirez@mawi.chat
```

### **Frontend `.env`**
```env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

---

## 🎯 FLUJO DE AUTENTICACIÓN

1. **Login:**
   - Usuario ingresa email/password en `LoginForm.jsx`
   - Se llama `authService.login(email, password)`
   - Backend verifica credenciales con bcrypt
   - Genera `accessToken` (15 min) y `refreshToken` (7 días)
   - Guarda refresh token en tabla `sessions`
   - Frontend guarda tokens en localStorage

2. **Requests con Auth:**
   - `api.js` tiene interceptor que agrega `Authorization: Bearer <token>` en cada request
   - Si respuesta es 401, automáticamente intenta refresh
   - Si refresh falla, redirige a login

3. **Logout:**
   - Llama `authService.logout()`
   - Backend invalida sesión
   - Frontend borra tokens de localStorage

---

## 📊 MODELOS DE BASE DE DATOS (Prisma)

### **Principales Tablas**

**users**
- id, email, password, name, role, avatar, capacity, skills, status, created_at, updated_at

**sessions**
- id, user_id, refresh_token, expires_at, created_at

**roles** 🆕
- id, name, description, permissions (JSON), is_system, created_at, updated_at

**activity_logs** 🆕
- id, user_id, user_name, user_email, action, entity, entity_id, description, metadata (JSON), ip_address, user_agent, created_at

**requests**
- id, title, description, type, priority, status, product_id, client_id, estimated_hours, actual_hours, created_by, created_at, updated_at

**products**
- id, name, description, status, owner_id, created_at, updated_at

**clients**
- id, name, contact_email, contact_phone, tier, health_score, mrr, created_at, updated_at

**okrs**
- id, title, description, type, owner_id, start_date, end_date, progress, status, created_at, updated_at

**assignments**
- id, request_id, user_id, assigned_at

**weekly_metrics**
- id, week_start, week_end, hours_available, hours_used, utilization_rate, created_at

---

## 🔄 SOCKET.IO - Eventos en Tiempo Real

**Frontend conecta:**
```javascript
socketService.connect(); // Se conecta automáticamente con auth token
```

**Eventos que escucha el frontend:**
```javascript
socketService.on('request:created', handleNewRequest);
socketService.on('request:updated', handleRequestUpdate);
socketService.on('request:deleted', handleRequestDelete);
socketService.on('user:created', handleNewUser);
socketService.on('user:updated', handleUserUpdate);
socketService.on('metrics:updated', handleMetricsUpdate);
```

**Backend emite eventos cuando:**
- Se crea/actualiza/elimina una solicitud
- Se crea/actualiza/elimina un usuario
- Se actualizan métricas
- Hay notificaciones nuevas

---

## 📝 NOTAS IMPORTANTES

### **Convenciones de Código**

1. **Backend:**
   - Todos los controllers retornan: `{ success: boolean, message: string, data: any }`
   - Errores se manejan con middleware `errorHandler`
   - Logs con Winston (formato JSON)
   - Validación con class-validator

2. **Frontend:**
   - Servicios en `src/services/`
   - Componentes UI reutilizables en `src/components/ui/`
   - Páginas completas en `src/pages/`
   - Iconos SIEMPRE a través de `<Icon name="..." />`

3. **Git Workflow:**
   - No hay repositorio git inicializado aún
   - Considerar crear .gitignore para node_modules, .env, dist/

### **Próximos Pasos Sugeridos**

1. ✅ **Completado:** Login funcional
2. ✅ **Completado:** Sistema de roles dinámicos
3. ✅ **Completado:** Sistema de activity logs con auditoría
4. ⏳ **Pendiente:** Implementar dashboards con datos reales del backend
5. ⏳ **Pendiente:** CRUD completo de solicitudes con interfaz mejorada
6. ⏳ **Pendiente:** Sistema de notificaciones en tiempo real (WebSocket)
7. ⏳ **Pendiente:** Integración completa de IA para insights y análisis
8. ⏳ **Pendiente:** Gestión de OKRs con interfaz completa
9. ⏳ **Pendiente:** Planificación de capacidad visual (gráficos interactivos)
10. ⏳ **Pendiente:** Tests (Jest para backend, React Testing Library para frontend)
11. ⏳ **Pendiente:** Deployment (Docker, Railway, Vercel, etc.)

---

## 🐛 DEBUGGING TIPS

### **Backend no arranca:**
```bash
# Verificar que PostgreSQL está corriendo
psql -U nexus -d nexus_db -h localhost -p 5435

# Verificar puerto 3001 no está en uso
netstat -ano | findstr :3001

# Ver logs en tiempo real
cd backend && npm run dev
```

### **Frontend no conecta al backend:**
```bash
# Verificar CORS en backend/.env
CORS_ORIGIN=http://localhost:4028

# Verificar que axios apunta al backend correcto
# frontend/src/services/api.js debe tener baseURL: 'http://localhost:3001/api'

# Abrir DevTools (F12) > Network > Ver requests fallidos
```

### **Login falla:**
```bash
# Verificar usuarios en BD
cd backend
node check-users.js

# Re-seed si es necesario
npx prisma db seed

# Ver logs del backend al intentar login
```

---

## 📚 RECURSOS Y DOCUMENTACIÓN

- **Prisma Docs:** https://www.prisma.io/docs
- **Socket.io Docs:** https://socket.io/docs/v4/
- **TailwindCSS:** https://tailwindcss.com/docs
- **Lucide Icons:** https://lucide.dev/icons/
- **React Router:** https://reactrouter.com/en/main
- **Axios:** https://axios-http.com/docs/intro

---

## ✨ ESTADO ACTUAL DEL PROYECTO

| Módulo | Estado | Comentarios |
|--------|--------|-------------|
| 🔐 Autenticación | ✅ 100% | Login, refresh, logout funcionando + Menú usuario funcional |
| 👥 Gestión de Usuarios | ✅ 100% | Backend completo, frontend completo, toggle switch, UI unificada |
| 🛡️ Sistema de Roles | ✅ 100% | Backend + Frontend completamente funcional |
| 📝 Activity Logs | ✅ 100% | Auditoría completa con IP/UA, Actor/Target, Permisos por Rol, CSV, UI unificada |
| 🎨 Sistema de Temas | ✅ 100% | Dark/Light mode con persistencia y detección de sistema |
| 🎨 UI/UX Unificada | ✅ 100% | Toggle switches, registro de actividades, títulos, grid system 25% consistente |
| 📥 Solicitudes | ✅ 80% | Backend completo, frontend parcial |
| 📊 Dashboard Productos/Clientes | ✅ 100% | 8 métricas, lista productos, tabla clientes, filtros, Excel export |
| 📅 Capacidad | ⏳ 50% | Backend básico, frontend con datos mock |
| 🎯 OKRs | ⏳ 50% | Backend completo, frontend con datos mock |
| 💼 Productos/Clientes | ✅ 100% | CRUD completo, activity logs, Excel export, títulos principales, UI unificada |
| 🔔 Notificaciones | ⏳ 20% | Backend básico, sin integración frontend |
| 🤖 IA (Insights) | ⏳ 40% | Endpoints creados, sin uso en frontend |

---

## 🎉 CONCLUSIÓN

**El proyecto IPTEGRA Nexus está en un estado funcional avanzado:**
- ✅ Arquitectura backend/frontend establecida y estable
- ✅ Base de datos con modelos completos
- ✅ Autenticación JWT + refresh tokens + logout funcional
- ✅ Socket.io para tiempo real
- ✅ Sistema de servicios en frontend
- ✅ Login completamente funcional
- ✅ **Sistema de roles dinámicos con permisos granulares**
- ✅ **Activity logs completos con auditoría IP/User Agent + Actor/Target**
- ✅ **Permisos por rol en visualización de logs (admin vs usuarios)**
- ✅ **Sistema de temas Dark/Light Mode completamente funcional**
- ✅ **Menú de usuario conectado a datos reales**
- ✅ **Interfaz de administración de equipo y sistema**
- ✅ **UI/UX completamente unificada entre módulos**
- ✅ **Toggle switches consistentes para activar/desactivar**
- ✅ **Registro de actividades con diseño uniforme (5 items, filtros, 25% ancho)**
- ✅ **Títulos principales y estructura visual consistente**
- ✅ **Sistema de grid responsive con proporciones optimizadas**

**Listo para continuar desarrollo de funcionalidades específicas.**

---

## 🆕 NUEVAS FUNCIONALIDADES IMPLEMENTADAS (13 Enero 2026 - Tarde)

### **1. Dashboard de Productos y Clientes** ✅
- **Descripción:** Dashboard ejecutivo completo para visualizar métricas de productos, servicios y clientes
- **Backend:**
  - **dashboard.service.ts:**
    - `getMetrics()`: Calcula 8 métricas principales del negocio
      - Total de productos (PRODUCT type)
      - Total de servicios (SERVICE type)
      - Facturación mensual de productos
      - Facturación mensual de servicios
      - MRR recurrente (MONTHLY, QUARTERLY, SEMIANNUAL, ANNUAL)
      - MRR de pagos únicos (ONE_TIME)
      - Total de IVA a facturar
      - Facturación mensual total
    - `getProductsWithClients()`: Lista productos con array de clientes usando cada producto
      - Incluye cálculo de MRR por producto
      - Cuenta de clientes por producto
      - Metadata de customizations y debt
    - `getClientsByProduct(productId)`: Retorna producto específico con todos sus clientes
      - Incluye información detallada del producto
      - Lista completa de clientes con health score, tier, MRR
  - **dashboard.controller.ts:** Controlador con 3 endpoints
  - **dashboard.routes.ts:** Rutas protegidas con autenticación
  - **app.ts:** Registro de rutas en `/api/dashboard`
- **Frontend:**
  - **dashboardService.js:** Servicio para consumir API del dashboard
  - **DashboardMetricsCards.jsx:**
    - 8 tarjetas métricas con iconos y colores diferenciados
    - Formato de moneda con Intl.NumberFormat (español)
    - Loading skeleton durante carga
    - Grid responsive: 1 col mobile, 2 cols tablet, 4 cols desktop
  - **ProductCardList.jsx:**
    - Tarjetas de producto con métricas clave:
      - MRR con icono DollarSign
      - Cantidad de clientes con icono Users
      - Personalizaciones con icono Code
      - Deuda técnica con icono AlertTriangle (si >0)
      - Growth percentage con icono TrendingUp (si >0)
    - Indicador visual de producto seleccionado (border primary)
    - Botón "Ver Clientes" en cada tarjeta
    - Estado vacío con mensaje e icono
  - **ClientsByProductTable.jsx:**
    - Header con información del producto seleccionado:
      - Nombre, descripción, tipo
      - Métricas: MRR total, clientes, precio, tipo
    - Tabla de clientes con columnas:
      - Cliente (nombre con icono Building2)
      - Salud (score con badge: Excelente/Bueno/Regular/En Riesgo)
      - Nivel (tier badge: Enterprise/Professional/Básico)
      - MRR (formato moneda)
      - Customizations (badge con número)
      - Última actualización (formato fecha español)
    - Footer con total de facturación del producto
    - Estado vacío inicial: "Selecciona un producto" con icono Target
    - Estado sin clientes: "No hay clientes asociados" con icono Users
  - **index.jsx (Integración):**
    - Nuevo tab "Dashboard" en navegación con icono TrendingUp
    - Estados: dashboardMetrics, dashboardProducts, selectedDashboardProduct, selectedProductClients
    - useEffect para cargar datos cuando activeTab === 'dashboard'
    - handleProductSelect: carga clientes al seleccionar producto
    - Layout grid 2 columnas: productos izquierda, clientes derecha
    - Activity sidebar se oculta automáticamente en dashboard para aprovechar espacio
- **Archivos creados:**
  - `backend/src/modules/dashboard/dashboard.service.ts` (NEW)
  - `backend/src/modules/dashboard/dashboard.controller.ts` (NEW)
  - `backend/src/modules/dashboard/dashboard.routes.ts` (NEW)
  - `backend/src/modules/dashboard/dashboard.types.ts` (NEW)
  - `frontend/src/services/dashboardService.js` (NEW)
  - `frontend/src/pages/products-and-client-portfolio/components/DashboardMetricsCards.jsx` (NEW)
  - `frontend/src/pages/products-and-client-portfolio/components/ProductCardList.jsx` (NEW)
  - `frontend/src/pages/products-and-client-portfolio/components/ClientsByProductTable.jsx` (NEW)
- **Archivos modificados:**
  - `backend/src/app.ts` (registro de rutas)
  - `frontend/src/pages/products-and-client-portfolio/index.jsx` (integración completa)

### **2. Mejoras en Gestión de Clientes** ✅
- **Selección de Productos en ClientEditModal:**
  - Checkbox list de todos los productos disponibles
  - Muestra nombre y precio de cada producto
  - Cálculo automático de MRR basado en productos seleccionados
  - Visual display del MRR calculado con formato de moneda
  - Auto-selección de currency basada en primer producto
- **Activity Logs extendido:**
  - Agregado campo `city` a detección de cambios
  - Agregado campo `status` a detección de cambios
  - Registro completo de: city, nit, tier, status, mrr, currency, healthScore, notes, products
- **Excel Export:**
  - Incluye campos city y status en exportación
- **Archivos modificados:**
  - `backend/src/modules/clients/clients.service.ts`
  - `backend/src/modules/clients/clients.types.ts`
  - `frontend/src/pages/products-and-client-portfolio/components/ClientEditModal.jsx`

### **3. Mejoras en Gestión de Productos** ✅
- **Fix de Edición Completa:**
  - Campo `recurrence` ahora visible para todos los tipos (no solo servicios)
  - Método `update` en products.service.ts ahora actualiza TODOS los campos:
    - type, description, price, currency, hasVAT, vatRate, recurrence
    - repositoryUrl, productionUrl, stagingUrl, status
  - Detección de cambios para todos los campos en activity logs
  - Cada cambio registrado con valor anterior y nuevo
- **UI Improvements:**
  - ProductFilterToolbar rediseñado a grid 3 columnas
  - Todos los filtros alineados al mismo nivel (search, type, status)
  - Badge mostrando cantidad de filtros activos
  - Diseño responsive y consistente
- **Excel Export:**
  - Función completa `handleExportProductsToExcel`
  - Headers en español: Nombre, Tipo, Descripción, Precio, Moneda, Recurrencia, IVA, etc.
  - Formato de recurrencia traducido (MONTHLY → Mensual, etc.)
  - Columnas con ancho apropiado
  - Botón "Exportar" junto a "Nuevo" en toolbar
- **Archivos modificados:**
  - `backend/src/modules/products/products.service.ts`
  - `frontend/src/pages/products-and-client-portfolio/components/ProductEditModal.jsx`
  - `frontend/src/pages/products-and-client-portfolio/components/ProductFilterToolbar.jsx`
  - `frontend/src/pages/products-and-client-portfolio/index.jsx`

### **4. Corrección de Iconos** ✅
- **Problema:** Iconos no existían en iconMap causando warnings en consola
- **Iconos corregidos:**
  - `MousePointer` → `Target` (estado vacío de ClientsByProductTable)
  - `Layers` → `LayoutGrid` (métricas de servicios)
  - `BarChart` → `BarChart3` (métricas de facturación servicios)
  - `Building` → `Building2` (icono de clientes en tabla)
- **Resultado:** Sin warnings, todos los iconos renderizando correctamente
- **Archivos modificados:**
  - `frontend/src/pages/products-and-client-portfolio/components/DashboardMetricsCards.jsx`
  - `frontend/src/pages/products-and-client-portfolio/components/ClientsByProductTable.jsx`

### **5. UX Improvements** ✅
- **Activity Sidebar condicional:**
  - Sidebar de actividad reciente se oculta cuando `activeTab === 'dashboard'`
  - Dashboard aprovecha todo el ancho horizontal disponible
  - Sidebarmantiene visible en tabs de "Productos & Servicios" y "Clientes"
- **Archivos modificados:**
  - `frontend/src/pages/products-and-client-portfolio/index.jsx`

---

## 🆕 NUEVAS FUNCIONALIDADES IMPLEMENTADAS (13 Enero 2026 - Mañana)

### **1. Separación de Actor vs Target en Activity Logs** ✅
- **Descripción:** El registro de actividades ahora distingue claramente entre quién realizó la acción (actor) y quién fue afectado (target)
- **Problema anterior:** La columna "USUARIO" mostraba solo el usuario afectado, no quién realizó la acción
- **Solución implementada:**
  - **Backend:**
    - Modificado `request.util.ts` para capturar datos del actor autenticado (`actorUserId`, `actorUserEmail`)
    - Actualizado `users.service.ts` para almacenar:
      - Actor en campos principales: `userId`, `userName`, `userEmail`
      - Target en `metadata.targetUser` con información del usuario afectado
    - Aplicado en métodos: `update()`, `updateStatus()`, `delete()`
  - **Frontend:**
    - Agregadas DOS columnas en `activity-logs/index.jsx`:
      - "Realizado Por" → muestra el actor (`log.userName`)
      - "Usuario Afectado" → muestra el target (`log.metadata.targetUser.name`)
    - Actualizado `ActivityLogPanel.jsx` para mostrar ambas columnas
    - Agregado ícono `UserCheck` en `iconMap.js` para identificar usuarios afectados
- **Resultado:** Trazabilidad completa de acciones - se ve quién hizo qué a quién
- **Archivos modificados:**
  - `backend/src/utils/request.util.ts`
  - `backend/src/modules/users/users.service.ts`
  - `frontend/src/pages/activity-logs/index.jsx`
  - `frontend/src/components/ui/ActivityLogPanel.jsx`
  - `frontend/src/components/iconMap.js`

### **2. Menú de Usuario Funcional** ✅
- **Descripción:** Corrección completa del menú de perfil de usuario (esquina superior derecha)
- **Problemas anteriores:**
  - Mostraba nombre mockup "Ludwig Schmidt"
  - Opciones no funcionales (Profile Settings, Preferences, Help & Support, Logout)
  - Sin conexión al usuario real
- **Solución implementada:**
  - **Conexión a usuario real:**
    - Integrado `authService.getMe()` para obtener datos del usuario autenticado
    - useEffect para cargar datos al montar componente
    - Manejo de estados de carga y error
  - **Opciones del menú rediseñadas:**
    - ✅ **Mi Perfil** → navega a `/team-and-system-administration`
    - ✅ **Registro de Actividades** → navega a `/activity-logs`
    - ✅ **Tema Claro/Oscuro** → ThemeSwitcher integrado (ver punto 3)
    - ✅ **Cerrar Sesión** → logout funcional con navegación a login
  - **Logout funcional:**
    - Llama `authService.logout()` para invalidar sesión en backend
    - Limpia tokens de localStorage como fallback
    - Redirige a `/authentication-and-access-control`
- **Resultado:** Menú de usuario completamente funcional y conectado al sistema real
- **Archivos modificados:**
  - `frontend/src/components/ui/UserProfileHeader.jsx`

### **3. Sistema de Tema Dark/Light Mode** ✅
- **Descripción:** Implementación completa de switch de tema claro/oscuro en toda la aplicación
- **Componentes creados:**
  - **ThemeContext.jsx:**
    - Context API para manejo global de tema
    - Persistencia en localStorage con key `theme`
    - Detección automática de preferencias del sistema (`prefers-color-scheme`)
    - Hook `useTheme()` para acceder al contexto
    - Funciones: `toggleTheme()`, `setThemeMode(mode)`
    - Aplica clase `dark` en el elemento `<html>` para activar TailwindCSS dark mode
  - **ThemeSwitcher.jsx:**
    - Componente reutilizable con 2 variantes:
      - `variant="button"` → botón con ícono para navbar
      - `variant="menu-item"` → item de menú con toggle switch
    - Íconos: `Sun` (light mode) y `Moon` (dark mode)
    - Toggle animado con transiciones suaves
- **Integración:**
  - `index.jsx` → App envuelto en `<ThemeProvider>`
  - `UserProfileHeader.jsx` → ThemeSwitcher integrado en menú desplegable
  - `iconMap.js` → Agregados íconos `Sun` y `Moon` de lucide-react
- **Características:**
  - ✅ Persistencia entre sesiones (localStorage)
  - ✅ Detección de preferencias del sistema al primer uso
  - ✅ Cambio inmediato sin reload de página
  - ✅ Compatible con todas las páginas del sistema (gracias a TailwindCSS dark mode)
- **Resultado:** Sistema de temas completamente funcional con UX fluida
- **Archivos creados:**
  - `frontend/src/contexts/ThemeContext.jsx` (NEW)
  - `frontend/src/components/ui/ThemeSwitcher.jsx` (NEW)
- **Archivos modificados:**
  - `frontend/src/index.jsx`
  - `frontend/src/components/ui/UserProfileHeader.jsx`
  - `frontend/src/components/iconMap.js`

### **4. Sistema de Permisos por Rol en Activity Logs** ✅
- **Descripción:** Control de acceso basado en roles para visualización de logs de actividad
- **Reglas implementadas:**
  - **Usuarios Admin** (CEO, ADMIN, DEV_DIRECTOR, CTO, LEAD):
    - Ven TODOS los logs del sistema
    - Tienen acceso a filtros de usuario
    - Pueden exportar logs a CSV
    - Pueden eliminar logs antiguos
    - Pueden ver estadísticas globales
  - **Usuarios Normales** (FULLSTACK, BACKEND, FRONTEND, etc.):
    - Solo ven SUS PROPIOS logs
    - No tienen acceso a filtro de usuario
    - No pueden ver logs de otros usuarios
    - No pueden acceder a estadísticas
- **Implementación Backend:**
  - Método estático `isAdmin(role)` en `ActivityLogsController`:
    - Roles admin: CEO, ADMIN, DEV_DIRECTOR, CTO, LEAD
    - Comparación case-insensitive con `.toUpperCase()`
  - **Endpoint `getAll()`:**
    - Si usuario NO es admin y NO especifica userId, fuerza filtro por su propio userId
    - Logs con contexto: "Admin user or userId filter specified" / "Non-admin user, filtering by their userId"
  - **Endpoint `getRecent()`:**
    - Admin: llama `ActivityLogsService.getRecent(limit)`
    - Normal: llama `ActivityLogsService.getByUser(currentUserId, limit)`
  - **Endpoint `getByUser()`:**
    - Valida que usuarios normales solo puedan ver sus propios logs (403 Unauthorized)
  - **Endpoints restringidos a Admin:**
    - `getStatistics()` → 403 si no es admin
    - `deleteOldLogs()` → 403 si no es admin
  - **Exportación CSV:**
    - Respeta mismas reglas: admin ve todo, usuario normal solo sus logs
- **Implementación Frontend:**
  - Detección de rol actual con `authService.getMe()`
  - Estado `isAdmin` calculado con roles: CEO, ADMIN, DEV_DIRECTOR
  - **Filtro de Usuario:**
    - Renderizado condicional: `{isAdmin && <Select ... />}`
    - Solo visible para admins
  - useEffect separados para no bloquear carga inicial de logs
- **Resultado:** Seguridad y privacidad de datos de auditoría según roles
- **Archivos modificados:**
  - `backend/src/modules/activity-logs/activity-logs.controller.ts`
  - `frontend/src/pages/activity-logs/index.jsx`

### **5. Fixes Críticos de Bugs** ✅

#### **a) Error: Cannot read properties of undefined (reading 'isAdmin')**
- **Problema:** Backend crasheaba con error al cargar activity logs
- **Causa raíz:** Uso incorrecto de `this.isAdmin()` en métodos estáticos
- **Contexto:** En JavaScript/TypeScript, `this` es `undefined` dentro de métodos estáticos
- **Solución:** Cambiar TODAS las ocurrencias de `this.isAdmin(userRole)` a `ActivityLogsController.isAdmin(userRole)`
- **Métodos corregidos (6 en total):**
  - `getAll()`
  - `getRecent()`
  - `getByUser()`
  - `getStatistics()`
  - `exportToCsv()`
  - `deleteOldLogs()`
- **Verificación:** Backend logs confirman: "Activity logs request - Role: CEO", "Retrieved 17 logs"
- **Archivo:** `backend/src/modules/activity-logs/activity-logs.controller.ts`

#### **b) Query Params como Empty Strings**
- **Problema:** Parámetros de consulta llegaban como `""` en lugar de `undefined`, causando problemas en filtros
- **Solución:** Patrón `(req.query.param as string) || undefined` para convertir strings vacíos
- **Aplicado en:** `userId`, `action`, `entity`, `startDate`, `endDate`, `search`
- **Archivo:** `backend/src/modules/activity-logs/activity-logs.controller.ts`

#### **c) Session Tokens Invalidados**
- **Problema:** Tokens de sesión se invalidaban al reiniciar backend
- **Solución temporal:** Usuario debe logout/login después de restart backend
- **Nota:** Comportamiento esperado con JWT almacenados en localStorage

#### **d) Backend Hot-Reload Issues**
- **Problema:** tsx watch intentaba reiniciar múltiples veces causando conflictos de puerto
- **Solución establecida:** Reinicio manual del backend después de cambios importantes
- **Comando:** `taskkill //F //PID [PID]` en Windows, luego `npm run dev`
- **Política acordada:** Claude debe reiniciar backend/frontend según corresponda después de cambios

---

## 📅 HISTORIAL DE SESIONES

### **Sesión 1 - 7 de Enero 2026**
- ✅ Debugging de login + SVG icons (lucide-react Hexagon bug)
- ✅ Arquitectura base funcional
- ⏱️ Tiempo: ~3 horas

### **Sesión 2 - 8 de Enero 2026**
- ✅ Sistema de roles dinámicos completo
- ✅ Sistema de activity logs con auditoría
- ✅ Captura de IP y User Agent para seguridad
- ✅ Correcciones de UI/UX (sidebar, avatares, buttons)
- ✅ Página de gestión de roles
- ✅ Página de registro de actividades con filtros
- ✅ Panel lateral de actividades recientes
- ✅ Exportación CSV de logs
- ⏱️ Tiempo: ~6 horas

### **Sesión 3 - 13 de Enero 2026 (Mañana)**
- ✅ Separación Actor vs Target en Activity Logs (trazabilidad completa)
- ✅ Menú de usuario funcional con logout real
- ✅ Sistema de tema Dark/Light Mode completo (ThemeContext + ThemeSwitcher)
- ✅ Permisos por rol en Activity Logs (admin ve todo, usuarios ven solo sus logs)
- ✅ Fix crítico: error `this.isAdmin()` en métodos estáticos
- ✅ Fix: query params como empty strings
- ✅ Política de reinicio: Claude reinicia backend/frontend después de cambios
- ⏱️ Tiempo: ~4 horas

### **Sesión 4 - 13 de Enero 2026 (Tarde)**
- ✅ **Activity Logs para Clientes mejorado:**
  - Agregados campos city y status a detección de cambios
  - Registro completo de cambios en: city, nit, tier, status, mrr, currency, healthScore, notes, products
- ✅ **Gestión de Productos en Clientes:**
  - Implementado checkbox list en ClientEditModal para selección de productos
  - Cálculo automático de MRR basado en productos seleccionados
  - Visual display del MRR total calculado
- ✅ **Fix de Edición de Productos:**
  - Campo de recurrencia ahora visible para todos los tipos (no solo servicios)
  - Agregados todos los campos al método update: type, price, currency, hasVAT, vatRate, recurrence
  - Detección de cambios para todos los campos en activity logs
- ✅ **UI Improvements en Products:**
  - ProductFilterToolbar rediseñado a 3 columnas alineadas
  - Badge de filtros activos
- ✅ **Excel Export para Productos:**
  - Función handleExportProductsToExcel implementada
  - Exportación completa con headers en español y formato correcto
- ✅ **Dashboard Principal de Productos y Clientes:**
  - **Backend:**
    - dashboard.service.ts con cálculos de métricas financieras
    - dashboard.controller.ts y dashboard.routes.ts
    - Endpoints: /api/dashboard/metrics, /api/dashboard/products-with-clients, /api/dashboard/products/:id/clients
    - Cálculos: MRR recurrente vs one-time, IVA, facturación por tipo
  - **Frontend:**
    - dashboardService.js para consumir API
    - DashboardMetricsCards.jsx: 8 tarjetas de métricas (productos, servicios, facturaciones, MRR, IVA, total)
    - ProductCardList.jsx: lista de productos con métricas, growth, clientes, deuda
    - ClientsByProductTable.jsx: tabla de clientes por producto seleccionado
    - Integración completa en index.jsx con tab "Dashboard"
    - useEffect para carga automática de datos al cambiar a dashboard
    - handleProductSelect para mostrar clientes del producto
  - **UX:**
    - Activity sidebar se oculta automáticamente en dashboard (más espacio horizontal)
    - Layout responsive con grid 2 columnas en escritorio
    - Selección de producto muestra clientes con health score, tier, MRR
- ✅ **Corrección de Iconos:**
  - MousePointer → Target
  - Layers → LayoutGrid
  - BarChart → BarChart3
  - Building → Building2
  - Todos los iconos ahora existen en iconMap.js
- ⏱️ Tiempo: ~5 horas

### **Sesión 5 - 14 de Enero 2026 (Mañana)**
- ✅ **Unificación de UI/UX entre módulos:**
  - Implementado toggle switch uniforme para activar/desactivar en gestión de usuarios
  - Eliminada columna de estado separada + botón duplicado en acciones
  - Toggle switch verde (activo) / gris (inactivo) con transiciones suaves
- ✅ **Registro de Actividades unificado:**
  - ActivityLogSidebar actualizado para coincidir con diseño de usuarios
  - Ventana con borde redondeado (`rounded-lg border shadow-elevation-1`)
  - Letras más grandes: text-lg para títulos, text-sm para descripciones
  - Íconos grandes: 48px loading/empty, 20px header, 18px items
  - Filtro incluido con 6 opciones: Todas, Gestión, Ediciones, Eliminaciones, Configuración, Sistema
  - Muestra exactamente 5 actividades (igual que usuarios)
  - Auto-refresh cada 30 segundos
  - Actor y Target User visibles con iconos diferenciados
- ✅ **Títulos principales agregados:**
  - **Productos:** "Gestión de Productos y Servicios" + descripción
  - **Clientes:** "Gestión de Clientes" + descripción
  - Mismo formato que usuarios (text-2xl md:text-3xl)
  - Layout flex-col sm:flex-row con botones alineados a la derecha
- ✅ **Sistema de Grid unificado:**
  - Implementado grid 12 columnas en productos/clientes
  - Contenido principal: 75% (9 columnas)
  - Registro de actividades: 25% (3 columnas)
  - Proporciones optimizadas para legibilidad de las 5 actividades
  - Gap de 6 entre secciones para espaciado consistente
- ✅ **Estructura visual consistente:**
  - Alineación de títulos, filtros y tablas unificada
  - ActivityLogSidebar alineado con títulos principales
  - Padding y márgenes consistentes en todos los módulos
  - Mismo espaciado entre usuarios, productos y clientes
- ✅ **Ícono Server agregado a iconMap.js**
- **Archivos modificados:**
  - `frontend/src/pages/team-and-system-administration/components/UserManagementTable.jsx`
  - `frontend/src/pages/products-and-client-portfolio/components/ActivityLogSidebar.jsx`
  - `frontend/src/pages/products-and-client-portfolio/index.jsx`
  - `frontend/src/pages/team-and-system-administration/index.jsx`
  - `frontend/src/components/iconMap.js`
- **Resultado:** UI/UX completamente uniforme entre gestión de usuarios, productos y clientes
- ⏱️ Tiempo: ~2 horas

### **Sesión 6 - 14 de Enero 2026 (Tarde)**
- ✅ **Sistema Completo de Cotizaciones:**
  - **Backend:**
    - Módulo completo `/api/quotations` con CRUD, duplicación, envío de email
    - `quotations.service.ts` con cálculos automáticos de subtotal, IVA, descuentos, total
    - `quotations.controller.ts` con endpoints protegidos
    - Schema Prisma: tablas `quotations` y `quotation_items`
    - Generación automática de número de cotización (BAQ-2026-XXXX)
    - Estados: DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED, CONVERTED_TO_ORDER
    - Relaciones con clientes, productos y usuarios
  - **Frontend:**
    - QuotationsTable con filtros avanzados (status, cliente, rango de fechas, búsqueda)
    - QuotationModal para crear/editar con múltiples items
    - Cálculos en tiempo real de subtotales, descuentos, IVA y total
    - Selector de recurrencia por ítem (MONTHLY, QUARTERLY, etc.)
    - Campos: validez, tiempo de entrega, garantía, términos de pago, observaciones
    - Acciones: Ver, Editar, Duplicar, Descargar PDF, Enviar Email, Cambiar Estado, Eliminar
  - **Archivos creados:**
    - `backend/src/modules/quotations/` (service, controller, routes, types)
    - `frontend/src/services/quotationService.js`
    - `frontend/src/pages/products-and-client-portfolio/components/QuotationsTable.jsx`
    - `frontend/src/pages/products-and-client-portfolio/components/QuotationModal.jsx`
    - `frontend/src/pages/products-and-client-portfolio/components/QuotationFilterToolbar.jsx`
    - `frontend/src/pages/products-and-client-portfolio/components/QuotationItemRow.jsx`

- ✅ **Generación de PDFs con jsPDF:**
  - **pdfGenerator.js:**
    - Logo de empresa con aspect ratio correcto
    - Header con datos de empresa (configurables desde sistema)
    - Información de cliente (nombre, NIT, contacto)
    - Tabla de items con descripción, cantidad, precio, descuento, total
    - Totales: subtotal, descuento, IVA, total final
    - Condiciones comerciales y observaciones
    - Firma con nombre y cargo configurables
    - Paginación automática si el contenido es extenso
    - Diseño profesional con colores corporativos
  - **Integración:**
    - Botón "Descargar PDF" en cada cotización
    - PDF se adjunta automáticamente al enviar por correo
    - Formato de moneda y fechas en español
  - **Archivos creados:**
    - `frontend/src/utils/pdfGenerator.js`

- ✅ **Sistema de Envío de Correos:**
  - **Backend - emailService.ts:**
    - Integración con nodemailer para envío SMTP
    - Configuración desde panel de administración (host, puerto, usuario, contraseña)
    - Formato de remitente: "Nombre Empresa <email@dominio.com>"
    - Soporte para CC, BCC
    - Adjuntos con base64 (PDFs)
    - Plantilla HTML para correos
    - Endpoint de prueba: `/api/system-config/send-test-email`
  - **Frontend - SendEmailModal:**
    - Modal para enviar cotizaciones por correo
    - Campos: Para, CC, BCC, Asunto, Cuerpo
    - Asunto prellenado: "Cotización [NÚMERO] - IPTEGRA SAS"
    - Cuerpo con texto de cortesía predefinido
    - Generación de PDF en tiempo real antes de enviar
    - Conversión de PDF a base64 para adjuntar
    - Logs en consola para debugging
  - **Configuración de Empresa:**
    - Panel en Team & System Administration
    - Sección "Configuración de Email" con:
      - Email de envío
      - Servidor SMTP (host, puerto)
      - Usuario y contraseña SMTP
      - Cifrado SSL/TLS
    - Botón "Enviar Correo de Prueba" para validar configuración
  - **Archivos creados:**
    - `backend/src/utils/emailService.ts`
    - `frontend/src/pages/products-and-client-portfolio/components/SendEmailModal.jsx`
  - **Archivos modificados:**
    - `backend/src/modules/system-config/` (agregado envío de email)

- ✅ **Configuración del Sistema (System Config):**
  - **Configuración de Empresa:**
    - Nombre, tipo, NIT, dirección, ciudad, teléfono, website
    - Logo de empresa (base64) para PDFs y emails
    - Firmante de cotizaciones (nombre y cargo)
  - **Configuración de Email:**
    - Host, puerto, usuario, contraseña SMTP
    - Email de envío (con nombre de empresa)
    - Prueba de conexión con botón de test
  - **Árbol de Navegación:**
    - NavigationTree con secciones: General, Empresa, Email, Roles, Usuarios
    - Scroll suave entre secciones
    - Componente reutilizable SystemConfigPanel
  - **Archivos:**
    - `backend/src/modules/system-config/` (completo)
    - `frontend/src/services/systemConfigService.js`
    - `frontend/src/pages/team-and-system-administration/components/SystemConfigPanel.jsx`
    - `frontend/src/pages/team-and-system-administration/components/NavigationTree.jsx`

- ✅ **Correcciones de Errores Críticos:**
  - **Error de importación nodemailer:**
    - Problema: `import_nodemailer.default.createTransporter is not a function`
    - Causa: Conflicto CommonJS vs ES6 modules
    - Solución: Cambiar a `import * as nodemailer from 'nodemailer'`
    - Archivo: `backend/src/utils/emailService.ts`

  - **Activity logs - userName faltante:**
    - Problema: Varios endpoints no pasaban `userName` al crear logs
    - Solución: Agregado `userName` y `userEmail` en:
      - `quotations.service.ts` (create, update, updateStatus, delete, duplicate, sendEmail)
    - Todos los activity logs ahora registran correctamente actor y target

  - **Nombre del cliente desaparecía:**
    - Problema: Al actualizar/duplicar cotización, el campo `clientName` desaparecía de la tabla
    - Causa: Backend devolvía `client: { name: ... }` pero tabla esperaba `clientName`
    - Solución: Recargar lista completa después de actualizar/duplicar
    - Archivo: `frontend/src/pages/products-and-client-portfolio/index.jsx`

  - **Contador de cotizaciones en tabs:**
    - Problema: Mostraba "0" hasta hacer clic en el tab de cotizaciones
    - Causa: Cotizaciones solo se cargaban al activar el tab
    - Solución: Cargar cotizaciones en `useEffect` inicial junto con productos/clientes
    - Archivo: `frontend/src/pages/products-and-client-portfolio/index.jsx`

  - **Ícono XCircle faltante:**
    - Problema: `Icon "XCircle" not found in iconMap`
    - Solución: Agregado `XCircle` a imports y exports en iconMap
    - Archivo: `frontend/src/components/iconMap.js`

  - **PDF se generaba vacío:**
    - Problema: PDF enviado por correo no tenía items ni términos actualizados
    - Causa: Modal usaba datos resumidos de la tabla, no la cotización completa
    - Solución: Cargar cotización completa con `quotationService.getById()` antes de abrir modal
    - Archivo: `frontend/src/pages/products-and-client-portfolio/index.jsx` (handleSendQuotationEmail)

  - **Campo "Para" prellenado incorrectamente:**
    - Problema: Modal de email prellenaba con email del cliente (que podía no existir)
    - Solución: Dejar campo "Para" vacío para que usuario lo complete manualmente
    - Archivo: `frontend/src/pages/products-and-client-portfolio/components/SendEmailModal.jsx`

- ✅ **Mejoras de UX:**
  - Logs detallados en consola para debugging de PDFs y emails
  - Formato de remitente con nombre de empresa en emails
  - Descripción clara de campos de configuración de email
  - Modal de email con validaciones antes de enviar

- **Endpoints agregados:**
  - `POST /api/quotations` - Crear cotización
  - `GET /api/quotations` - Listar con filtros
  - `GET /api/quotations/:id` - Obtener por ID
  - `PUT /api/quotations/:id` - Actualizar
  - `DELETE /api/quotations/:id` - Eliminar
  - `PATCH /api/quotations/:id/status` - Cambiar estado
  - `POST /api/quotations/:id/duplicate` - Duplicar
  - `POST /api/quotations/:id/send-email` - Enviar por correo
  - `POST /api/system-config/send-test-email` - Test de email

- **Dependencias agregadas:**
  - `jspdf` - Generación de PDFs
  - `jspdf-autotable` - Tablas en PDFs
  - `nodemailer` - Envío de correos SMTP

- ⏱️ Tiempo: ~4 horas

---

### **Sesión 7 - 14 de Enero 2026 (Noche)**
- ✅ **Reorganización de Configuraciones del Sistema:**
  - **Separación de tabs de configuración:**
    - Tab "Empresa": datos de empresa, logo, firmante
    - Tab "Correo Electrónico": configuración SMTP completa
    - Tab "Plantillas": términos comerciales, observaciones
  - **Configuración de TRM automática:**
    - Eliminado campo manual de TRM
    - Agregada sección informativa sobre actualización automática
    - Explicación de que TRM se obtiene de API cada 24 horas
  - **Archivos modificados:**
    - `frontend/src/pages/team-and-system-administration/components/SystemConfigPanel.jsx`

- ✅ **Funcionalidad de Eliminación:**
  - **Productos:**
    - Botón de eliminar con ícono Trash2
    - Confirmación con window.confirm antes de eliminar
    - Actualización de estado local después de eliminar exitosamente
    - Manejo de errores con mensajes claros
  - **Clientes:**
    - Misma funcionalidad de eliminación
    - Confirmación de usuario requerida
    - Feedback visual después de eliminar
  - **Archivos modificados:**
    - `frontend/src/pages/products-and-client-portfolio/components/ProductTableRow.jsx`
    - `frontend/src/pages/products-and-client-portfolio/components/ClientTableRow.jsx`
    - `frontend/src/pages/products-and-client-portfolio/index.jsx`

- ✅ **Búsqueda y Paginación en Modales de Cliente:**
  - **Búsqueda de productos:**
    - Campo de búsqueda con ícono Search
    - Filtrado en tiempo real por nombre, descripción o tipo
    - Búsqueda case-insensitive
  - **Paginación:**
    - 5 productos por página
    - Botones Anterior/Siguiente
    - Contador "X - Y de Z productos"
    - Reset automático a página 1 al buscar
  - **useMemo para optimización:**
    - filteredProducts calculado con useMemo
    - paginatedProducts calculado con useMemo
    - Evita recalcular en cada render
  - **Archivos modificados:**
    - `frontend/src/pages/products-and-client-portfolio/components/ClientCreationModal.jsx`
    - `frontend/src/pages/products-and-client-portfolio/components/ClientEditModal.jsx`

- ✅ **Corrección Crítica del Dashboard - MRR de Cotizaciones Convertidas:**
  - **Cambio fundamental:** MRR ahora se calcula SOLO de cotizaciones con estado CONVERTED_TO_ORDER (antes se calculaba de productos asignados a clientes)
  - **Separación de monedas:**
    - **mrrUSD:** Total en dólares de cotizaciones convertidas (sin conversión)
    - **mrrCOP:** Total en pesos de cotizaciones convertidas (sin conversión)
    - **totalMRRConverted:** Total en USD usando TRM para conversión de COP
  - **Nueva estructura de tarjetas:**
    - **Sección 1 - MRR por Moneda (3 tarjetas):**
      - MRR USD (EEUU): cotizaciones en dólares
      - MRR COP (Colombia): cotizaciones en pesos
      - Total MRR Convertido: suma con conversión a USD + badge con TRM y fecha
    - **Sección 2 - Métricas Generales (8 tarjetas):**
      - Total Productos, Total Servicios
      - Facturación Productos, Facturación Servicios
      - MRR Recurrente, Pagos Únicos
      - IVA Total, Total Mensual
      - Badge "Todos los valores en USD"
  - **Archivos modificados:**
    - `backend/src/modules/dashboard/dashboard.service.ts`
    - `frontend/src/pages/products-and-client-portfolio/components/DashboardMetricsCards.jsx`

- ✅ **Integración de TRM desde API Pública:**
  - **Servicio de Exchange Rate:**
    - API utilizada: `https://api.exchangerate-api.com/v4/latest/USD`
    - Cache de 24 horas en memoria
    - Función `getUSDtoCOPRate()`: retorna rate y lastUpdated
    - Función `invalidateExchangeRateCache()`: forzar actualización
  - **Estrategia de fallback:**
    1. Intentar consultar API
    2. Si falla, usar cache (aunque esté vencido)
    3. Si no hay cache, usar valor por defecto (4200)
  - **Integración con dashboard:**
    - TRM obtenida al inicio de getMetrics()
    - Usada para convertir COP a USD en todas las métricas generales
    - lastUpdated mostrado en dashboard con formato dd/mmm
  - **Dependencias agregadas:**
    - axios (instalado con npm install axios)
  - **Archivos creados:**
    - `backend/src/utils/exchangeRateService.ts`
  - **Archivos modificados:**
    - `backend/src/modules/dashboard/dashboard.service.ts`
    - `backend/package.json`

- ✅ **FIX CRÍTICO: Corrección de Mezcla de Monedas:**
  - **Problema crítico:** Dashboard sumaba pesos colombianos (COP) con dólares (USD) sin conversión en "Métricas Generales"
  - **Solución implementada:**
    - Conversión a USD antes de sumar a totales:
      ```typescript
      const subtotalUSD = quotation.currency === 'COP'
        ? subtotal / exchangeRate
        : subtotal;
      ```
    - Aplicado a: subtotal, vatAmount
    - Todos los totales ahora en USD consistente:
      - monthlyProductRevenue (USD)
      - monthlyServiceRevenue (USD)
      - recurringMRR (USD)
      - oneTimeMRR (USD)
      - totalVAT (USD)
      - totalMonthlyRevenue (USD)
  - **Separación preservada:**
    - mrrUSD y mrrCOP mantienen valores en moneda original
    - Solo las métricas agregadas se convierten a USD
  - **Indicadores visuales:**
    - Badge "Todos los valores en USD" en sección de Métricas Generales
    - Subtítulos con "(USD)" o "Convertido a USD"
  - **Archivos modificados:**
    - `backend/src/modules/dashboard/dashboard.service.ts` (líneas 99-121)
    - `frontend/src/pages/products-and-client-portfolio/components/DashboardMetricsCards.jsx` (líneas 99-102, 129, 138, 147, 156, 165)

- **Errores resueltos:**
  - ❌ Module 'axios' not found → ✅ npm install axios
  - ❌ Pesos + Dólares sumados sin conversión → ✅ Conversión a USD implementada
  - ❌ TRM manual desactualizada → ✅ API automática con cache de 24h

- **Resultado final:**
  - ✅ Dashboard con métricas precisas y separadas por moneda
  - ✅ Conversión automática COP → USD en métricas generales
  - ✅ TRM actualizada automáticamente cada 24 horas
  - ✅ Eliminación de productos/clientes funcional
  - ✅ Búsqueda y paginación en modales de clientes
  - ✅ Configuración organizada en 3 tabs

- ⏱️ Tiempo: ~3 horas

### **Sesión 8 - 15 de Enero 2026**
- ✅ **Sistema Completo de Time Tracking (Rastreo de Tiempo):**
  - **Backend:**
    - **Modelo TimeEntry en Prisma:**
      - Campos: id, requestId, userId, startedAt, pausedAt, endedAt, duration, status, description
      - Enum TimeEntryStatus: ACTIVE (timer corriendo), PAUSED (pausado), COMPLETED (finalizado)
      - Relaciones con Request y User
      - Índices para optimizar queries por requestId, userId, status
    - **time-entries.service.ts:**
      - `getByRequestId()`: Obtener todas las entradas de tiempo de una solicitud
      - `getActiveEntry()`: Obtener entrada activa o pausada del usuario actual
      - `start()`: Iniciar nueva sesión de tiempo
      - `pause()`: Pausar sesión activa y calcular duración acumulada
      - `resume()`: Reanudar sesión pausada (ajusta startedAt para compensar tiempo pausado)
      - `complete()`: Finalizar sesión y actualizar actualHours del request
      - `delete()`: Eliminar entrada y recalcular actualHours
      - **Cálculo de duración:**
        - ACTIVE: `(now - startedAt) / (1000 * 60 * 60)` en tiempo real
        - PAUSED: Almacena duración calculada al pausar
        - COMPLETED: Duración final almacenada permanentemente
      - **Auto-actualización de actualHours:** Al completar o eliminar, suma todas las entradas COMPLETED
    - **time-entries.controller.ts:**
      - 7 endpoints HTTP con validación Zod
      - Todos protegidos con autenticación (req.user.userId)
      - Respuestas consistentes con formato `{ success, data, message }`
    - **time-entries.routes.ts:**
      - Integrado en `/api/requests/:requestId/time-entries/*`
      - GET `/` - Listar todas las entradas
      - GET `/active` - Obtener entrada activa
      - POST `/start` - Iniciar sesión
      - PUT `/pause` - Pausar sesión
      - PUT `/resume` - Reanudar sesión
      - PUT `/complete` - Completar sesión
      - DELETE `/:timeEntryId` - Eliminar entrada
    - **Migración Prisma:**
      - `npx prisma generate` para regenerar cliente
      - `npx prisma db push` para sincronizar schema con DB

  - **Frontend:**
    - **timeEntryService.js:**
      - Cliente API completo para consumir todos los endpoints
      - Manejo de errores y respuestas
    - **TimeTracker.jsx:**
      - **Timer en tiempo real:**
        - useEffect con setInterval que actualiza cada segundo
        - Formato HH:MM:SS con padStart para ceros a la izquierda
        - Cálculo desde startedAt hasta now para sesiones ACTIVE
        - Muestra duración almacenada para sesiones PAUSED
      - **Tres estados de botones:**
        - Sin sesión: botón "Iniciar" (verde con icono Play)
        - ACTIVE: botones "Pausar" (amarillo) y "Completar" (verde)
        - PAUSED: botones "Reanudar" (azul) y "Completar" (verde)
      - **Campo de descripción:**
        - Textarea opcional para notas de la sesión
        - Se guarda al pausar o completar
      - **Historial de entradas:**
        - Lista colapsable con todas las sesiones completadas
        - Muestra: fecha, duración formateada, descripción, icono de estado
        - Botón eliminar por entrada (icono Trash2)
      - **Total de horas:**
        - Suma de todas las sesiones completadas
        - Formato legible con formatHours()
    - **RequestDetailModal.jsx:**
      - Nuevo tab "Tiempo" junto a Comentarios y Actividad
      - Integración del componente TimeTracker
      - Callback onTimeUpdated para refrescar datos del request
    - **Integración en Request Management:**
      - Tab "Tiempo" visible en modal de detalles de solicitud
      - Icono Clock para identificar la pestaña
      - Layout responsive con padding consistente

  - **Utilidades de Formato de Tiempo (timeFormat.js):**
    - **formatHours(hours, format):**
      - `format='short'`: "2h 30m", "45m", "30s" (legible y compacto)
      - `format='long'`: "02:30:00" (formato HH:MM:SS)
      - Lógica inteligente: muestra solo unidades no-cero
      - Maneja casos edge: 0h, menos de 1 segundo
    - **formatHoursCompact(hours):**
      - Formato simplificado con 1 decimal: "2.5h"
      - < 1 hora: muestra en minutos "45m" o segundos "30s"
      - Ideal para tablas y displays compactos
    - **Aplicado en:**
      - `RequestTable.jsx`: columnas "Horas Est." y "Horas Real"
      - `KanbanBoard.jsx`: display de horas en tarjetas "0.5h/2h"
      - `RequestDetailModal.jsx`: panel de detalles
      - `TimeTracker.jsx`: historial de sesiones

- ✅ **Errores Críticos Resueltos:**
  - **Error 1: Puerto 3001 en uso (múltiples veces)**
    - Síntoma: `EADDRINUSE: address already in use :::3001`
    - Causa: Proceso backend previo no terminado correctamente
    - Solución sistemática:
      1. `netstat -ano | findstr :3001` para encontrar PID
      2. `taskkill //F //PID [número]` para matar proceso
      3. Reiniciar backend con `npm run dev`
    - Recurrió 3-4 veces durante la sesión

  - **Error 2: prisma.timeEntry is undefined**
    - Síntoma: `TypeError: Cannot read properties of undefined (reading 'timeEntry')`
    - Causa: Cliente Prisma no regenerado o tsx watch usando cache viejo
    - Intentos fallidos:
      1. `npx prisma generate` (no suficiente)
      2. Restart del backend (tsx watch mantenía cache)
    - Solución final:
      1. Matar TODOS los procesos Node en puerto 3001
      2. `rm -rf node_modules/.prisma` (limpiar cache)
      3. `npx prisma generate`
      4. Restart completo del backend (no hot-reload)
    - Verificación: `node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); console.log('timeEntry' in prisma)"`

  - **Error 3: Import/Export mismatch de Prisma**
    - Síntoma: `prisma.timeEntry` undefined después de regenerar
    - Causa: `database.ts` usa `export default prisma` pero service usaba `import { prisma }`
    - Solución:
      ```typescript
      // Cambio de:
      import { prisma } from '../../config/database';

      // A:
      import prisma from '../../config/database';
      ```
    - Archivo: `backend/src/modules/time-entries/time-entries.service.ts`

  - **Error 4: userId undefined al crear time entries**
    - Síntoma: Backend logs mostraban `userId: undefined`, fallo de validación Prisma
    - Causa: Estructura de AuthRequest tiene `req.user.userId`, no `req.user.id`
    - Middleware define:
      ```typescript
      export interface AuthRequest extends Request {
        user?: {
          userId: string;  // ← Campo correcto
          email: string;
          role: string;
        };
      }
      ```
    - Solución: Cambiar en 6 métodos del controller:
      ```typescript
      // De:
      const userId = req.user!.id;

      // A:
      const userId = req.user!.userId;
      ```
    - Métodos corregidos: getActiveEntry, startTimeEntry, pauseTimeEntry, resumeTimeEntry, completeTimeEntry, deleteTimeEntry
    - Archivo: `backend/src/modules/time-entries/time-entries.controller.ts`

  - **Error 5: Formato de horas ilegible**
    - Síntoma: Display mostraba "0.002540833333333333h" en tablas
    - Causa: Horas almacenadas como decimales (0.0025 = 9 segundos)
    - Usuario reportó: "asi veo la data, debemos colocar un formato mas legible los tiempos"
    - Solución: Creación de `timeFormat.js` con funciones de formato
    - Aplicado globalmente en todos los componentes que muestran horas

- ✅ **Archivos Creados:**
  - `backend/src/modules/time-entries/time-entries.service.ts` (NEW)
  - `backend/src/modules/time-entries/time-entries.controller.ts` (NEW)
  - `backend/src/modules/time-entries/time-entries.routes.ts` (NEW)
  - `backend/src/modules/time-entries/time-entries.types.ts` (NEW)
  - `frontend/src/services/timeEntryService.js` (NEW)
  - `frontend/src/pages/request-management-center/components/TimeTracker.jsx` (NEW)
  - `frontend/src/utils/timeFormat.js` (NEW)

- ✅ **Archivos Modificados:**
  - `backend/prisma/schema.prisma` (agregado modelo TimeEntry + enum TimeEntryStatus)
  - `backend/src/modules/requests/requests.routes.ts` (integración de rutas de time entries)
  - `frontend/src/pages/request-management-center/components/RequestDetailModal.jsx` (tab "Tiempo")
  - `frontend/src/pages/request-management-center/components/RequestTable.jsx` (formato de horas)
  - `frontend/src/pages/request-management-center/components/KanbanBoard.jsx` (formato de horas)
  - `frontend/src/components/iconMap.js` (agregado ícono Pause)

- ✅ **Características Técnicas:**
  - **Trabajo multi-sesión:** Permite pausar trabajo, cerrar navegador, y reanudar después
  - **Precisión de timer:** Cálculo en tiempo real con Date().getTime() evita desfase
  - **Persistencia:** Todo almacenado en PostgreSQL, no se pierde al refrescar
  - **Actualización automática:** actualHours del request siempre refleja suma de sesiones completadas
  - **Validación robusta:** Zod schemas en backend previenen datos inválidos
  - **UX fluida:** Timer actualizado cada segundo sin lag, transiciones suaves en botones

- **Resultado:**
  - ✅ Sistema de time tracking totalmente funcional y realista
  - ✅ Usuarios pueden trabajar en solicitudes dividiendo tiempo en múltiples días
  - ✅ Formato de horas legible y profesional en toda la aplicación
  - ✅ Backend estable después de resolver problemas de Prisma y autenticación
  - ✅ Código limpio y mantenible con separación de responsabilidades

- ⏱️ Tiempo: ~5 horas (incluye debugging extensivo de Prisma y autenticación)

---

### **Sesión 9 - 15/16 de Enero 2026**
- ✅ **Sistema Completo de Planificación de Capacidad (Capacity Planning Workspace):**
  - **Backend - Módulo de Assignments:**
    - **Schema Prisma - Modelo Assignment:**
      - Campos: id, requestId, userId, assignedDate, allocatedHours, actualHours, status, notes, weekStart
      - Enum AssignmentStatus: PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
      - Relaciones con Request y User
      - Índices para optimizar queries por requestId, userId, assignedDate, weekStart
    - **assignments.service.ts:**
      - **CRUD completo:**
        - `create(data)`: Crear asignación con validación de capacidad diaria
        - `createBulk(assignments[])`: Crear múltiples asignaciones en transacción
        - `update(id, data)`: Actualizar asignación con revalidación de capacidad
        - `delete(id)`: Eliminar asignación
        - `getById(id)`: Obtener asignación por ID con relaciones
        - `getAll(filters)`: Listar con paginación y filtros (userId, requestId, status, date)
      - **Queries especializadas:**
        - `getByDateRange(startDate, endDate)`: Obtener asignaciones de un rango de fechas
        - `getByWeek(weekStart)`: Filtrar por semana específica
        - `getByUser(userId)`: Todas las asignaciones de un usuario
        - `getDailyCapacitySummary(date)`: Resumen de capacidad para una fecha específica
        - `getCapacitySummary(weekStart)`: Resumen semanal por usuario (allocated, completed, utilization%)
      - **Validación de Capacidad Diaria:**
        - Capacidad diaria = `user.capacity / 5` (ej: 40h/semana ÷ 5 días = 8h/día)
        - Verifica capacidad ANTES de crear asignación
        - Suma todas las asignaciones existentes del día
        - Error si `totalAllocated + newHours > dailyCapacity`
        - Validación aplicada en: create(), createBulk(), update()
      - **Normalización de fechas:**
        - `assignedDate.setHours(0, 0, 0, 0)` para eliminar componente de tiempo
        - Consistencia en todas las queries de fecha
    - **assignments.controller.ts:**
      - 9 endpoints HTTP con autenticación requerida
      - Validación con Zod schemas
      - Respuestas consistentes: `{ success, data, message, pagination? }`
    - **assignments.routes.ts:**
      - Integrado en `/api/assignments/*`
      - GET `/` - Listar con filtros
      - POST `/` - Crear asignación
      - POST `/bulk` - Crear múltiples (distribución multi-día)
      - GET `/:id` - Obtener por ID
      - PUT `/:id` - Actualizar
      - DELETE `/:id` - Eliminar
      - GET `/date-range` - Por rango de fechas
      - GET `/week/:weekStart` - Por semana
      - GET `/user/:userId` - Por usuario
      - GET `/capacity-summary` - Resumen semanal

  - **Frontend - Componentes de Planificación:**
    - **AssignmentDistributionModal.jsx (NUEVO - Componente crítico):**
      - **Dos modos de distribución:**
        - **Modo Rápido:** Distribuir horas automáticamente en 5 días laborales
        - **Modo Avanzado:** Seleccionar días específicos y horas por día manualmente
      - **Patrón crítico - Manejo de Timezone (aplicado en TODO el componente):**
        ```javascript
        // ❌ INCORRECTO (causa desfase de 1 día):
        const date = new Date("2026-01-12"); // Interpreta como UTC midnight → día anterior en GMT-5

        // ✅ CORRECTO (usado en todo el código):
        const [year, month, day] = "2026-01-12".split('-').map(Number);
        const localDate = new Date(year, month - 1, day); // Crea fecha local sin conversión
        ```
      - **Inicialización de días avanzados (advancedDays):**
        ```javascript
        // Parseo manual de initialDate
        const [year, month, day] = initialDate.split('-').map(Number);
        let currentDate = new Date(year, month - 1, day);

        // Ajuste si es fin de semana
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0) currentDate.setDate(currentDate.getDate() + 1); // Dom → Lun
        else if (dayOfWeek === 6) currentDate.setDate(currentDate.getDate() + 2); // Sáb → Lun

        // Generar array de 5 días laborales con formato manual
        while (days.length < 5) {
          if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            const yearStr = currentDate.getFullYear();
            const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
            const dayStr = String(currentDate.getDate()).padStart(2, '0');
            const dateStr = `${yearStr}-${monthStr}-${dayStr}`;
            days.push({ date: dateStr, hours: 0, enabled: false });
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        ```
      - **Renderizado de fechas en JSX (sin timezone issues):**
        ```javascript
        // Parseo manual ANTES de formatear
        const [year, month, dayNum] = day.date.split('-').map(Number);
        const localDate = new Date(year, month - 1, dayNum);
        const dayName = localDate.toLocaleDateString('es', { weekday: 'long' });
        const dateFormatted = localDate.toLocaleDateString('es', {
          day: '2-digit',
          month: 'short'
        });
        ```
      - **Creación de asignaciones para enviar al backend:**
        ```javascript
        // Usar mediodía LOCAL (no UTC) para evitar cambio de día
        const [year, month, day] = dateStr.split('-').map(Number);
        const dateTime = new Date(year, month - 1, day, 12, 0, 0); // Local noon

        return {
          userId: user.id,
          requestId: request.id,
          assignedDate: dateTime.toISOString(), // Ahora sí convertir a ISO
          allocatedHours: parseFloat(hours),
          notes: ''
        };
        ```
      - **Validaciones del modal:**
        - Modo rápido: total debe ser ≤ estimatedHours
        - Modo avanzado: al menos un día debe tener horas > 0
        - Modo avanzado: suma de días no puede exceder estimatedHours
        - Error visual con mensaje claro: `⚠️ El total de ${total}h excede las ${estimated}h estimadas`
      - **Estados del componente:**
        - mode: 'quick' | 'advanced'
        - quickDays: número de días (1-5)
        - quickHoursPerDay: horas por día (calculado automáticamente)
        - advancedDays: array de { date, hours, enabled }
        - errors: objeto con errores de validación por modo
      - **Props:**
        - request: objeto de la solicitud con estimatedHours
        - user: miembro del equipo seleccionado
        - initialDate: fecha donde se hizo el drop (formato YYYY-MM-DD)
        - onConfirm: callback con array de asignaciones a crear
        - onClose: callback para cerrar modal

    - **WeeklyCalendarGrid.jsx (modificado):**
      - Grid semanal de lunes a viernes
      - Drag & drop para asignar tareas
      - Muestra asignaciones existentes por día y usuario
      - onDrop callback: `(request, memberId, dateStr)`
      - Parseo correcto de fechas para mostrar asignaciones en día correcto

    - **index.jsx (Capacity Planning Workspace - modificaciones críticas):**
      - **Fix 1: Carga de datos con parseo correcto de fechas:**
        ```javascript
        const transformed = (assignmentsData.data || []).map(a => {
          // Parsear fecha evitando timezone issues
          const assignedDate = new Date(a.assignedDate);
          const year = assignedDate.getFullYear();
          const month = String(assignedDate.getMonth() + 1).padStart(2, '0');
          const day = String(assignedDate.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;

          return {
            id: a.id,
            requestId: a.request.id,
            requestTitle: a.request.title,
            memberId: a.user.id,
            date: dateStr, // Formato consistente YYYY-MM-DD
            hours: a.allocatedHours,
            // ... otros campos
          };
        });
        ```
      - **Fix 2: Cálculo correcto de requests sin asignar:**
        ```javascript
        // Calcular horas asignadas por request (suma de TODAS las asignaciones)
        const assignedHoursByRequest = {};
        transformed.forEach(assignment => {
          if (!assignedHoursByRequest[assignment.requestId]) {
            assignedHoursByRequest[assignment.requestId] = 0;
          }
          assignedHoursByRequest[assignment.requestId] += assignment.hours;
        });

        // Filtrar requests que NO están completamente asignados
        const unassigned = planifiableRequests.filter(request => {
          const assignedHours = assignedHoursByRequest[request.id] || 0;
          return assignedHours < request.estimatedHours;
        });
        ```
      - **Fix 3: Actualización correcta después de crear asignaciones:**
        ```javascript
        // Agregar nuevas asignaciones al estado
        const updatedAssignments = [...assignments, ...newAssignments];
        setAssignments(updatedAssignments);

        // Recalcular TOTAL de horas para el request (incluyendo previas)
        const totalAssignedForRequest = updatedAssignments
          .filter(a => a.requestId === pendingAssignment.request.id)
          .reduce((sum, a) => sum + a.hours, 0);

        // Remover de unassigned solo si está completamente asignado
        if (totalAssignedForRequest >= pendingAssignment.request.estimatedHours) {
          setUnassignedRequests(
            unassignedRequests.filter(r => r.id !== pendingAssignment.request.id)
          );
        }
        ```
      - **Estados:**
        - weekStart: fecha de inicio de semana (lunes)
        - unassignedRequests: solicitudes pendientes de asignación completa
        - assignments: todas las asignaciones de la semana
        - pendingAssignment: { request, member, date } para modal
        - showDistributionModal: boolean

    - **AssignmentDetailsModal.jsx (modificado):**
      - **Detección de tareas fraccionadas:**
        ```javascript
        const relatedAssignments = allAssignments?.filter(a =>
          a.requestId === assignment.requestId
        ) || [];
        const isFragmented = relatedAssignments.length > 1;
        const totalAssignedHours = relatedAssignments.reduce((sum, a) =>
          sum + a.hours, 0
        );
        ```
      - **Warning badge para tareas fraccionadas:**
        - Ícono AlertTriangle con fondo warning/10
        - Muestra cantidad de asignaciones y total de horas
        - Texto: "Esta tarea tiene X asignaciones distribuidas en diferentes días"
      - **Confirmación antes de eliminar (solo si fraccionada):**
        - Modal superpuesto con advertencia detallada
        - Muestra cuántas horas quedarán después de eliminar esta asignación
        - Botón "Eliminar de Todos Modos" (variant=danger)
        - Informa que la tarea volverá a "Sin Asignar" si quedan horas pendientes
      - **Campos editables:**
        - Horas asignadas (Input type=number, min=0, max=24, step=0.5)
        - Notas (textarea con placeholder)
      - **Información mostrada:**
        - Título del request, nombre del usuario, fecha
        - Tipo de solicitud, prioridad
        - Estimación original vs horas actuales
        - Estado de la asignación

- ✅ **Debugging Extensivo de Timezone:**
  - **Problema 1: "Dom, 11 ene" aparecía en lugar de "Lun, 12 ene"**
    - **User feedback:** "estas colocando como primer dia el domingo y el domingo es no laboral"
    - **Causa:** `new Date("2026-01-12")` interpreta string como UTC midnight
    - **En GMT-5:** UTC 2026-01-12 00:00 = Local 2026-01-11 19:00 (día anterior)
    - **Fix:** Parseo manual en toda la inicialización de `advancedDays`

  - **Problema 2: Modal mostraba fecha correcta internamente pero incorrecta en UI**
    - **User feedback:** Logs mostraban "2026-01-13" pero UI mostraba "dom, 11 ene"
    - **Causa:** JSX usaba `new Date(day.date).toLocaleDateString()` re-introduciendo el problema
    - **Fix:** Parseo manual ANTES de cada `.toLocaleDateString()` en JSX

  - **Problema 3: "Hago drag al miércoles y graba el martes"**
    - **User feedback:** "hago el drag hacia el miercoles y graba la tarea el martes, todas las graba un dia antes"
    - **Causa:** Uso de `Date.UTC(year, month, day)` al crear payload
    - **Fix:** Usar `new Date(year, month - 1, day, 12, 0, 0)` (mediodía local)

  - **Problema 4: Asignación aparecía en día correcto pero también en "Sin Asignar"**
    - **User feedback:** "cuando hago el F5 una de las asignaciones que ya estaba no aparecio... y la del martes aparece en asignada y por asignar"
    - **Causa 1:** Mismo issue de timezone en carga inicial de datos
    - **Causa 2:** Lógica de filtrado no calculaba total de horas correctamente
    - **Fix:** Aplicar parseo manual en transformación + cálculo correcto de totales

  - **Resultado:** Patrón de parseo manual aplicado en 8 lugares diferentes del código

- ✅ **Mejoras de UX:**
  - **Mensajes de error claros:**
    - "⚠️ El total de Xh excede las Yh estimadas para esta tarea"
    - "Cannot allocate Xh. User has Yh available for [fecha]"
  - **Warning de eliminación inteligente:**
    - Solo aparece si la tarea está fraccionada (múltiples días)
    - Muestra impacto de eliminar: "quedarán Xh asignadas en los otros días"
  - **Validación en tiempo real:**
    - Errores se muestran al cambiar valores
    - Botón "Asignar" deshabilitado si hay errores
  - **Estados visuales:**
    - Request completamente asignado → desaparece de "Sin Asignar"
    - Request parcialmente asignado → permanece en "Sin Asignar"
    - Badge de warning amarillo para tareas fraccionadas

- ✅ **Archivos Creados:**
  - `frontend/src/pages/capacity-planning-workspace/components/AssignmentDistributionModal.jsx` (NEW - componente complejo, ~400 líneas)

- ✅ **Archivos Modificados:**
  - `backend/prisma/schema.prisma` (modelo Assignment)
  - `backend/src/modules/assignments/assignments.service.ts` (lógica de negocio completa)
  - `backend/src/modules/assignments/assignments.controller.ts` (9 endpoints)
  - `backend/src/modules/assignments/assignments.routes.ts` (rutas)
  - `backend/src/modules/assignments/assignments.types.ts` (tipos TypeScript)
  - `frontend/src/pages/capacity-planning-workspace/index.jsx` (3 fixes críticos)
  - `frontend/src/pages/capacity-planning-workspace/components/AssignmentDetailsModal.jsx` (warning de fragmentación)
  - `frontend/src/pages/capacity-planning-workspace/components/WeeklyCalendarGrid.jsx` (parseo de fechas)
  - `frontend/src/services/assignmentService.js` (cliente API)

- ✅ **Patrón Técnico Documentado - Manejo de Fechas sin Timezone:**
  - **Regla de oro:** NUNCA usar `new Date(stringISO)` directamente para fechas "date-only"
  - **Patrón correcto:**
    1. Parse manual: `const [y, m, d] = str.split('-').map(Number)`
    2. Crear local: `new Date(y, m - 1, d)` o `new Date(y, m - 1, d, 12, 0, 0)`
    3. Formatear: `toLocaleDateString()`, `toISOString()`, etc.
  - **Aplicar en:**
    - Inicialización de estado con fechas
    - Renderizado de fechas en JSX
    - Creación de payloads para backend
    - Parseo de respuestas del backend
  - **Evitar:**
    - `new Date("YYYY-MM-DD")` sin parseo manual
    - `Date.UTC()` para fechas locales
    - `.toISOString().split('T')[0]` sin parseo previo

- ✅ **Características del Sistema:**
  - **Drag & Drop funcional:** Arrastrar request desde "Sin Asignar" a celda de calendario
  - **Distribución flexible:** Quick (automática) o Advanced (manual por día)
  - **Validación de capacidad:** Backend rechaza si se excede capacidad diaria (8h)
  - **Tareas multi-día:** Una tarea puede fraccionarse en múltiples días
  - **Tracking de progreso:** Request desaparece de "Sin Asignar" cuando está 100% asignado
  - **Gestión de fragmentación:** Warnings claros al eliminar parte de tarea distribuida
  - **Sincronización correcta:** F5 mantiene datos consistentes (assignments + unassigned)

- ✅ **Proceso de Testing Iterativo (5 rondas de fixes):**
  1. **Ronda 1:** Fix de inicialización de días (domingo → lunes)
  2. **Ronda 2:** Fix de renderizado en JSX (display incorrecto)
  3. **Ronda 3:** Fix de guardado (día anterior en BD)
  4. **Ronda 4:** Fix de sincronización (duplicados después de F5)
  5. **Ronda 5:** Fix de validaciones y warnings (UX final)

- **Resultado:**
  - ✅ Sistema de planificación completamente funcional
  - ✅ Drag & drop sin errores de timezone
  - ✅ Distribución rápida y avanzada trabajando correctamente
  - ✅ Validaciones robustas backend y frontend
  - ✅ UX clara con mensajes de error y advertencias
  - ✅ Código mantenible con patrón documentado para fechas

- **Commit realizado:**
  ```
  feat: Implementar Planificador de Capacidad con distribución de tareas

  Backend:
  - Crear módulo completo de Assignments con CRUD y validaciones
  - Implementar validación de capacidad diaria (8h/día máximo)
  - Agregar endpoints de bulk creation para multi-día
  - Crear queries especializadas (dateRange, week, user)
  - Implementar cálculo de capacity summary semanal

  Frontend:
  - Desarrollar AssignmentDistributionModal con dos modos
  - Implementar WeeklyCalendarGrid con drag & drop funcional
  - Agregar validaciones de timezone para fechas correctas
  - Crear sistema de warnings para tareas fraccionadas
  - Implementar sincronización correcta de requests asignados/sin asignar

  Fixes críticos de timezone (5 rondas):
  - Fix inicialización de días (domingo → lunes)
  - Fix renderizado de fechas en JSX
  - Fix guardado con día correcto (no día anterior)
  - Fix sincronización después de F5
  - Fix validaciones y mensajes de error

  Patrón establecido: Parseo manual de fechas en lugar de UTC

  Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
  ```

- ⏱️ Tiempo: ~6 horas (incluye 5 rondas de debugging de timezone + validaciones + warnings)

---

## 16 de Enero 2026 - 17:00: Integración Completa Planificador ↔ Gestión de Solicitudes + Mejoras UX

### 🎯 Objetivo
Integrar completamente el Planificador de Capacidad con la Gestión de Solicitudes para que las asignaciones se reflejen automáticamente, mejorar la experiencia de usuario del planificador y corregir el sistema de filtros.

### ✅ Características Implementadas

#### 1. Integración Planificador ↔ Gestión de Solicitudes
**Backend (assignments.service.ts):**
- **Cambio automático de estado:** Al crear una asignación, el request cambia automáticamente de `INTAKE`/`BACKLOG` a `IN_PROGRESS`
- **Activity Logs completo:** Registro de todas las operaciones de asignaciones:
  - CREATE: "X fue asignado a la tarea 'Y' (Zh)"
  - UPDATE: "Se actualizó la asignación de X en 'Y' (cambios específicos)"
  - DELETE: "Se eliminó la asignación de X de la tarea 'Y'"
  - Bulk: "X fue asignado a la tarea 'Y' (N días, Zh total)"
- **Sincronización Socket.io:** Eventos `request:updated` para actualización en tiempo real
- **Metadatos detallados:** Cada log incluye requestId, userId, horas, fechas, etc.

**Frontend (RequestTable.jsx):**
- **Avatares con iniciales:** Mostrar usuarios asignados con sus iniciales (ej: "AR" para Ana Rodríguez)
- **Cálculo de iniciales:** Primera letra nombre + primera letra apellido
- **Fix de datos:** Corregir acceso a `assignmentsData.data` en lugar de `assignmentsData.data.assignments`
- **Estilo mejorado:** Avatares con fondo `bg-primary/10` y texto `text-primary`

#### 2. Mejoras al Planificador de Capacidad

**Colores de Barras de Capacidad:**
- **Función unificada:** `getCapacityBarColor(percentage)` para consistencia
- **Rangos corregidos:**
  - Verde (Disponible): < 60%
  - Accent (Cerca de Capacidad): 60-79%
  - Amarillo (Alta Utilización): 80-99%
  - Rojo (Sobrecargado): ≥ 100%
- **Aplicado en:** Barras diarias, barras semanales, texto de porcentaje

**Layout y Visualización:**
- **Columnas uniformes:** `table-layout: fixed` con `<colgroup>` para anchos iguales
- **Ancho fijo columna miembros:** 220px
- **Distribución proporcional:** Los 5 días se distribuyen el espacio restante uniformemente

**Panel de Detalles de Miembro:**
- **Oculto por defecto:** Panel no aparece al cargar la página
- **Click en nombre:** Hacer clic en el nombre del miembro muestra el panel
- **Botón cerrar funcional:** `type="button"` + `stopPropagation()` + validación `onClose`
- **Datos reales:** Capacidad, utilización %, email, estado, habilidades
- **Eliminado useEffect:** Quitado auto-selección del primer miembro

**UI Simplificada:**
- **Eliminados botones:** "Guardar Escenario", "Sugerencias", "Cargar escenario"
- **Limpieza de código:** Removidas funciones y estado relacionados (`scenarios`, `handleSaveScenario`, `handleLoadScenario`)

#### 3. Sistema de Filtros Corregido

**Mapeo correcto Backend ↔ Frontend:**
```javascript
// Tipos
PRODUCT_FEATURE → "Producto"
CUSTOMIZATION → "Personalización"
BUG → "Error"
SUPPORT → "Soporte"
INFRASTRUCTURE → "Infraestructura"

// Prioridades
CRITICAL → "Crítico"
HIGH → "Alto"
MEDIUM → "Medio"
LOW → "Bajo"
```

**Funciones Helper:**
- `getTypeLabel(type)`: Convierte códigos del backend a etiquetas en español
- `getPriorityLabel(priority)`: Convierte códigos de prioridad a español
- `getTypeStyle(type)`: Actualizado con códigos correctos
- `getPriorityStyle(priority)`: Actualizado con códigos correctos

**Filtrado Completo:**
- **Solicitudes sin asignar:** Filtradas en `UnassignedRequestQueue`
- **Asignaciones en calendario:** Filtradas en el componente principal con `getFilteredAssignments()`
- **Estadísticas de capacidad:** Recalculadas solo con asignaciones filtradas
- **Indicador visual:** Badge "Filtros activos" cuando hay filtros aplicados
- **Filtro de equipo eliminado:** Solo Tipo y Prioridad

#### 4. Exportación a Excel

**Implementación (WeeklyCalendarGrid.jsx):**
- **Librería:** `xlsx` (ya instalada)
- **Estructura de datos:**
  - Columna 1: Nombre del miembro
  - Columna 2: Capacidad semanal
  - Columnas 3-7: Asignaciones por día (Lun-Vie)
  - Columna 8: Total asignado
  - Columna 9: Horas disponibles
  - Columna 10: Utilización (%)

**Formato profesional:**
- **Encabezados:** Negrita, centrados, con fondo de color
- **Anchos de columna:** Ajustados automáticamente (`wch`)
- **Múltiples tareas por día:** Separadas con saltos de línea
- **Nombre de archivo dinámico:** `Planning_DD-MMM_al_DD-MMM.xlsx`

**Ejemplo de archivo generado:**
```
Planning_16-ene_al_20-ene.xlsx
```

#### 5. Scripts y Correcciones

**Script fix-request-statuses.ts:**
- **Propósito:** Corregir requests con asignaciones pero en estado INTAKE/BACKLOG
- **Ubicación:** `backend/src/scripts/fix-request-statuses.ts`
- **Funcionalidad:**
  - Busca requests con asignaciones
  - Identifica los que están en INTAKE o BACKLOG
  - Los actualiza a IN_PROGRESS
  - Muestra log detallado de cambios
- **Ejecución:** `npx tsx src/scripts/fix-request-statuses.ts`
- **Resultados:** 2 requests corregidos (REQ-1003, REQ-1005)

### 🔧 Detalles Técnicos

#### Activity Logs Integration
```typescript
// Registro en creación de asignación
await ActivityLogsService.create({
  userId: user.id,
  userName: user.name,
  userEmail: user.email,
  action: 'CREATE',
  entity: 'ASSIGNMENT',
  entityId: assignment.id,
  description: `${user.name} fue asignado a la tarea "${request.title}" (${data.allocatedHours}h)`,
  metadata: {
    requestId: request.id,
    requestTitle: request.title,
    userId: user.id,
    userName: user.name,
    allocatedHours: data.allocatedHours,
    assignedDate: assignedDate.toISOString(),
  },
  ipAddress: '',
  userAgent: '',
});
```

#### Filtrado de Asignaciones
```javascript
const getFilteredAssignments = () => {
  return assignments.filter(assignment => {
    // Filtro por tipo
    if (filters.type !== 'all' && assignment.requestType !== filters.type) {
      return false;
    }

    // Filtro por prioridad
    if (filters.priority !== 'all' && assignment.priority !== filters.priority) {
      return false;
    }

    return true;
  });
};
```

#### Avatares con Iniciales
```javascript
const nameParts = user?.name?.split(' ') || [];
const initials = nameParts.length >= 2
  ? `${nameParts[0]?.charAt(0)}${nameParts[1]?.charAt(0)}`.toUpperCase()
  : nameParts[0]?.charAt(0)?.toUpperCase() || '?';
```

#### Exportación a Excel
```javascript
const handleExport = () => {
  const data = [];

  // Encabezados
  const headers = ['Miembro del Equipo', 'Capacidad Semanal'];
  weekDays.forEach(day => {
    headers.push(day.toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'short' }));
  });
  headers.push('Total Asignado', 'Disponible', 'Utilización (%)');
  data.push(headers);

  // Datos por miembro
  teamMembers.forEach(member => {
    const row = [member.name, `${member.capacity}h`];
    // ... agregar días y estadísticas
    data.push(row);
  });

  // Crear y descargar archivo
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Planning Semanal');
  XLSX.writeFile(wb, fileName);
};
```

### 📊 Impacto

**Integración Backend ↔ Frontend:**
- ✅ Asignaciones del planificador reflejadas automáticamente en gestión de solicitudes
- ✅ Estados actualizados sin intervención manual
- ✅ Trazabilidad completa en Activity Logs
- ✅ Sincronización en tiempo real

**Mejoras de UX:**
- ✅ Colores consistentes en todo el sistema
- ✅ Columnas uniformes para mejor legibilidad
- ✅ Panel de detalles solo cuando se necesita (más espacio)
- ✅ Filtros funcionando correctamente
- ✅ Exportación profesional a Excel

**Calidad de Datos:**
- ✅ Script de corrección para datos históricos
- ✅ Validación automática de estados
- ✅ Mapeo correcto de enums del backend

### 📝 Archivos Modificados

**Backend:**
- `src/modules/assignments/assignments.service.ts` - Integración con Activity Logs y cambio de estado
- `src/scripts/fix-request-statuses.ts` - Script de corrección (nuevo)

**Frontend - Planificador:**
- `pages/capacity-planning-workspace/index.jsx` - Filtrado y eliminación de funciones innecesarias
- `pages/capacity-planning-workspace/components/FilterToolbar.jsx` - Corrección de valores y eliminación de filtro de equipo
- `pages/capacity-planning-workspace/components/UnassignedRequestQueue.jsx` - Mapeo correcto de enums y etiquetas
- `pages/capacity-planning-workspace/components/WeeklyCalendarGrid.jsx` - Colores, columnas, exportación a Excel
- `pages/capacity-planning-workspace/components/TeamMemberPanel.jsx` - Panel oculto por defecto y datos reales

**Frontend - Gestión de Solicitudes:**
- `pages/request-management-center/index.jsx` - Fix de acceso a datos de asignaciones
- `pages/request-management-center/components/RequestTable.jsx` - Avatares con iniciales

### 🎓 Lecciones Aprendidas

1. **Sincronización de Enums:** Importante mapear correctamente los enums del backend (CRITICAL, HIGH, BUG) con las etiquetas del frontend (Crítico, Alto, Error)

2. **Estructura de Respuestas:** Verificar la estructura exacta de las respuestas del backend (`data` vs `data.assignments`)

3. **Cálculo de Iniciales:** Considerar casos edge (nombres sin apellido, nombres vacíos)

4. **Table Layout Fixed:** Esencial para columnas uniformes, requiere usar `<colgroup>` para control preciso

5. **Activity Logs:** Incluir metadatos ricos para mejor trazabilidad

6. **Scripts de Corrección:** Útiles para corregir datos históricos cuando se implementan nuevas reglas de negocio

### ⏱️ Resumen de Tareas

- Integración Planificador ↔ Gestión de Solicitudes: ~2 horas
- Mejoras visuales y UX del Planificador: ~1.5 horas
- Corrección del sistema de filtros: ~1 hora
- Implementación de exportación a Excel: ~45 minutos
- Script de corrección y testing: ~45 minutos

**Total:** ~6 horas

---

**Última actualización:** 16 de Enero 2026 - 17:00
**Desarrollado por:** Claude Code + Usuario
