# 🤖 CÓMO USAR CLAUDE CODE CON ESTE PROYECTO

Claude Code es tu asistente de desarrollo local. Úsalo para:
1. Generar todo el backend automáticamente
2. Modificar el frontend para conectar con la API
3. Añadir nuevas features
4. Debuggear problemas

---

## INSTALACIÓN DE CLAUDE CODE

**Si no tienes Claude Code instalado:**

```bash
# macOS/Linux
npm install -g @anthropic-ai/claude-code

# O usa npx (no requiere instalación)
npx @anthropic-ai/claude-code
```

---

## USO BÁSICO

### Opción 1: Modo Interactivo (Recomendado)

```bash
cd iptegra-nexus-full/backend

# Iniciar Claude Code
claude-code

# Ahora puedes chatear con Claude
# Ejemplos:
> "Lee el archivo MEGA_PROMPT_CLAUDE_CODE.md y genera todos los módulos"
> "Crea el módulo de requests completo con todos los endpoints"
> "Agrega validación con Zod al módulo de auth"
```

### Opción 2: Prompt Directo

```bash
# Ejecutar un prompt desde archivo
claude-code --prompt ../MEGA_PROMPT_CLAUDE_CODE.md

# O desde texto
claude-code --prompt "Crea el módulo de auth completo"
```

### Opción 3: Editor (VSCode)

```bash
# Instala la extensión de Claude para VSCode
# Luego puedes seleccionar código y pedirle a Claude que lo modifique
```

---

## FLUJO RECOMENDADO PARA ESTE PROYECTO

### 1. Generar Backend Completo

```bash
cd backend

# Iniciar Claude Code
claude-code

# Prompt:
"Hola Claude, necesito que generes todo el backend de IPTEGRA Nexus.

Lee el archivo ../MEGA_PROMPT_CLAUDE_CODE.md que contiene todas las especificaciones.

Genera todos los módulos (auth, users, requests, assignments, okrs, products, clients, metrics, ai) con:
- Services
- Controllers  
- Routes
- Types
- Validaciones Zod

También genera app.ts y server.ts con Socket.io.

Por favor empieza ahora."
```

**Claude generará ~50 archivos en 5-10 minutos.**

---

### 2. Modificar Frontend

```bash
cd ../frontend

claude-code

# Prompt:
"Lee el archivo ../FRONTEND_MODIFICACIONES.md.

Esta es una guía completa de todos los cambios que debo hacer al frontend para conectarlo con el backend API.

Por favor:
1. Crea los nuevos servicios (api.js, socketService.js, authService.js, requestService.js)
2. Modifica los servicios existentes que usan Supabase
3. Actualiza los componentes de login/auth
4. Agrega listeners de Socket.io donde sea necesario

Hazlo paso por paso, mostrándome cada archivo que crees/modifiques."
```

---

### 3. Añadir Nuevas Features

```bash
claude-code

# Ejemplo:
"Quiero agregar un sistema de notificaciones push al frontend.
- Debe usar Socket.io
- Mostrar un toast cuando llegue una notificación
- Tener un centro de notificaciones con historial
- Marcar como leídas

¿Puedes implementarlo?"
```

---

### 4. Debugging

```bash
claude-code

# Ejemplo:
"Tengo un error en el login. El backend retorna 401 pero el password es correcto.

Aquí está el código del authService.ts:
[pega el código]

¿Cuál es el problema?"
```

---

## PROMPTS ÚTILES

### Para Backend

```
"Crea el módulo de [nombre] con endpoints CRUD completos"

"Agrega filtros avanzados al endpoint GET /requests"

"Implementa paginación con cursor en todos los endpoints de lista"

"Agrega logs detallados a todos los servicios"

"Crea tests unitarios para el módulo de auth"
```

### Para Frontend

```
"Crea un hook personalizado para manejar requests con loading y error states"

"Agrega un componente de búsqueda avanzada con filtros"

"Implementa un sistema de cache para las llamadas a la API"

"Crea un componente de notificaciones real-time con Socket.io"
```

### Para Debugging

```
"Analiza este error: [pega el error]"

"¿Por qué no se está conectando Socket.io?"

"Optimiza esta query de Prisma para mejor performance"

"Revisa mi código y sugiere mejoras de seguridad"
```

---

## TIPS IMPORTANTES

### ✅ DO's

- **Sé específico:** "Crea el módulo de auth con JWT y refresh tokens"
- **Da contexto:** "Lee primero el schema de Prisma en prisma/schema.prisma"
- **Pide explicaciones:** "Explica por qué usaste este approach"
- **Itera:** Pide mejoras después de la primera versión
- **Verifica:** Siempre revisa el código generado antes de usar

### ❌ DON'Ts

- No pidas cosas vagas: "mejora el código"
- No asumas que Claude conoce tu estructura sin decírselo
- No copies código sin entenderlo
- No olvides probar el código generado

---

## EJEMPLO COMPLETO: Generar Backend

```bash
# Terminal
cd iptegra-nexus-full/backend
claude-code

# En Claude Code
Usuario: "Hola Claude, voy a darte una serie de instrucciones para generar 
el backend completo de IPTEGRA Nexus.

Primero, lee estos archivos para entender la estructura:
1. prisma/schema.prisma
2. src/config/env.ts  
3. src/utils/*.ts
4. src/middlewares/*.ts

Luego lee ../MEGA_PROMPT_CLAUDE_CODE.md que tiene todas las especificaciones 
de los módulos que debes crear.

¿Listo para empezar?"

Claude: "Sí, he leído todos los archivos. Veo que tienes Prisma configurado 
con PostgreSQL, utilidades para JWT, email y IA, y middlewares para auth y 
validación. He leído el MEGA_PROMPT también. ¿Quieres que empiece con el 
módulo de auth?"

Usuario: "Sí, empieza con auth y luego continúa con todos los demás módulos 
en orden."

Claude: [Genera todo el código]
```

---

## VERIFICAR QUE TODO SE GENERÓ

```bash
# Backend
ls src/modules/auth/
ls src/modules/users/
ls src/modules/requests/
ls src/modules/assignments/
ls src/modules/okrs/
ls src/modules/products/
ls src/modules/clients/
ls src/modules/metrics/
ls src/modules/ai/
ls src/app.ts
ls src/server.ts

# Cada módulo debe tener:
# - [module].types.ts
# - [module].service.ts
# - [module].controller.ts
# - [module].routes.ts
```

---

## TROUBLESHOOTING

**Claude Code no responde:**
- Verifica tu conexión a internet
- Asegúrate de tener créditos de API de Anthropic
- Prueba reiniciando: `Ctrl+C` y volver a `claude-code`

**Código generado tiene errores:**
- Pide a Claude que lo corrija: "Hay un error en línea X, por favor corrígelo"
- Dale más contexto sobre el error
- Muéstrale el error completo

**Claude no entiende la estructura:**
- Pídele primero que lea archivos relevantes
- Da ejemplos de lo que quieres
- Sé más específico en tus prompts

---

## RECURSOS ADICIONALES

**Documentación oficial:**
- Claude Code: https://docs.anthropic.com/claude-code
- Claude API: https://docs.anthropic.com/

**Comunidad:**
- Discord de Anthropic
- GitHub Issues

---

**¡Éxito con Claude Code! 🚀**

Es una herramienta poderosa que te ahorrará horas de desarrollo manual.
