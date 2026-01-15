# GUÍAS DE DESARROLLO - IPTEGRA NEXUS

**Fecha de creación:** 14 de Enero 2026
**Propósito:** Documentar las mejores prácticas y políticas de desarrollo para el proyecto IPTEGRA Nexus

---

## 📋 CONTROL DE CAMBIOS Y POLÍTICAS

### **1. Gestión de Base de Datos**

#### **⚠️ SIEMPRE PREGUNTAR ANTES DE:**
- Borrar cualquier dato de tablas existentes
- Ejecutar comandos DELETE FROM o TRUNCATE
- Ejecutar seeds que sobrescriban datos existentes
- Hacer DROP TABLE o migrations destructivas
- Ejecutar comandos de reset de base de datos

#### **Política de Seeds:**
- Los seeds solo deben ejecutarse en bases de datos nuevas o de desarrollo
- NUNCA ejecutar seeds en producción sin confirmación explícita del usuario
- Antes de proponer un seed, preguntar si hay datos que deben preservarse
- Proponer backups antes de operaciones destructivas

#### **Ejemplo de confirmación:**
```
Usuario: "Necesito agregar datos de prueba"
Claude: "Voy a ejecutar el seed que agregará usuarios y productos de prueba.
         Esto podría sobrescribir datos existentes. ¿Quieres continuar?"
```

---

### **2. Propuestas de Mejora**

#### **Sugerir mejoras con los cambios propuestos por el usuario:**
- Cuando el usuario solicite un cambio, evaluar si hay mejoras relacionadas que podrían beneficiar la experiencia
- Proponer optimizaciones de rendimiento si aplica
- Sugerir mejoras de UX/UI cuando sean relevantes
- Mencionar patrones de diseño o arquitectura que puedan mejorar el código

#### **Ejemplos:**
```
Usuario: "Agrega un botón de eliminar en productos"
Claude: "Voy a agregar el botón de eliminar. También sugiero:
         - Agregar confirmación con modal (mejor que window.confirm)
         - Deshabilitar botón mientras se procesa la eliminación
         - Mostrar toast notification después de eliminar exitosamente
         ¿Te parece bien implementar estas mejoras?"
```

```
Usuario: "Necesito filtrar cotizaciones por fecha"
Claude: "Voy a agregar filtros de fecha. Adicionalmente sugiero:
         - Agregar presets de fecha (Hoy, Esta semana, Este mes, etc.)
         - Permitir exportar resultados filtrados a Excel
         - Mostrar contador de resultados filtrados
         ¿Implementamos estas mejoras también?"
```

---

### **3. Comunicación**

#### **✅ SIEMPRE CONTESTAR EN ESPAÑOL**
- Todas las respuestas deben ser en español
- Documentación en español
- Comentarios de código en español
- Mensajes de commit en español
- Variables y funciones pueden estar en inglés (convención estándar)

#### **Excepciones aceptables:**
- Nombres de funciones y variables en inglés (buena práctica internacional)
- Documentación de APIs que referencie términos técnicos en inglés
- Logs de consola pueden estar en inglés si son para debugging

---

### **4. Mejores Prácticas de UI/UX**

#### **Diseño Consistente:**
- ✅ Usar sistema de diseño establecido (TailwindCSS classes)
- ✅ Mantener espaciado consistente (gap-4, gap-6, etc.)
- ✅ Usar iconos de lucide-react a través del sistema Icon
- ✅ Respetar jerarquía de colores (primary, secondary, success, error, etc.)

#### **Feedback al Usuario:**
- ✅ Loading states durante operaciones asíncronas
- ✅ Confirmaciones antes de acciones destructivas
- ✅ Mensajes de éxito/error claros y descriptivos
- ✅ Skeleton loaders en lugar de pantallas en blanco
- ✅ Deshabilitar botones durante procesamiento

#### **Responsive Design:**
- ✅ Mobile-first approach
- ✅ Probar diseños en 3 breakpoints: mobile (sm), tablet (md), desktop (lg)
- ✅ Grid responsivo: 1 columna mobile, 2-3 tablet, 4+ desktop
- ✅ Menús colapsables en mobile

#### **Accesibilidad:**
- ✅ Labels descriptivos en formularios
- ✅ Placeholders útiles pero no como reemplazo de labels
- ✅ Contraste de colores adecuado (WCAG AA mínimo)
- ✅ Keyboard navigation funcional
- ✅ ARIA labels donde sea necesario

#### **Performance UX:**
- ✅ Optimistic updates cuando sea posible
- ✅ Debounce en búsquedas en tiempo real (300ms recomendado)
- ✅ Paginación en listas largas (10-20 items por página)
- ✅ Lazy loading de imágenes y componentes pesados
- ✅ Virtual scrolling para listas muy largas (1000+ items)

---

### **5. Queries y Consultas Livianas**

#### **Base de Datos (Prisma):**

##### **✅ BUENAS PRÁCTICAS:**
```typescript
// ✅ Seleccionar solo campos necesarios
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // No cargar campos pesados innecesariamente
  }
});

// ✅ Usar where para filtrar en BD, no en memoria
const activeUsers = await prisma.user.findMany({
  where: { status: 'ACTIVE' }
});

// ✅ Limitar resultados con take
const recentLogs = await prisma.activityLog.findMany({
  take: 10,
  orderBy: { createdAt: 'desc' }
});

// ✅ Usar include solo cuando sea necesario
const quotation = await prisma.quotation.findUnique({
  where: { id },
  include: {
    quotationItems: true,  // Solo incluir si se va a usar
  }
});

// ✅ Índices en columnas que se consultan frecuentemente
// En schema.prisma:
@@index([status])
@@index([createdAt])
@@index([userId, createdAt])
```

##### **❌ MALAS PRÁCTICAS:**
```typescript
// ❌ Cargar todo y filtrar en memoria
const allUsers = await prisma.user.findMany();
const activeUsers = allUsers.filter(u => u.status === 'ACTIVE');

// ❌ N+1 queries (hacer query por cada item)
const products = await prisma.product.findMany();
for (const product of products) {
  const clients = await prisma.client.findMany({
    where: { products: { has: product.id } }
  });
}

// ❌ Cargar relaciones innecesarias
const users = await prisma.user.findMany({
  include: {
    sessions: true,  // No necesario si solo necesitas user data
    requests: true,
    assignments: true,
  }
});
```

#### **Frontend (React):**

##### **✅ BUENAS PRÁCTICAS:**
```javascript
// ✅ Debounce en búsquedas
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch, setDebouncedSearch] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 300);
  return () => clearTimeout(timer);
}, [searchTerm]);

// ✅ Memoización de cálculos costosos
const filteredProducts = useMemo(() => {
  return products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [products, searchTerm]);

// ✅ Paginación en frontend para listas grandes
const paginatedItems = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return filteredItems.slice(startIndex, startIndex + itemsPerPage);
}, [filteredItems, currentPage, itemsPerPage]);

// ✅ Lazy loading de componentes pesados
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// ✅ Cancelar requests al desmontar componente
useEffect(() => {
  const controller = new AbortController();

  fetchData({ signal: controller.signal });

  return () => controller.abort();
}, []);
```

##### **❌ MALAS PRÁCTICAS:**
```javascript
// ❌ Fetch en cada render
function Component() {
  const data = fetchData();  // Se ejecuta en cada render
  return <div>{data}</div>;
}

// ❌ Filtrado sin memoización
function Component({ items }) {
  // Se recalcula en cada render, incluso si items no cambió
  const filtered = items.filter(item => item.active);
  return <List items={filtered} />;
}

// ❌ Queries dentro de loops
function Component({ productIds }) {
  return productIds.map(id => {
    const product = useQuery(`/products/${id}`);  // N queries!
    return <ProductCard product={product} />;
  });
}
```

#### **APIs y Endpoints:**

##### **✅ BUENAS PRÁCTICAS:**
```typescript
// ✅ Paginación en backend
app.get('/api/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.count()
  ]);

  res.json({
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// ✅ Caché para datos que no cambian frecuentemente
let exchangeRateCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

async function getExchangeRate() {
  if (exchangeRateCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return exchangeRateCache;
  }

  exchangeRateCache = await fetchFromAPI();
  cacheTimestamp = Date.now();
  return exchangeRateCache;
}

// ✅ Selección de campos en respuestas
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      // No enviar password, refresh tokens, etc.
    }
  });
  res.json(users);
});
```

##### **❌ MALAS PRÁCTICAS:**
```typescript
// ❌ No paginar listas grandes
app.get('/api/logs', async (req, res) => {
  const logs = await prisma.activityLog.findMany();  // Puede ser millones!
  res.json(logs);
});

// ❌ Queries sincronizadas (lentas)
app.get('/api/dashboard', async (req, res) => {
  const users = await prisma.user.count();
  const products = await prisma.product.count();
  const clients = await prisma.client.count();
  // Mejor usar Promise.all para ejecutar en paralelo
});

// ❌ Enviar datos sensibles o innecesarios
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();  // Incluye passwords!
  res.json(users);
});
```

---

### **6. Seguridad**

#### **Validación de Datos:**
- ✅ Validar todos los inputs del usuario (frontend Y backend)
- ✅ Sanitizar datos antes de guardar en BD
- ✅ Usar Prisma para prevenir SQL injection
- ✅ Validar tipos de archivo en uploads

#### **Autenticación y Autorización:**
- ✅ Siempre verificar permisos en backend (no confiar en frontend)
- ✅ Usar JWT con expiración corta (15-30 min)
- ✅ Refresh tokens con expiración larga pero renovable
- ✅ Invalidar sesiones al logout

#### **Datos Sensibles:**
- ✅ NUNCA loggear contraseñas o tokens
- ✅ NUNCA enviar contraseñas en responses
- ✅ Hash de contraseñas con bcrypt (10+ rounds)
- ✅ Usar variables de entorno para secrets

---

### **7. Testing y Quality Assurance**

#### **Antes de hacer commit:**
- ✅ Verificar que backend compila sin errores
- ✅ Verificar que frontend compila sin errores
- ✅ Probar funcionalidad en navegador
- ✅ Revisar console del navegador (no debe haber errores)
- ✅ Revisar logs del backend (no debe haber warnings críticos)

#### **Después de cambios importantes:**
- ✅ Probar en Chrome y Firefox
- ✅ Probar responsive en mobile
- ✅ Verificar que permisos funcionen correctamente
- ✅ Revisar que activity logs se registren correctamente

---

### **8. Git y Control de Versiones**

#### **Mensajes de Commit:**
```bash
# ✅ Formato recomendado
feat: agregar búsqueda y paginación en modales de cliente
fix: corregir mezcla de COP y USD en dashboard
refactor: reorganizar tabs de configuración del sistema
docs: actualizar PROYECTO_RESUMEN.md con sesión 7

# Tipos de commit:
- feat: nueva funcionalidad
- fix: corrección de bug
- refactor: refactorización sin cambiar funcionalidad
- docs: cambios en documentación
- style: cambios de formato (no afectan funcionalidad)
- perf: mejoras de rendimiento
- test: agregar o modificar tests
- chore: tareas de mantenimiento
```

#### **Branches:**
```bash
# Estructura recomendada:
main/master     # Producción estable
develop         # Desarrollo activo
feature/nombre  # Nuevas funcionalidades
fix/nombre      # Correcciones de bugs
hotfix/nombre   # Fixes urgentes para producción
```

---

### **9. Documentación**

#### **Actualizar documentación cuando:**
- Se agregue nueva funcionalidad importante
- Se modifique arquitectura o flujos principales
- Se agreguen nuevos endpoints de API
- Se cambien configuraciones importantes
- Se resuelvan bugs críticos

#### **Archivos a mantener actualizados:**
- `PROYECTO_RESUMEN.md` - Estado general del proyecto
- `GUIAS_DESARROLLO.md` - Este archivo de guías
- `README.md` - Instrucciones de instalación y uso
- Comentarios en código para lógica compleja

---

### **10. Comunicación con el Usuario**

#### **Cuando implementes algo:**
- ✅ Explicar QUÉ se implementó
- ✅ Explicar POR QUÉ (si no es obvio)
- ✅ Mencionar archivos modificados/creados
- ✅ Advertir sobre efectos secundarios o breaking changes
- ✅ Sugerir próximos pasos si aplica

#### **Cuando encuentres problemas:**
- ✅ Explicar el error claramente
- ✅ Explicar la causa raíz si la conoces
- ✅ Proponer solución(es)
- ✅ Implementar la solución si es directa
- ✅ Preguntar si hay duda sobre cuál solución aplicar

---

## 📚 REFERENCIAS RÁPIDAS

### **Comandos Útiles:**
```bash
# Backend
cd backend
npm run dev                  # Levantar servidor
npx prisma migrate dev       # Aplicar migraciones
npx prisma db seed           # Ejecutar seeds (preguntar antes!)
npx prisma studio           # Ver BD en GUI

# Frontend
cd frontend
npm start                    # Levantar app (puerto 4028)
npm run build               # Build de producción

# Git
git status                   # Ver cambios
git add .                    # Agregar todos los cambios
git commit -m "mensaje"      # Commit con mensaje
git push origin main         # Subir a GitHub
```

### **Verificación de Salud:**
```bash
# Backend health check
curl http://localhost:3001/health

# Frontend
http://localhost:4028

# PostgreSQL
psql -U nexus -d nexus_db -h localhost -p 5435
```

---

**Última actualización:** 14 de Enero 2026
**Mantenido por:** Claude Code + Usuario IPTEGRA
