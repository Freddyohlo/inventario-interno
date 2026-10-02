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

-- ============================================================
-- DATOS INICIALES
-- ============================================================

-- Datos iniciales del inventario
begin;

-- Resumen y tarjetas
insert into resumen (clave, cantidad, detalle, orden) values
  ('totalTrf', 117, '50 equipos picking, 10 backup y 57 libre uso', 0),
  ('impresoras', 60, '50 corresponden a picking y 10 a backup', 1),
  ('totalRadios', 51, '50 disponibles, 1 equipo defectuoso.', 2),
  ('totalBalizas', 24, '24 equipos operativos', 3),
  ('celulares', 6, 'Equipos operativos, 1 equipo se encuentra con trizadura', 4),
  ('equiposLab', 0, 'No hay equipos en laboratorio', 5),
  ('equiposDetalle', 1, 'Cel3 con trizadura de pantalla', 6),
  ('areas_peto', 19, 'Distribucion por area', 7),
  ('areas_lata', 18, 'Distribucion por area', 8),
  ('areas_jugos', 7, 'Distribucion por area', 9),
  ('areas_casa', 6, 'Distribucion por area', 10),
  ('uso_picking', 50, 'Resumen por uso', 11),
  ('uso_backup', 10, 'Resumen por uso', 12),
  ('uso_libre', 72, 'Resumen por uso', 13),
  ('baterias_trf', 0, '200 (1,5 x equipo)', 14),
  ('baterias_impresoras', 0, '105 (1,75 x equipo)', 15),
  ('baterias_radios', 0, '60 (1,17 x equipo)', 16)
on conflict (clave) do update set cantidad = excluded.cantidad, detalle = excluded.detalle, orden = excluded.orden;

-- trf330l: 81 equipos
insert into equipos (tipo, codigo, serie) values
  ('trf330l', 'T01', '23178520100380'),
  ('trf330l', 'T02', '22256520100401'),
  ('trf330l', 'T03', '22256520100657'),
  ('trf330l', 'T04', '22253520101252'),
  ('trf330l', 'T05', '22256520100862'),
  ('trf330l', 'T06', '23177520100571'),
  ('trf330l', 'T07', '22256520100358'),
  ('trf330l', 'T08', '24164525101498'),
  ('trf330l', 'T09', '22248520100194'),
  ('trf330l', 'T10', '22242520100314'),
  ('trf330l', 'T11', '22255520100436'),
  ('trf330l', 'T12', '23178520100725'),
  ('trf330l', 'T13', '23178520100722'),
  ('trf330l', 'T14', '24164525101500'),
  ('trf330l', 'T15', '22255520100361'),
  ('trf330l', 'T16', '22255521001402'),
  ('trf330l', 'T17', '25043525100618'),
  ('trf330l', 'T18', '24164525101308'),
  ('trf330l', 'T19', '23181520101069'),
  ('trf330l', 'T20', '24164525101268'),
  ('trf330l', 'T21', '22253520101400'),
  ('trf330l', 'T22', '23178520100418'),
  ('trf330l', 'T23', '22257520100031'),
  ('trf330l', 'T24', '23177520100754'),
  ('trf330l', 'T25', '24164525101519'),
  ('trf330l', 'T26', '23177520100540'),
  ('trf330l', 'T27', '22256520102513'),
  ('trf330l', 'T28', '24164525101478'),
  ('trf330l', 'T29', '22256520100105'),
  ('trf330l', 'T30', '23178520100726'),
  ('trf330l', 'T31', '22256520102479'),
  ('trf330l', 'T32', '23177520100777'),
  ('trf330l', 'T33', '23177520100761'),
  ('trf330l', 'T34', '23177520100734'),
  ('trf330l', 'T35', '24164525101408'),
  ('trf330l', 'T36', '22256520100881'),
  ('trf330l', 'T37', '22255520102707'),
  ('trf330l', 'T38', '22256520100861'),
  ('trf330l', 'T39', '24164525101505'),
  ('trf330l', 'T40', '22256520100838'),
  ('trf330l', 'T41', '22255520102622'),
  ('trf330l', 'T42', '22257520100558'),
  ('trf330l', 'T43', '23177520100735'),
  ('trf330l', 'T44', '23177520100749'),
  ('trf330l', 'T45', '22255520100402'),
  ('trf330l', 'T46', '22255520102580'),
  ('trf330l', 'T47', '22246520102674'),
  ('trf330l', 'T48', '22256520100857'),
  ('trf330l', 'T49', '22255520102708'),
  ('trf330l', 'T50', '22255520100478'),
  ('trf330l', 'T56', '22080520100291'),
  ('trf330l', 'T62', '24346525100781'),
  ('trf330l', 'T63', '22080520100469'),
  ('trf330l', 'T68', '22080520100381'),
  ('trf330l', 'T69', '22080520100306'),
  ('trf330l', 'T72', '22080520100767'),
  ('trf330l', 'T73', '22041520101848'),
  ('trf330l', 'T74', '22080520100791'),
  ('trf330l', 'T76', '22080520100704'),
  ('trf330l', 'T77', '22080520100346'),
  ('trf330l', 'T85', '22080520100420'),
  ('trf330l', 'T86', '22080520100222'),
  ('trf330l', 'T90', '22080520100577'),
  ('trf330l', 'T91', '22080520100777'),
  ('trf330l', 'T92', '22080520100289'),
  ('trf330l', 'T95', '22080520100747'),
  ('trf330l', 'T96', '25043525100632'),
  ('trf330l', 'T97', '22066520100967'),
  ('trf330l', 'T99', '24345525101209'),
  ('trf330l', 'T102', '21230520100120'),
  ('trf330l', 'T103', '21230520100060'),
  ('trf330l', 'T105', '21229520101475'),
  ('trf330l', 'T106', '21229520101489'),
  ('trf330l', 'T107', '21230520100053'),
  ('trf330l', 'T108', '20325520101153'),
  ('trf330l', 'T109', '21230520100001'),
  ('trf330l', 'T110', '21230520100071'),
  ('trf330l', 'T111', '22066520100928'),
  ('trf330l', 'T112', '22080520100308'),
  ('trf330l', 'T113', '22080520100755'),
  ('trf330l', 'T116', '22080520100710')
on conflict (tipo, codigo) do update set serie = excluded.serie;

-- zq360: 60 equipos
insert into equipos (tipo, codigo, serie) values
  ('zq360', 'I01', 'XXZVN241900204'),
  ('zq360', 'I02', 'XXZVN241900209'),
  ('zq360', 'I03', 'XXZVN241900208'),
  ('zq360', 'I04', 'XXZVN241900205'),
  ('zq360', 'I05', 'XXZVN241900197'),
  ('zq360', 'I06', 'XXZVN241900207'),
  ('zq360', 'I07', 'XXZVN241900206'),
  ('zq360', 'I08', 'XXZVN241900210'),
  ('zq360', 'I09', 'XXZVN241900212'),
  ('zq360', 'I10', 'XXZVN241900202'),
  ('zq360', 'I11', 'XXZVN241800886'),
  ('zq360', 'I12', 'XXZVN241900125'),
  ('zq360', 'I13', 'XXZVN241900108'),
  ('zq360', 'I14', 'XXZVN241900106'),
  ('zq360', 'I15', 'XXZVN241900112'),
  ('zq360', 'I16', 'XXZVN241800906'),
  ('zq360', 'I17', 'XXZVN241800883'),
  ('zq360', 'I18', 'XXZVN241900109'),
  ('zq360', 'I19', 'XXZVN241900110'),
  ('zq360', 'I20', 'XXZVN241900107'),
  ('zq360', 'I21', 'XXZVN241900193'),
  ('zq360', 'I22', 'XXZVN241900195'),
  ('zq360', 'I23', 'XXZVN241900190'),
  ('zq360', 'I24', 'XXZVN241900201'),
  ('zq360', 'I25', 'XXZVN241900199'),
  ('zq360', 'I26', 'XXZVN241900194'),
  ('zq360', 'I27', 'XXZVN241900146'),
  ('zq360', 'I28', 'XXZVN241900145'),
  ('zq360', 'I29 - (I61)', 'XXZVN251302026'),
  ('zq360', 'I30', 'XXZVN241900203'),
  ('zq360', 'I31', 'XXZVN241900111'),
  ('zq360', 'I32', 'XXZVN241900115'),
  ('zq360', 'I33', 'XXZVN241900113'),
  ('zq360', 'I34', 'XXZVN241900119'),
  ('zq360', 'I35', 'XXZVN241900144'),
  ('zq360', 'I36', 'XXZVN241900116'),
  ('zq360', 'I37', 'XXZVN241900118'),
  ('zq360', 'I38', 'XXZVN241900117'),
  ('zq360', 'I39', 'XXZVN241900114'),
  ('zq360', 'I40', 'XXZVN241900121'),
  ('zq360', 'I41 - (I62)', 'XXZVN251302073'),
  ('zq360', 'I42', 'XXZVN241900158'),
  ('zq360', 'I43', 'XXZVN241900157'),
  ('zq360', 'I44', 'XXZVN241900159'),
  ('zq360', 'I45', 'XXZVN241900161'),
  ('zq360', 'I46', 'XXZVN241900166'),
  ('zq360', 'I47', 'XXZVN241900136'),
  ('zq360', 'I48', 'XXZVN241900164'),
  ('zq360', 'I49', 'XXZVN241900143'),
  ('zq360', 'I50', 'XXZVN241900162'),
  ('zq360', 'I51', 'XXZVN241900185'),
  ('zq360', 'I52', 'XXZVN241900137'),
  ('zq360', 'I53', 'XXZVN241900183'),
  ('zq360', 'I54', 'XXZVN241900182'),
  ('zq360', 'I55', 'XXZVN241900150'),
  ('zq360', 'B20', 'XXZLN222000143'),
  ('zq360', 'B21', 'XXZLN222000087'),
  ('zq360', 'B22', 'XXZLN222000139'),
  ('zq360', 'B23', 'XXZLN221800181'),
  ('zq360', 'B24', 'XXZLN221800185')
on conflict (tipo, codigo) do update set serie = excluded.serie;

-- mc3300: 16 equipos
insert into equipos (tipo, codigo, serie) values
  ('mc3300', 'T51', '19272523021385'),
  ('mc3300', 'T52', '19272523020102'),
  ('mc3300', 'T53', '19273523020194'),
  ('mc3300', 'T54', '19272523021380'),
  ('mc3300', 'T55', '19272523021397'),
  ('mc3300', 'T57', '19273523020062'),
  ('mc3300', 'T58', '19273523020130'),
  ('mc3300', 'T59', '19273523020025'),
  ('mc3300', 'T60', '22080520100292'),
  ('mc3300', 'T75', '19272523021423'),
  ('mc3300', 'T82', '19272523021372'),
  ('mc3300', 'T83', '19273523020003'),
  ('mc3300', 'T98', '20079520101523'),
  ('mc3300', 'T101', '19272523021292'),
  ('mc3300', 'T117', '19273523020081'),
  ('mc3300', 'T120', '19272523021386')
on conflict (tipo, codigo) do update set serie = excluded.serie;

-- mc3400: 20 equipos
insert into equipos (tipo, codigo, serie) values
  ('mc3400', 'T61', '26042525120130'),
  ('mc3400', 'T64', '26042525120304'),
  ('mc3400', 'T65', '26035525120076'),
  ('mc3400', 'T66', '26042525120116'),
  ('mc3400', 'T67', '26035525120066'),
  ('mc3400', 'T70', '26041525120167'),
  ('mc3400', 'T71', '26041525120331'),
  ('mc3400', 'T78', '26041525120323'),
  ('mc3400', 'T79', '26041525120309'),
  ('mc3400', 'T80', '26041525120320'),
  ('mc3400', 'T81', '26041525120294'),
  ('mc3400', 'T84', '26041525120083'),
  ('mc3400', 'T87', '26035525120075'),
  ('mc3400', 'T88', '26041525120316'),
  ('mc3400', 'T93', '26041525120310'),
  ('mc3400', 'T94', '26041525120317'),
  ('mc3400', 'T100', '26041525120319'),
  ('mc3400', 'T104', '26041525120300'),
  ('mc3400', 'T114', '26041525120069'),
  ('mc3400', 'T115', '26041525120147')
on conflict (tipo, codigo) do update set serie = excluded.serie;

commit;