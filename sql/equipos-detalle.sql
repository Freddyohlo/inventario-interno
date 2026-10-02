-- ============================================================
-- Equipos en detalle (laboratorio / con detalle) + fotos
-- Ejecutar una vez en el SQL Editor de Supabase.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Tabla de equipos con detalle
--    tipo: 'laboratorio' (va a servicio tecnico, no opera)
--          'detalle'     (opera, pero tiene un desperfecto)
-- ------------------------------------------------------------
create table if not exists equipos_detalle (
  id           bigserial primary key,
  tipo         text not null check (tipo in ('laboratorio', 'detalle')),
  codigo       text not null,          -- T16, Cel003...
  nombre       text not null,          -- TRF Zebra MC3300
  descripcion  text not null default '', -- Pantalla trizada
  foto_url     text not null default '', -- URL publica en Storage
  creado_en    timestamptz not null default now()
);

create index if not exists equipos_detalle_tipo_idx on equipos_detalle (tipo);

-- ------------------------------------------------------------
-- 2. Seguridad (RLS): lectura publica, escritura autenticada
-- ------------------------------------------------------------
alter table equipos_detalle enable row level security;

drop policy if exists "lectura publica equipos_detalle" on equipos_detalle;
create policy "lectura publica equipos_detalle"
  on equipos_detalle for select using (true);

drop policy if exists "escritura autenticada equipos_detalle" on equipos_detalle;
create policy "escritura autenticada equipos_detalle"
  on equipos_detalle for all to authenticated using (true) with check (true);

-- ------------------------------------------------------------
-- 3. Bucket de Storage para las fotos
--    Publico para lectura (el link del sitio no se comparte).
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('fotos-equipos', 'fotos-equipos', true)
on conflict (id) do update set public = true;

-- Lectura publica de las fotos
drop policy if exists "lectura publica fotos" on storage.objects;
create policy "lectura publica fotos"
  on storage.objects for select
  using (bucket_id = 'fotos-equipos');

-- Subida/edicion/borrado solo para usuarios autenticados
drop policy if exists "escritura autenticada fotos" on storage.objects;
create policy "escritura autenticada fotos"
  on storage.objects for all to authenticated
  using (bucket_id = 'fotos-equipos')
  with check (bucket_id = 'fotos-equipos');

-- ------------------------------------------------------------
-- 4. Datos de ejemplo: el equipo con detalle que ya existia
-- ------------------------------------------------------------
insert into equipos_detalle (tipo, codigo, nombre, descripcion, foto_url)
select 'detalle', 'Cel003', 'Celular Android', 'Pantalla trizada', ''
where not exists (
  select 1 from equipos_detalle where tipo = 'detalle' and codigo = 'Cel003'
);
