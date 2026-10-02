-- ============================================================
-- Inventario interno STG — esquema de base de datos (Supabase)
-- Ejecutar una vez en el SQL Editor de Supabase.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Resumen: los valores de las tarjetas del panel principal
-- ------------------------------------------------------------
create table if not exists resumen (
  clave        text primary key,
  cantidad     integer not null default 0,
  detalle      text not null default '',
  orden        integer not null default 0
);

-- ------------------------------------------------------------
-- 2. Equipos: las series reales, por tipo
--    tipo: 'trf330l' | 'zq360' | 'mc3300' | 'mc3400'
-- ------------------------------------------------------------
create table if not exists equipos (
  id           bigserial primary key,
  tipo         text not null,
  codigo       text not null,          -- T01, I01, B24...
  serie        text not null,          -- número de serie
  creado_en    timestamptz not null default now(),
  unique (tipo, codigo)
);

create index if not exists equipos_tipo_idx on equipos (tipo);

-- ------------------------------------------------------------
-- 3. Historial de actualizaciones (page3)
-- ------------------------------------------------------------
create table if not exists actualizaciones (
  id           bigserial primary key,
  fecha        date not null,
  leyenda      text not null,
  creado_en    timestamptz not null default now()
);

create index if not exists actualizaciones_fecha_idx on actualizaciones (fecha desc);

-- ------------------------------------------------------------
-- 4. Historial de reparaciones (page4)
-- ------------------------------------------------------------
create table if not exists reparaciones (
  id           bigserial primary key,
  fecha        date not null,
  usuario      text not null default '',
  equipo       text not null default '',
  empresa      text not null default '',
  observacion  text not null default '',
  creado_en    timestamptz not null default now()
);

create index if not exists reparaciones_fecha_idx on reparaciones (fecha desc);

-- ------------------------------------------------------------
-- 5. Bitácora de cambios (quién editó qué y cuándo)
--    Se llena sola desde el panel editor.
-- ------------------------------------------------------------
create table if not exists bitacora (
  id           bigserial primary key,
  usuario      text not null default '',
  accion       text not null,          -- 'crear' | 'editar' | 'eliminar'
  tabla        text not null,          -- 'equipos' | 'resumen' | ...
  detalle      text not null default '',
  creado_en    timestamptz not null default now()
);

create index if not exists bitacora_fecha_idx on bitacora (creado_en desc);

-- ------------------------------------------------------------
-- 6. Seguridad (RLS)
--    Lectura pública (el link no se comparte).
--    Escritura solo para usuarios autenticados.
-- ------------------------------------------------------------
alter table resumen        enable row level security;
alter table equipos        enable row level security;
alter table actualizaciones enable row level security;
alter table reparaciones   enable row level security;
alter table bitacora       enable row level security;

-- Lectura para cualquiera (vista pública)
create policy "lectura publica resumen"        on resumen        for select using (true);
create policy "lectura publica equipos"        on equipos        for select using (true);
create policy "lectura publica actualizaciones" on actualizaciones for select using (true);
create policy "lectura publica reparaciones"   on reparaciones   for select using (true);
create policy "lectura publica bitacora"       on bitacora       for select using (true);

-- Escritura solo para usuarios autenticados (el panel editor)
create policy "escritura autenticada resumen"         on resumen         for all to authenticated using (true) with check (true);
create policy "escritura autenticada equipos"         on equipos         for all to authenticated using (true) with check (true);
create policy "escritura autenticada actualizaciones" on actualizaciones for all to authenticated using (true) with check (true);
create policy "escritura autenticada reparaciones"    on reparaciones    for all to authenticated using (true) with check (true);
create policy "escritura autenticada bitacora"        on bitacora        for all to authenticated using (true) with check (true);
