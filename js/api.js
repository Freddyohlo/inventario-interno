/**
 * Capa de datos del inventario.
 *
 * Lee de Supabase cuando esta configurado; si no, cae a los datos locales
 * (los mismos que hoy estan en script.js). Asi el sitio sigue funcionando
 * aunque Supabase no este disponible.
 */

const SUPABASE_URL = window.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || '';

const configurado = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Cliente minimo sobre la API REST de Supabase (sin librerias externas). */
async function rest(path, options = {}) {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${options.token || SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
  const texto = await res.text();
  return texto ? JSON.parse(texto) : null;
}

const InventarioAPI = {
  configurado,

  /** Totales y tarjetas del panel principal. */
  async resumen() {
    if (!configurado) return null;
    const filas = await rest('resumen?select=clave,cantidad,detalle,orden&order=orden');
    const mapa = {};
    filas.forEach((f) => {
      mapa[f.clave] = { cantidad: f.cantidad, detalle: f.detalle };
    });
    return mapa;
  },

  /** Equipos de un tipo: 'trf330l' | 'zq360' | 'mc3300' | 'mc3400'. */
  async equipos(tipo) {
    if (!configurado) return null;
    return rest(`equipos?select=codigo,serie&tipo=eq.${tipo}&order=codigo`);
  },

  /** Todos los equipos de una vez, agrupados por tipo. */
  async todosLosEquipos() {
    if (!configurado) return null;
    const filas = await rest('equipos?select=tipo,codigo,serie&order=codigo');
    const porTipo = { trf330l: [], zq360: [], mc3300: [], mc3400: [] };
    filas.forEach((f) => {
      if (porTipo[f.tipo]) porTipo[f.tipo].push({ trf: f.codigo, serie: f.serie });
    });
    return porTipo;
  },

  /** Historial de actualizaciones (page3). */
  async actualizaciones() {
    if (!configurado) return null;
    return rest('actualizaciones?select=fecha,leyenda&order=fecha.desc');
  },

  /** Historial de reparaciones (page4). */
  async reparaciones() {
    if (!configurado) return null;
    return rest('reparaciones?select=fecha,usuario,equipo,empresa,observacion&order=fecha.desc');
  },

  /** Equipos con detalle: 'laboratorio' o 'detalle'. */
  async equiposDetalle(tipo) {
    if (!configurado) return null;
    const filtro = tipo ? `&tipo=eq.${tipo}` : '';
    return rest(`equipos_detalle?select=id,tipo,codigo,nombre,descripcion,foto_url${filtro}&order=codigo`);
  },

  /** URL publica de una foto guardada en Storage. */
  urlFoto(ruta) {
    if (!configurado || !ruta) return '';
    // Si ya es una URL completa, se devuelve tal cual.
    if (/^https?:\/\//.test(ruta)) return ruta;
    return `${SUPABASE_URL}/storage/v1/object/public/fotos-equipos/${ruta}`;
  },
};

window.InventarioAPI = InventarioAPI;
