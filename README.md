# IPTEGRA NEXUS - FULL STACK
## Sistema de Gestión de Proyectos y Capacidad

**Versión:** 1.0.0  
**Fecha:** Enero 2025  
**Stack:** PostgreSQL + Node.js/Express + React/Vite

---

## 📦 CONTENIDO DEL PAQUETE

```
iptegra-nexus-full/
├── backend/                    # API REST + Socket.io
│   ├── src/
│   │   ├── config/            # ✅ LISTO - Configuración y DB
│   │   ├── middlewares/       # ✅ LISTO - Auth, validación, errores
│   │   ├── utils/             # ✅ LISTO - JWT, email, IA, hash
│   │   ├── modules/           # ⚠️ GENERAR CON CLAUDE CODE
│   │   ├── app.ts             # ⚠️ GENERAR CON CLAUDE CODE
│   │   └── server.ts          # ⚠️ GENERAR CON CLAUDE CODE
│   ├── prisma/
│   │   └── schema.prisma      # ✅ LISTO - Schema completo
│   ├── .env.example           # ✅ LISTO - Variables de entorno
│   ├── package.json           # ✅ LISTO
│   └── tsconfig.json          # ✅ LISTO
│
├── frontend/                   # React + Vite (original de Rocket)
│   ├── src/
│   │   ├── services/          # ⚠️ MODIFICAR (ver guía)
│   │   └── pages/             # ✅ LISTO
│   └── package.json           # ✅ LISTO
│
├── docker-compose.yml          # ✅ LISTO - PostgreSQL + Backend + Frontend
├── FRONTEND_MODIFICACIONES.md  # 📖 GUÍA COMPLETA - LEER PRIMERO
├── MEGA_PROMPT_CLAUDE_CODE.md  # 🤖 Prompt para generar backend
└── README.md                   # 📖 Este archivo

```

---

## 🚀 QUICK START

### Opción 1: Docker (Recomendado)

```bash
# 1. Configurar variables de entorno
cd backend
cp .env.example .env
# Edita .env con tus valores

# 2. Levantar todo con Docker
cd ..
docker-compose up -d

# 3. Backend correrá en http://localhost:3001
# 4. Frontend correrá en http://localhost:5173
# 5. PostgreSQL en localhost:5432
```

### Opción 2: Manual (Desarrollo)

**Terminal 1 - Base de datos:**
```bash
docker run -d \
  --name nexus-postgres \
  -e POSTGRES_USER=nexus \
  -e POSTGRES_PASSWORD=nexus_password \
  -e POSTGRES_DB=nexus_db \
  -p 5432:5432 \
  postgres:15-alpine
```

**Terminal 2 - Backend:**
```bash
cd backend

# Instalar dependencias
npm install

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Seed inicial
npx prisma db seed

# Iniciar en desarrollo
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev
```

---

## ⚙️ CONFIGURACIÓN INICIAL

### 1. Backend (.env)

```env
# Database
DATABASE_URL=postgresql://nexus:nexus_password@localhost:5432/nexus_db

# JWT
JWT_SECRET=your-super-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here

# AI (Elige uno o ambos)
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-your-key-here
# OPENAI_API_KEY=sk-your-key-here

# Email (opcional pero recomendado)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ENABLE_EMAIL_NOTIFICATIONS=true

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 2. Frontend (.env)

Crear `.env` en la carpeta `frontend`:

```env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

---

## 📝 PASOS PARA COMPLETAR EL SETUP

### PASO 1: Generar Backend con Claude Code ⚠️ IMPORTANTE

El backend tiene la estructura base pero **FALTA GENERAR LOS MÓDULOS**.

**Usa Claude Code para generarlos:**

```bash
cd backend

# Opción A: Usar Claude Code directamente
# Copia el contenido de MEGA_PROMPT_CLAUDE_CODE.md
# Pégalo en Claude Code y deja que genere todo

# Opción B: Si tienes Claude CLI
claude-code generate --prompt ../MEGA_PROMPT_CLAUDE_CODE.md
```

**Tiempo estimado:** 5-10 minutos con Claude Code

### PASO 2: Modificar Frontend para usar API REST

Sigue la guía en `FRONTEND_MODIFICACIONES.md`:

```bash
cd frontend

# Leer la guía completa
cat ../FRONTEND_MODIFICACIONES.md

# O usar Claude Code para hacer los cambios automáticamente
# Claude puede leer la guía y aplicar todos los cambios
```

**Tiempo estimado:** 30-45 minutos (o 5 minutos con Claude Code)

### PASO 3: Crear Usuario Inicial

```bash
cd backend

# Opción 1: Usar Prisma Studio
npx prisma studio
# Navega a User y crea tu usuario (password debe hashearse)

# Opción 2: Endpoint de registro
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@iptegra.com",
    "password": "admin123",
    "name": "Admin",
    "role": "CEO"
  }'
```

### PASO 4: Verificar que Todo Funciona

```bash
# Backend health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@iptegra.com",
    "password": "admin123"
  }'

# Frontend
open http://localhost:5173
```

---

## 🏗️ ARQUITECTURA

```
┌─────────────┐
│   Browser   │ (React Frontend)
└──────┬──────┘
       │ HTTP / WebSocket
       ▼
┌─────────────────┐
│   Express API   │ (Node.js Backend)
│   + Socket.io   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │ (Base de datos)
└─────────────────┘
```

### Tecnologías

**Backend:**
- Node.js 20+ con TypeScript
- Express.js (API REST)
- Prisma (ORM)
- Socket.io (Real-time)
- JWT (Autenticación)
- Nodemailer (Emails)
- Anthropic/OpenAI (IA)
- Winston (Logging)

**Frontend:**
- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS + shadcn/ui
- Axios (HTTP client)
- Socket.io client
- Redux Toolkit (Estado global)
- Recharts (Gráficas)

**Base de Datos:**
- PostgreSQL 15
- Prisma migrations

---

## 📚 DOCUMENTACIÓN

- **Frontend:** Ver `FRONTEND_MODIFICACIONES.md`
- **Backend:** Ver `backend/README.md`
- **API:** Ver `backend/API_DOCS.md` (después de generar backend)
- **Prisma Schema:** Ver `backend/prisma/schema.prisma`

---

## 🔧 COMANDOS ÚTILES

### Backend

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Start production
npm start

# Prisma
npx prisma studio          # UI para ver DB
npx prisma migrate dev     # Crear migración
npx prisma generate        # Regenerar client
npx prisma db push         # Push schema sin migración
npx prisma db seed         # Ejecutar seed
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

### Docker

```bash
# Levantar todo
docker-compose up -d

# Ver logs
docker-compose logs -f

# Reiniciar servicio
docker-compose restart backend

# Bajar todo
docker-compose down

# Bajar y eliminar volúmenes
docker-compose down -v
```

---

## 🐛 TROUBLESHOOTING

### Backend no inicia

```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# Verificar conexión a DB
npx prisma db pull

# Ver logs
npm run dev
```

### Frontend no conecta con Backend

```bash
# Verificar .env del frontend
cat frontend/.env

# Verificar CORS en backend
# Debe incluir http://localhost:5173 en ALLOWED_ORIGINS

# Verificar que backend esté corriendo
curl http://localhost:3001/health
```

### Socket.io no conecta

```bash
# Verificar que Socket.io esté habilitado en backend
# Ver logs del navegador (F12)

# Verificar token JWT
localStorage.getItem('access_token')
```

### Errores de Prisma

```bash
# Regenerar client
npx prisma generate

# Resetear DB (¡CUIDADO! Borra todo)
npx prisma migrate reset

# Ver schema actual en DB
npx prisma db pull
```

---

## 📊 MÉTRICAS Y MONITORING

El sistema incluye:
- ✅ Logging completo con Winston
- ✅ Health check endpoint
- ✅ Error tracking
- 🔜 Métricas de performance (agregar después)
- 🔜 Sentry integration (opcional)

---

## 🔐 SEGURIDAD

**Implementado:**
- ✅ JWT con refresh tokens
- ✅ Passwords hasheados con bcrypt
- ✅ CORS configurado
- ✅ Helmet.js (security headers)
- ✅ Cookies httpOnly para refresh tokens
- ✅ Rate limiting (configurar en producción)
- ✅ SQL injection prevention (Prisma)

**TODO para producción:**
- [ ] Rate limiting agresivo
- [ ] IP whitelist
- [ ] SSL/TLS certificados
- [ ] Secrets management (AWS Secrets Manager, etc)
- [ ] Audit logging
- [ ] 2FA (opcional)

---

## 🚢 DEPLOYMENT

### Opción 1: VPS Propio

```bash
# En tu servidor
git clone <tu-repo>
cd iptegra-nexus-full

# Setup
cp backend/.env.example backend/.env
# Editar .env con valores de producción

# Docker
docker-compose -f docker-compose.prod.yml up -d

# O manual
cd backend
npm ci --production
npm run build
pm2 start dist/server.js
```

### Opción 2: Railway/Render/DigitalOcean

1. Crear base de datos PostgreSQL
2. Deploy backend (Node.js)
3. Deploy frontend (Static site)
4. Configurar variables de entorno
5. Configurar dominios y SSL

---

## 📞 SOPORTE

**Problemas con el setup:**
- Revisa este README completo
- Lee `FRONTEND_MODIFICACIONES.md`
- Usa Claude Code para ayuda

**Bugs o features:**
- Documenta el problema claramente
- Incluye logs relevantes
- Crea issue con pasos para reproducir

---

## ✅ CHECKLIST PRE-PRODUCCIÓN

- [ ] Todas las variables de entorno configuradas
- [ ] Backend genera código completo con Claude Code
- [ ] Frontend modificado y conectado a API
- [ ] Login/Logout funciona
- [ ] CRUD de requests funciona
- [ ] Real-time updates funcionan
- [ ] Emails de notificación funcionan
- [ ] IA provider configurado y probado
- [ ] Tests básicos pasando
- [ ] SSL configurado
- [ ] Backup de base de datos configurado
- [ ] Monitoring setup

---

**¡ÉXITO! 🎉**

Si llegaste hasta aquí y todo funciona, ¡felicidades! Tienes un sistema completo de gestión de proyectos funcionando.

Para dudas o mejoras, usa Claude Code localmente - él conoce toda la estructura del proyecto.
