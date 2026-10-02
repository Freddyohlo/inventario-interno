# 🚀 Configurar Supabase y el panel editor

Guía paso a paso. Son 3 pasos y ~10 minutos.

---

## Paso 1 — Crear el proyecto en Supabase

1. Entra a <https://supabase.com> y crea una cuenta (gratis).
2. **New project**:
   - Nombre: `inventario-stg`
   - Contraseña de base de datos: guárdala en un lugar seguro.
   - Región: la más cercana (ej. `South America (São Paulo)`).
3. Espera ~2 minutos a que termine de crearse.

---

## Paso 2 — Crear las tablas y cargar los datos

1. En tu proyecto, ve a **SQL Editor** → **New query**.
2. Pega **todo** el contenido de `sql/esquema.sql` y presiona **Run**.
3. Abre otra query, pega **todo** el contenido de `sql/datos.sql` y presiona **Run**.

Al terminar tendrás:
- **17 filas** en `resumen` (tarjetas, áreas, uso, baterías)
- **177 equipos** en `equipos` (81 TRF 330L, 60 impresoras, 16 MC3300, 20 MC3400)

---

## Paso 3 — Crear tu usuario y conectar el sitio

### 3.1 Crear el usuario del panel

1. Ve a **Authentication** → **Users** → **Add user** → **Create new user**.
2. Correo y contraseña (esta es la que usarás en el panel).
3. **Importante:** marca **Auto Confirm User** para no depender del correo de confirmación.

Para tu compañero de turno, repite el paso: crea otro usuario con su correo.

### 3.2 Copiar las credenciales

1. Ve a **Project Settings** → **API**.
2. Copia dos valores:
   - **Project URL** → `https://xxxxx.supabase.co`
   - **anon public** (la clave larga que empieza con `eyJ...`)

3. Abre `js/config.js` y pégalos:

```js
window.SUPABASE_URL = 'https://xxxxx.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOi...';
```

4. Guarda, haz commit y push. Vercel despliega solo.

---

## Cómo usar el panel

| Acción | Dónde |
| --- | --- |
| **Ver el inventario** | `https://tu-sitio.vercel.app/` |
| **Editar** | `https://tu-sitio.vercel.app/admin` |

### En el panel tienes 5 pestañas

1. **Resumen** — cantidades y detalles de las tarjetas.
2. **Equipos** — código + número de serie. Puedes agregar, editar o borrar.
3. **Actualizaciones** — historial de cambios (page3).
4. **Reparaciones** — historial de reparaciones (page4).
5. **Bitácora** — registro automático: quién editó qué y cuándo.

Cada pestaña tiene su botón **Guardar**. Los cambios se ven al instante en el sitio público.

---

## Notas de seguridad

- La **anon key** es pública por diseño; el acceso de escritura lo controlan las
  políticas **RLS**: solo usuarios autenticados pueden editar.
- **No compartas** el link `/admin` ni las contraseñas.
- Si alguien deja de trabajar contigo, bórralo desde **Authentication → Users**.
