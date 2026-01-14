# 🚀 INSTRUCCIONES PARA LEVANTAR IPTEGRA NEXUS

**Guía completa para iniciar el sistema después de apagar el PC o configurarlo desde cero**

---

## 📑 ÍNDICE - ELIGE TU CASO

### 🟢 CASO 1: Solo apagué y prendí el PC
**👉 [IR A INICIO RÁPIDO](#-inicio-rápido---si-solo-se-apagó-el-pc)**
- Tiempo: 2-5 minutos
- Ya tienes todo instalado
- Solo necesitas encender los servicios

### 🔵 CASO 2: PC nuevo, formateado, o primera vez
**👉 [IR A SETUP COMPLETO DESDE CERO](#️-setup-completo-desde-cero)**
- Tiempo: 20-30 minutos
- Instalar todo desde cero
- Configurar base de datos y dependencias

---

## ⚡ INICIO RÁPIDO - SI SOLO SE APAGÓ EL PC

**Si ya tienes todo instalado y solo apagaste/prendiste el PC, sigue estos pasos:**

### 🎬 GUÍA VISUAL PASO A PASO

```
┌─────────────────────────────────────────────────────────────┐
│  1️⃣  DOCKER          →  docker start nexus-postgres       │
│  2️⃣  BACKEND         →  cd backend && npm run dev         │
│  3️⃣  FRONTEND        →  cd frontend && npm start          │
│  4️⃣  NAVEGADOR       →  http://localhost:4028             │
└─────────────────────────────────────────────────────────────┘
```

**⏱️ Tiempo total: 2-5 minutos**

---

### 1. Iniciar PostgreSQL (Base de Datos)

#### Si usas Docker:
```bash
# Abrir terminal (cmd, PowerShell, o terminal de VS Code)
docker start nexus-postgres

# Verificar que está corriendo:
docker ps
# Debe aparecer "nexus-postgres" en la lista
```

#### Si PostgreSQL está instalado localmente:
```bash
# Windows: Buscar "Servicios" en el menú inicio
# Verificar que el servicio "postgresql-x64-14" está en estado "Iniciado"
# Si no está iniciado, click derecho > Iniciar

# Alternativamente, verificar desde terminal:
psql -U nexus -d nexus_db -h localhost -p 5435
# Ingresa password: nexus_password
# Si conecta, está funcionando. Escribe \q para salir.
```

### 2. Iniciar Backend

```bash
# Abrir terminal 1
cd C:\Users\Usuario\Documents\DEV\nexus\iptegra-nexus-full\backend

# Levantar servidor backend
npm run dev

# ✅ Debe mostrar:
# Server running on http://localhost:3001
# Database connected successfully
```

### 3. Iniciar Frontend

```bash
# Abrir terminal 2 (nueva)
cd C:\Users\Usuario\Documents\DEV\nexus\iptegra-nexus-full\frontend

# Levantar servidor frontend
npm start

# ✅ Debe mostrar:
# VITE ready in XXX ms
# Local: http://localhost:4028
```

### 4. Verificar que funciona

```bash
# Abrir navegador en:
http://localhost:4028

# Hacer login con:
Email: admin@iptegra.com
Password: admin123

# ✅ Si entra al dashboard, todo está funcionando correctamente
```

---

## 🔧 SI ALGO NO FUNCIONA AL INICIAR

### Problema: Docker no inicia
```bash
# Abrir Docker Desktop manualmente desde el menú inicio
# Esperar a que cargue completamente (icono de Docker en la bandeja del sistema)
# Luego ejecutar:
docker start nexus-postgres
```

### Problema: Backend da error de conexión a base de datos
```bash
# Verificar que PostgreSQL está corriendo:
docker ps

# Si no aparece, iniciarlo:
docker start nexus-postgres

# Esperar 5 segundos y reintentar levantar backend:
cd backend
npm run dev
```

### Problema: Puerto 3001 o 4028 ocupado
```bash
# Cerrar todas las terminales abiertas previamente
# Buscar procesos en el puerto:
netstat -ano | findstr :3001
netstat -ano | findstr :4028

# Matar proceso (reemplazar <PID> con el número obtenido):
taskkill /PID <PID> /F

# Reintentar levantar los servidores
```

---

## 📝 RESUMEN - COMANDOS RÁPIDOS DIARIOS

### 🎯 COPIAR Y PEGAR - INICIO EN 3 PASOS

**Cada vez que enciendas el PC y quieras trabajar:**

#### Paso 1: Abrir VS Code en el proyecto
```bash
# Abrir VS Code desde terminal:
cd C:\Users\Usuario\Documents\DEV\nexus\iptegra-nexus-full
code .

# O abrir VS Code manualmente y luego File > Open Folder > seleccionar iptegra-nexus-full
```

#### Paso 2: Terminal 1 - Docker + Backend
```bash
docker start nexus-postgres && cd backend && npm run dev
```

#### Paso 3: Terminal 2 - Frontend (abrir nueva terminal en VS Code: Ctrl + Shift + `)
```bash
cd frontend && npm start
```

#### Paso 4: Abrir navegador
```
http://localhost:4028
```

---

### 🛑 AL TERMINAR DE TRABAJAR (opcional)

```bash
# En cada terminal, presionar: Ctrl + C

# Opcional - Detener Docker para liberar recursos:
docker stop nexus-postgres
```

---

### 💡 ATAJOS ÚTILES

**VS Code:**
- `Ctrl + Shift + ` ` - Abrir nueva terminal
- `Ctrl + C` - Detener servidor en terminal activa
- `Ctrl + ~` - Cambiar entre terminales

**Navegador:**
- `Ctrl + Shift + R` - Refrescar sin caché
- `F12` - Abrir DevTools (para ver errores)
- `Ctrl + Shift + Delete` - Limpiar caché

---

---

# 🛠️ SETUP COMPLETO DESDE CERO

**⚠️ SOLO NECESITAS ESTA SECCIÓN SI:**
- Formateaste/reseteaste el PC
- Es una nueva máquina
- Borraste el proyecto
- Nunca has configurado el proyecto antes

**Si solo apagaste y prendiste el PC, ve a la sección "INICIO RÁPIDO" arriba ⬆️**

---

## 📋 REQUISITOS PREVIOS

### 1. Instalar Node.js (v18 o superior)
```bash
# Descargar desde: https://nodejs.org/
# Verificar instalación:
node --version
npm --version
```

### 2. Instalar PostgreSQL (v14 o superior)
```bash
# Opción 1: Descargar instalador
# https://www.postgresql.org/download/

# Opción 2: Usar Docker (recomendado)
# Instalar Docker Desktop: https://www.docker.com/products/docker-desktop/
```

### 3. Instalar Git (opcional pero recomendado)
```bash
# Descargar desde: https://git-scm.com/downloads
# Verificar instalación:
git --version
```

### 4. Editor de código
- Visual Studio Code (recomendado): https://code.visualstudio.com/

---

## 🗄️ PASO 1: CONFIGURAR BASE DE DATOS

### Opción A: PostgreSQL con Docker (RECOMENDADO)

```bash
# 1. Levantar contenedor de PostgreSQL
docker run --name nexus-postgres \
  -e POSTGRES_DB=nexus_db \
  -e POSTGRES_USER=nexus \
  -e POSTGRES_PASSWORD=nexus_password \
  -p 5435:5432 \
  -d postgres:14

# 2. Verificar que el contenedor está corriendo
docker ps

# 3. Para detener el contenedor (cuando no lo uses)
docker stop nexus-postgres

# 4. Para iniciar el contenedor de nuevo
docker start nexus-postgres

# 5. Para conectarse a la base de datos
docker exec -it nexus-postgres psql -U nexus -d nexus_db
```

### Opción B: PostgreSQL instalado localmente

```bash
# 1. Durante la instalación, configurar:
Puerto: 5435
Usuario: nexus
Password: nexus_password
Base de datos: nexus_db

# 2. Verificar que PostgreSQL está corriendo
# Windows: Buscar "Servicios" y verificar que "postgresql-x64-14" está activo
# Alternativamente:
psql -U nexus -d nexus_db -h localhost -p 5435
# Ingresar password cuando lo pida: nexus_password
```

---

## 📁 PASO 2: UBICAR EL PROYECTO

```bash
# El proyecto está en:
C:\Users\Usuario\Documents\DEV\nexus\iptegra-nexus-full\

# Abrir terminal en esa ubicación o navegar:
cd C:\Users\Usuario\Documents\DEV\nexus\iptegra-nexus-full
```

**Estructura esperada:**
```
iptegra-nexus-full/
├── backend/
├── frontend/
├── PROYECTO_RESUMEN.md
├── INSTRUCCIONES_SETUP_DESDE_CERO.md
└── (otros archivos de documentación)
```

---

## ⚙️ PASO 3: CONFIGURAR BACKEND

### 3.1 Navegar a la carpeta backend
```bash
cd backend
```

### 3.2 Instalar dependencias
```bash
npm install
```

### 3.3 Verificar archivo .env
Asegurarse de que existe el archivo `backend/.env` con el siguiente contenido:

```env
# SERVIDOR
NODE_ENV=development
PORT=3001
API_PREFIX=/api

# BASE DE DATOS
DATABASE_URL=postgresql://nexus:nexus_password@localhost:5435/nexus_db?schema=public

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:4028
ALLOWED_ORIGINS=http://localhost:4028,http://localhost:5173,http://localhost:3000

# IA (Anthropic Claude)
AI_PROVIDER=claude
ANTHROPIC_API_KEY=your-anthropic-api-key-here
ANTHROPIC_MODEL=claude-sonnet-4-20250514

# NOTIFICACIONES
ENABLE_EMAIL_NOTIFICATIONS=true
NOTIFICATION_ADMIN_EMAILS=lramirez@mawi.chat
```

**⚠️ IMPORTANTE:** Si el archivo no existe, crearlo manualmente con el contenido anterior.

### 3.4 Ejecutar migraciones de Prisma
```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones (crea todas las tablas)
npx prisma migrate dev

# Si hay problemas, resetear la base de datos:
npx prisma migrate reset --force
```

### 3.5 Ejecutar seed (datos iniciales)
```bash
npx prisma db seed
```

**Esto creará:**
- 5 usuarios de prueba (admin@iptegra.com, dev1@iptegra.com, etc.)
- 5 roles del sistema (CEO, DEV_DIRECTOR, FULLSTACK, BACKEND, FRONTEND)
- Permisos predefinidos para cada rol

### 3.6 Verificar usuarios creados (opcional)
```bash
node check-users.js
```

### 3.7 Levantar el servidor backend
```bash
npm run dev
```

**✅ Backend debe estar corriendo en:** http://localhost:3001

**Verificar en el navegador:**
- http://localhost:3001/health (debe devolver {"status":"ok"})

---

## 🎨 PASO 4: CONFIGURAR FRONTEND

### 4.1 Abrir NUEVA terminal y navegar a frontend
```bash
cd C:\Users\Usuario\Documents\DEV\nexus\iptegra-nexus-full\frontend
```

### 4.2 Instalar dependencias
```bash
npm install
```

### 4.3 Verificar archivo .env
Asegurarse de que existe el archivo `frontend/.env` con el siguiente contenido:

```env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

**⚠️ IMPORTANTE:** Si el archivo no existe, crearlo manualmente.

### 4.4 Levantar el servidor frontend
```bash
npm start
```

**✅ Frontend debe estar corriendo en:** http://localhost:4028

---

## 🔍 PASO 5: VERIFICAR QUE TODO FUNCIONA

### 5.1 Abrir el navegador
```
URL: http://localhost:4028
```

### 5.2 Hacer login con credenciales de prueba

| Email | Password | Rol |
|-------|----------|-----|
| admin@iptegra.com | admin123 | CEO |
| dev1@iptegra.com | dev123 | Director de Desarrollo |
| dev2@iptegra.com | dev123 | Desarrollador Full Stack |
| dev3@iptegra.com | dev123 | Desarrollador Backend |
| dev4@iptegra.com | dev123 | Desarrollador Frontend |

### 5.3 Verificar funcionalidades principales

#### ✅ Autenticación
- Login debe funcionar sin errores
- Debe redirigir al Dashboard Ejecutivo

#### ✅ Navegación
- Menú lateral debe mostrar todas las secciones
- Debe poder navegar a:
  - Dashboard Ejecutivo
  - Centro de Gestión de Solicitudes
  - Planificación de Capacidad
  - OKRs y Roadmap
  - Portafolio de Productos y Clientes
  - **Equipo y Sistema** (Administración)
  - **Registro de Actividades** (Activity Logs)
  - Analytics e Insights

#### ✅ Administración de Equipo y Sistema
```
URL: http://localhost:4028/team-and-system-administration
```

Verificar que se muestran:
- Tabla de usuarios con filtros
- Pestaña de gestión de roles
- Panel lateral de actividades recientes

#### ✅ Registro de Actividades
```
URL: http://localhost:4028/activity-logs
```

Verificar que se muestran:
- Tabla de logs con usuario, acción, entidad
- Filtros avanzados (usuario, acción, entidad, fechas)
- Botón de exportar a Excel/CSV
- IP Address y User Agent capturados

---

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

### Problema 1: Backend no arranca - Error de base de datos

```bash
# Síntoma: Error "Can't reach database server at `localhost:5435`"

# Solución:
# 1. Verificar que PostgreSQL está corriendo
docker ps  # (si usas Docker)

# 2. Si no está corriendo, iniciarlo:
docker start nexus-postgres

# 3. Verificar conexión manual:
psql -U nexus -d nexus_db -h localhost -p 5435
```

### Problema 2: Puerto 3001 ya está en uso

```bash
# Síntoma: Error "EADDRINUSE: address already in use :::3001"

# Solución en Windows:
# 1. Encontrar proceso usando el puerto:
netstat -ano | findstr :3001

# 2. Matar el proceso (reemplazar PID con el número obtenido):
taskkill /PID <PID> /F

# 3. Reintentar levantar backend:
npm run dev
```

### Problema 3: Frontend no conecta con Backend

```bash
# Síntoma: Errores de red en consola del navegador

# Solución:
# 1. Verificar que backend está corriendo:
# Abrir: http://localhost:3001/health

# 2. Verificar CORS en backend/.env:
CORS_ORIGIN=http://localhost:4028

# 3. Verificar frontend/.env:
VITE_API_URL=http://localhost:3001/api

# 4. Reiniciar ambos servidores
```

### Problema 4: Login falla con error 500

```bash
# Síntoma: Error al intentar hacer login

# Solución:
cd backend

# 1. Verificar usuarios en base de datos:
node check-users.js

# 2. Si no hay usuarios, ejecutar seed:
npx prisma db seed

# 3. Si persiste, resetear base de datos:
npx prisma migrate reset --force
npx prisma db seed
```

### Problema 5: Migraciones fallan

```bash
# Síntoma: Errores al ejecutar "npx prisma migrate dev"

# Solución DRÁSTICA (borra todos los datos):
cd backend

# 1. Eliminar carpeta de migraciones
rmdir /s prisma\migrations

# 2. Resetear base de datos completamente
npx prisma migrate reset --force

# 3. Crear nueva migración inicial
npx prisma migrate dev --name init

# 4. Ejecutar seed
npx prisma db seed
```

### Problema 6: Iconos no cargan en el frontend

```bash
# Síntoma: Errores de "Icon not found" en consola

# Solución:
cd frontend

# 1. Verificar que lucide-react está en la versión correcta:
npm list lucide-react
# Debe ser: lucide-react@0.263.1

# 2. Si no es esa versión, reinstalar:
npm uninstall lucide-react
npm install lucide-react@0.263.1

# 3. Reiniciar servidor frontend
```

---

## 🔄 COMANDOS ÚTILES PARA EL DÍA A DÍA

### Iniciar el sistema completo

**Terminal 1 - Backend:**
```bash
cd C:\Users\Usuario\Documents\DEV\nexus\iptegra-nexus-full\backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd C:\Users\Usuario\Documents\DEV\nexus\iptegra-nexus-full\frontend
npm start
```

**Terminal 3 - PostgreSQL (si usas Docker):**
```bash
docker start nexus-postgres
```

### Detener el sistema

```bash
# Backend/Frontend: Ctrl + C en cada terminal

# PostgreSQL (Docker):
docker stop nexus-postgres
```

### Ver logs de la base de datos

```bash
# Con Docker:
docker logs nexus-postgres

# Conectarse a PostgreSQL:
docker exec -it nexus-postgres psql -U nexus -d nexus_db
```

### Resetear base de datos (borra todos los datos)

```bash
cd backend
npx prisma migrate reset --force
npx prisma db seed
```

### Crear nuevo usuario manualmente

```bash
# Conectarse a PostgreSQL:
docker exec -it nexus-postgres psql -U nexus -d nexus_db

# Ejecutar SQL:
INSERT INTO users (id, email, name, password, role, status, capacity, skills, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'nuevo@iptegra.com',
  'Nuevo Usuario',
  '$2b$10$...',  -- Password hasheado (genera con bcrypt)
  'FULLSTACK',
  'ACTIVE',
  40,
  ARRAY['JavaScript', 'React'],
  NOW(),
  NOW()
);
```

---

## 📦 BACKUP Y RESTAURACIÓN

### Hacer backup de la base de datos

```bash
# Con Docker:
docker exec -t nexus-postgres pg_dump -U nexus nexus_db > backup_$(date +%Y%m%d).sql

# Sin Docker:
pg_dump -U nexus -h localhost -p 5435 nexus_db > backup_$(date +%Y%m%d).sql
```

### Restaurar desde backup

```bash
# Con Docker:
docker exec -i nexus-postgres psql -U nexus -d nexus_db < backup_20260108.sql

# Sin Docker:
psql -U nexus -h localhost -p 5435 -d nexus_db < backup_20260108.sql
```

---

## 📚 ARCHIVOS DE REFERENCIA

Después de seguir estas instrucciones, consultar:

- **PROYECTO_RESUMEN.md** - Resumen completo del proyecto, arquitectura, endpoints
- **DYNAMIC_ROLES_SYSTEM.md** - Documentación del sistema de roles
- **FRONTEND_MODIFICACIONES.md** - Historial de cambios en el frontend
- **README.md** - Documentación general del proyecto

---

## ✅ CHECKLIST FINAL

Después de completar todos los pasos, verificar:

- [ ] PostgreSQL corriendo en puerto 5435
- [ ] Backend corriendo en http://localhost:3001
- [ ] Frontend corriendo en http://localhost:4028
- [ ] Login funcional con admin@iptegra.com / admin123
- [ ] Puede navegar a todas las páginas del menú
- [ ] Tabla de usuarios muestra datos
- [ ] Registro de actividades muestra logs
- [ ] IP Address se captura en activity logs
- [ ] Iconos cargan correctamente (sin errores en consola)

---

## 🆘 SOPORTE

Si después de seguir estas instrucciones algo no funciona:

1. **Revisar logs del backend** en la terminal donde corre `npm run dev`
2. **Revisar consola del navegador** (F12) para errores de frontend
3. **Verificar que todos los puertos están libres** (3001, 4028, 5435)
4. **Consultar sección de solución de problemas** más arriba
5. **Resetear todo desde cero** si es necesario (ver Problema 5)

---

**Última actualización:** 8 de Enero 2026
**Versión del documento:** 1.0
**Tiempo estimado de setup:** 20-30 minutos
