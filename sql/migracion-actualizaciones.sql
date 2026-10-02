-- Historial de actualizaciones migrado de page3.html
begin;

insert into actualizaciones (fecha, leyenda) values
  ('2026-03-11', 'Se envian equipos TRF T01 - T02 con teclado dañado'),
  ('2026-03-09', 'Llegan equipos de STG T14 - T15 - T30 - I06'),
  ('2026-02-13', 'Se envian equipos a SS.TT. STG T14 - T15 - T30 - I06'),
  ('2026-01-07', 'Se recepciona de STG T05 - T48 - I41'),
  ('2025-12-22', 'Se envia impresora I19 a STG'),
  ('2025-12-18', '* Se envia impresora I41 a STG
* Se actualiza inventario de radios
* Se actualiza info de baterías'),
  ('2025-12-03', 'Se reciben TRS´s de laboratorio STG (T01-T17-T27-T30)'),
  ('2025-11-22', 'Se envia 1 TRF a STG (T17) por daños en estructura'),
  ('2025-11-18', 'Se envian 3 TRF a STG (T01-T27-T30) por daños en teclado'),
  ('2025-11-14', 'Impresora I45 y TRF T62 llegan de laboratorio'),
  ('2025-11-06', 'Se envia impresora I45 a SS.TT. STG'),
  ('2025-10-31', 'Se actualiza estado de balizas'),
  ('2025-10-25', 'Se detalla equipo TRF con daños y se saca de la sección de equipos con detalle la TRF con trizadura'),
  ('2025-10-21', 'Se actualiza inventario de radios, teniendo diferencia en equipos de vuelta, aumentando 5 unid.'),
  ('2025-10-20', 'Vuelve equipos desde STG TRF T32'),
  ('2025-10-07', 'Se modifica info de equipos en STG'),
  ('2025-09-23', 'Se modifica la sección equipos en laboratorio'),
  ('2025-09-10', '* Se cambia mica de equipos trizados (T16, T20 y T26)
* Se detalla impresora en laboratorio'),
  ('2025-09-08', 'Inicio del sistema de inventario con datos predeterminados.')
;

commit;