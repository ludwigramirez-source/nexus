# ⚡ INICIO RÁPIDO DIARIO - IPTEGRA NEXUS

**Para cuando solo apagaste y prendiste el PC**

---

## 🚀 COMANDOS COPIAR Y PEGAR (Más Rápido)

### Terminal 1 - Backend + Docker
```bash
docker start nexus-postgres && cd C:\Users\Usuario\Documents\DEV\nexus\iptegra-nexus-full\backend && npm run dev
```

### Terminal 2 - Frontend
```bash
cd C:\Users\Usuario\Documents\DEV\nexus\iptegra-nexus-full\frontend && npm start
```

### Navegador
```
http://localhost:4028
```

**Login:**
- Email: `admin@iptegra.com`
- Password: `admin123`

---

## 📋 CHECKLIST RÁPIDO

- [ ] Docker Desktop abierto (si usas Docker)
- [ ] `docker start nexus-postgres` ejecutado
- [ ] Backend corriendo en terminal 1 → http://localhost:3001
- [ ] Frontend corriendo en terminal 2 → http://localhost:4028
- [ ] Login funciona en el navegador

---

## 🎯 PASO A PASO DETALLADO

### 1. Iniciar PostgreSQL

**Si usas Docker:**
```bash
docker start nexus-postgres
docker ps  # Verificar que está corriendo
```

**Si PostgreSQL está instalado:**
```bash
# Windows: Buscar "Servicios" > Verificar "postgresql-x64-14" está iniciado
psql -U nexus -d nexus_db -h localhost -p 5435
```

### 2. Iniciar Backend

```bash
cd C:\Users\Usuario\Documents\DEV\nexus\iptegra-nexus-full\backend
npm run dev

# ✅ Debe mostrar:
# Server running on http://localhost:3001
# Database connected successfully
```

### 3. Iniciar Frontend

```bash
cd C:\Users\Usuario\Documents\DEV\nexus\iptegra-nexus-full\frontend
npm start

# ✅ Debe mostrar:
# VITE ready in XXX ms
# Local: http://localhost:4028
```

### 4. Abrir navegador

```
http://localhost:4028
```

Login: `admin@iptegra.com` / `admin123`

---

## 🐛 PROBLEMAS COMUNES

### Backend no arranca
```bash
# 1. Verificar que Docker está corriendo
docker ps

# 2. Si no aparece nexus-postgres:
docker start nexus-postgres

# 3. Esperar 5 segundos y reintentar backend
cd backend
npm run dev
```

### Puerto 3001 o 4028 ocupado
```bash
# Ver qué proceso usa el puerto:
netstat -ano | findstr :3001
netstat -ano | findstr :4028

# Matar proceso (reemplazar <PID> con el número):
taskkill /PID <PID> /F

# Reintentar levantar servidor
```

### Frontend no conecta al backend
```bash
# 1. Verificar que backend está corriendo
curl http://localhost:3001/health

# 2. Debe retornar: {"status":"ok"}

# 3. Si no funciona, verificar .env del frontend:
cat frontend/.env
# Debe tener: VITE_API_URL=http://localhost:3001/api
```

### Docker no inicia
```bash
# Abrir Docker Desktop manualmente desde el menú inicio
# Esperar a que cargue completamente (icono en la bandeja)
# Luego ejecutar:
docker start nexus-postgres
```

---

## 🛑 DETENER TODO AL TERMINAR

```bash
# En cada terminal: Ctrl + C

# Detener Docker (opcional - libera recursos):
docker stop nexus-postgres
```

---

## 💡 ATAJOS ÚTILES

### VS Code
- `Ctrl + Shift + ` ` - Abrir nueva terminal
- `Ctrl + C` - Detener servidor en terminal activa
- `Ctrl + ~` - Cambiar entre terminales

### Navegador
- `Ctrl + Shift + R` - Refrescar sin caché
- `F12` - Abrir DevTools (consola, red, etc.)
- `Ctrl + Shift + Delete` - Limpiar caché

---

## 📚 MÁS INFORMACIÓN

### Documentos de referencia:
- **Setup completo desde cero:** `INSTRUCCIONES_SETUP_DESDE_CERO.md`
- **Resumen del proyecto:** `PROYECTO_RESUMEN.md`
- **Sistema de roles:** `DYNAMIC_ROLES_SYSTEM.md`
- **Modificaciones frontend:** `FRONTEND_MODIFICACIONES.md`

### URLs importantes:
```
Frontend:              http://localhost:4028
Backend API:           http://localhost:3001/api
Backend Health:        http://localhost:3001/health

Dashboard Ejecutivo:   http://localhost:4028/executive-dashboard
Administración:        http://localhost:4028/team-and-system-administration
Activity Logs:         http://localhost:4028/activity-logs
```

### Credenciales de usuarios:
| Email | Password | Rol |
|-------|----------|-----|
| admin@iptegra.com | admin123 | CEO |
| dev1@iptegra.com | dev123 | Director de Desarrollo |
| dev2@iptegra.com | dev123 | Desarrollador Full Stack |
| dev3@iptegra.com | dev123 | Desarrollador Backend |
| dev4@iptegra.com | dev123 | Desarrollador Frontend |

---

## 🔍 VERIFICACIÓN COMPLETA

**1. Backend funciona:**
```bash
curl http://localhost:3001/health
# Respuesta: {"status":"ok"}
```

**2. Login funciona:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@iptegra.com","password":"admin123"}'
# Respuesta: {tokens, user}
```

**3. Frontend conectado:**
- Abrir: http://localhost:4028
- Login con `admin@iptegra.com` / `admin123`
- Debe redirigir al Dashboard Ejecutivo

**4. Funcionalidades principales:**
- ✅ Navegación entre páginas
- ✅ Tabla de usuarios muestra datos
- ✅ Activity logs muestra registros con IP
- ✅ Panel lateral de actividades recientes
- ✅ Gestión de roles funcional

---

**⏱️ Tiempo de inicio: 2-5 minutos**

**¡Listo para trabajar! 🚀**
