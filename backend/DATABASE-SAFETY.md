# ⚠️ INSTRUCCIONES CRÍTICAS DE SEGURIDAD DE BASE DE DATOS

## 🚨 PROBLEMA HISTÓRICO
La tabla `activity_logs` se ha eliminado MÚLTIPLES VECES accidentalmente al ejecutar scripts de migración que usaban `DROP TYPE ... CASCADE`.

## ✅ SOLUCIÓN IMPLEMENTADA

### 1. Seed Seguro (seed.ts)
El archivo `prisma/seed.ts` AHORA incluye una función `ensureActivityLogsTable()` que:
- ✅ Se ejecuta SIEMPRE al inicio del seed
- ✅ Verifica si `activity_logs` existe
- ✅ La recrea automáticamente si no existe
- ✅ NO falla el seed si hay un error

### 2. Script de Verificación Manual
Ejecutar cuando sea necesario:
```bash
node ensure-activity-logs.js
```

### 3. Scripts Corregidos
- ✅ `fix-product-enum.js` - Ya NO usa CASCADE
- ✅ Cualquier DROP TYPE futuro debe ser SIN CASCADE

## 🔴 REGLAS PERMANENTES

### NUNCA HACER:
```sql
❌ DROP TYPE "ProductStatus" CASCADE;
❌ DROP TABLE "activity_logs" CASCADE;
❌ ALTER TABLE ... DROP COLUMN ... CASCADE;
```

### SIEMPRE HACER:
```sql
✅ DROP TYPE IF EXISTS "ProductStatus";  -- Sin CASCADE
✅ CREATE TABLE IF NOT EXISTS "activity_logs" ...
✅ Ejecutar ensure-activity-logs.js antes de cambios grandes
```

## 📋 CHECKLIST ANTES DE CAMBIOS EN BASE DE DATOS

Antes de ejecutar cualquier script de migración:

1. [ ] ¿El script usa CASCADE? → Eliminarlo
2. [ ] ¿El script modifica enums? → Verificar que no afecte otras tablas
3. [ ] Ejecutar `node ensure-activity-logs.js` ANTES del cambio
4. [ ] Ejecutar `npx prisma db seed` DESPUÉS del cambio
5. [ ] Verificar que activity_logs siga existiendo

## 🔧 SI ACTIVITY_LOGS SE PIERDE OTRA VEZ

```bash
# Opción 1: Script rápido
node ensure-activity-logs.js

# Opción 2: Desde seed (incluye verificación automática)
npx prisma db seed

# Opción 3: Script específico
node recreate-activity-logs-quick.js
```

## 📝 ARCHIVOS IMPORTANTES

- `prisma/seed.ts` - Tiene protección automática de activity_logs
- `ensure-activity-logs.js` - Script de verificación/creación manual
- `fix-product-enum.js` - YA CORREGIDO (sin CASCADE)
- `DATABASE-SAFETY.md` - ESTE ARCHIVO (leer siempre antes de cambios)

## ⚡ VERIFICACIÓN RÁPIDA

```bash
# Verificar que activity_logs existe
psql -d nexus_db -c "\dt activity_logs"

# O desde Node:
node -e "const {PrismaClient}=require('@prisma/client');const p=new PrismaClient();(async()=>{const r=await p.\$queryRaw\`SELECT * FROM activity_logs LIMIT 1\`;console.log('✅ OK');await p.\$disconnect();})().catch(()=>console.log('❌ NO EXISTE'));"
```

## 🎯 RESUMEN

**El problema:** CASCADE elimina tablas relacionadas indirectamente
**La solución:** Seed verifica y recrea activity_logs automáticamente
**La prevención:** Nunca usar CASCADE en DROP statements

---

**ÚLTIMA ACTUALIZACIÓN:** 2026-01-13
**RAZÓN:** Evitar pérdida recurrente de tabla activity_logs
