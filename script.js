const defaultInventarioData = {
  totalTrf: {
    cantidad: 117,
    detalle: '50 equipos picking, 10 backup y 57 libre uso',
  },
  impresoras: {
    cantidad: 60,
    detalle: '50 corresponden a picking y 10 a backup',
  },
  totalRadios: {
    cantidad: 51,
    detalle: '50 disponibles, 1 equipo defectuoso.',
  },
  totalBalizas: {
    cantidad: 24,
    detalle: '24 equipos operativos',
  },
  celulares: {
    cantidad: 6,
    detalle: 'Equipos operativos, 1 equipo se encuentra con trizadura',
  },
  equiposLab: {
    cantidad: 0,
    detalle: 'No hay equipos en laboratorio',
  },
  equiposDetalle: {
    cantidad: 1,
    detalle: 'Cel3 con trizadura de pantalla',
  },
  bateriasTrf: '200 (1,5 x equipo)',
  bateriasImpresoras: '105 (1,75 x equipo)',
  bateriasRadios: '60 (1,17 x equipo)',
  distribucionAreas: {
    peto: 19,
    lata: 18,
    jugosBarriles: 7,
    casaPiedra: 6,
  },
  resumenEquipos: {
    picking: 50,
    backup: 10,
    libreUso: 72,
  },
};

let inventarioData =
  JSON.parse(localStorage.getItem('inventarioData')) || defaultInventarioData;
let reportesData = JSON.parse(localStorage.getItem('reportes')) || [];

const historicalReportsInitialized = localStorage.getItem(
  'historicalReportsInitialized'
);

if (!historicalReportsInitialized) {
  reportesData = [
    {
      fecha: '08-09-2025',
      leyenda: 'Inicio del sistema de inventario con datos predeterminados.',
      datos: defaultInventarioData,
    },
    {
      fecha: '10-09-2025',
      leyenda:
        '* Se cambia mica de equipos trizados (T16, T20 y T26)\n* Se detalla impresora en laboratorio',
      datos: defaultInventarioData,
    },
    {
      fecha: '23-09-2025',
      leyenda: 'Se modifica la sección equipos en laboratorio',
      datos: defaultInventarioData,
    },
    {
      fecha: '07-10-2025',
      leyenda: 'Se modifica info de equipos en STG',
      datos: defaultInventarioData,
    },
    {
      fecha: '20-10-2025',
      leyenda: 'Regreso de equipos TRF T32 de STG',
      datos: defaultInventarioData,
    },
    {
      fecha: '21-10-2025',
      leyenda:
        'Se actualiza inventario de radios, teniendo diferencia en equipos de vuelta, aumentando 5 unid.',
      datos: defaultInventarioData,
    },
  ];

  localStorage.setItem('reportes', JSON.stringify(reportesData));
  localStorage.setItem('historicalReportsInitialized', 'true');
}

function updateSummaryCards() {
  document.getElementById('totalTrf').innerText =
    inventarioData.totalTrf.cantidad;
  document.getElementById('impresoras').innerText =
    inventarioData.impresoras.cantidad;
  document.getElementById('totalRadios').innerText =
    inventarioData.totalRadios.cantidad;
  document.getElementById('totalBalizas').innerText =
    inventarioData.totalBalizas.cantidad;
  document.getElementById('celulares').innerText =
    inventarioData.celulares.cantidad;
  document.getElementById('equiposLab').innerText =
    inventarioData.equiposLab.cantidad;
  document.getElementById('equiposDetalle').innerText =
    inventarioData.equiposDetalle.cantidad;

  document.getElementById('totalTrfDetalle').innerText =
    inventarioData.totalTrf.detalle;
  document.getElementById('impresorasDetalle').innerText =
    inventarioData.impresoras.detalle;
  document.getElementById('totalRadiosDetalle').innerText =
    inventarioData.totalRadios.detalle;
  document.getElementById('totalBalizasDetalle').innerText =
    inventarioData.totalBalizas.detalle;
  document.getElementById('celularesDetalle').innerText =
    inventarioData.celulares.detalle;
  document.getElementById('equiposLabDetalle').innerText =
    inventarioData.equiposLab.detalle;
  document.getElementById('equiposDetalleDetalle').innerText =
    inventarioData.equiposDetalle.detalle;

  document.getElementById(
    'bateriasTrf'
  ).innerText = `${inventarioData.bateriasTrf} unid.`;
  document.getElementById(
    'bateriasImpresoras'
  ).innerText = `${inventarioData.bateriasImpresoras} unid.`;
  document.getElementById(
    'bateriasRadios'
  ).innerText = `${inventarioData.bateriasRadios} unid.`;
  document.getElementById(
    'bateriasTrf2'
  ).innerText = `${inventarioData.bateriasTrf} unid.`;
  document.getElementById(
    'bateriasImpresoras2'
  ).innerText = `${inventarioData.bateriasImpresoras} unid.`;
  document.getElementById(
    'bateriasRadios2'
  ).innerText = `${inventarioData.bateriasRadios} unid.`;
}

/** Instancias de Chart.js por id de canvas, para poder destruirlas. */
const graficos = {};

/** Crea (o recrea) un grafico solo si su canvas esta visible. */
function crearGrafico(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  // Chart.js mide el contenedor al crear. Si el slide esta oculto
  // (display:none) mide 0x0 y el grafico queda en blanco, asi que se omite.
  if (canvas.offsetParent === null) return;

  // Si el canvas ya tiene un grafico, hay que destruirlo antes de reusarlo.
  if (graficos[id]) {
    graficos[id].destroy();
    delete graficos[id];
  }

  graficos[id] = new Chart(canvas, config);
}

const CONFIG_AREA = {
  type: 'pie',
  data: {
    labels: ['Peto', 'Lata', 'Jugos/Barriles', 'Casa Piedra'],
    datasets: [
      {
        data: [],
        backgroundColor: ['#28a745', '#0d6efd', '#6f42c1', '#fd7e14'],
      },
    ],
  },
};

const CONFIG_EQUIPOS = {
  type: 'bar',
  data: {
    labels: ['Picking', 'Backup', 'Libre Uso'],
    datasets: [{ label: 'Equipos', data: [], backgroundColor: '#0d6efd' }],
  },
  options: {
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  },
};

function datosArea() {
  return [
    inventarioData.distribucionAreas.peto,
    inventarioData.distribucionAreas.lata,
    inventarioData.distribucionAreas.jugosBarriles,
    inventarioData.distribucionAreas.casaPiedra,
  ];
}

function datosEquipos() {
  return [
    inventarioData.resumenEquipos.picking,
    inventarioData.resumenEquipos.backup,
    inventarioData.resumenEquipos.libreUso,
  ];
}

function configArea() {
  return {
    ...CONFIG_AREA,
    data: {
      ...CONFIG_AREA.data,
      datasets: [{ ...CONFIG_AREA.data.datasets[0], data: datosArea() }],
    },
  };
}

function configEquipos() {
  return {
    ...CONFIG_EQUIPOS,
    data: {
      ...CONFIG_EQUIPOS.data,
      datasets: [{ ...CONFIG_EQUIPOS.data.datasets[0], data: datosEquipos() }],
    },
  };
}

function updateCharts() {
  crearGrafico('areaChart', configArea());
  crearGrafico('areaChart2', configArea());
  crearGrafico('equiposChart', configEquipos());
  crearGrafico('equiposChart2', configEquipos());
}

/**
 * Recrea los graficos del slide que se acaba de mostrar.
 *
 * Los slides ocultos del carrusel tienen display:none, asi que Chart.js los
 * mide en 0x0 y quedan en blanco. Al mostrarse hay que redibujarlos.
 */
function inicializarCarrusel() {
  const carrusel = document.getElementById('graficosCarousel');
  if (!carrusel) return;

  carrusel.addEventListener('slid.bs.carousel', () => {
    updateCharts();
  });
}

/**
 * Carga los datos desde Supabase si esta configurado.
 *
 * Si Supabase no responde o no esta configurado, se conservan los datos
 * locales definidos arriba, asi el sitio nunca queda en blanco.
 */
async function sincronizarConSupabase() {
  if (!window.InventarioAPI || !window.InventarioAPI.configurado) return;

  try {
    const [resumen, equipos] = await Promise.all([
      window.InventarioAPI.resumen(),
      window.InventarioAPI.todosLosEquipos(),
    ]);

    if (resumen) {
      Object.keys(resumen).forEach((clave) => {
        const valor = resumen[clave];
        // Claves de tarjetas (cantidad + detalle)
        if (inventarioData[clave]) {
          inventarioData[clave].cantidad = valor.cantidad;
          inventarioData[clave].detalle = valor.detalle;
        }
      });
      // Areas y uso viven en objetos anidados
      inventarioData.distribucionAreas = {
        peto: resumen.areas_peto?.cantidad ?? inventarioData.distribucionAreas.peto,
        lata: resumen.areas_lata?.cantidad ?? inventarioData.distribucionAreas.lata,
        jugosBarriles: resumen.areas_jugos?.cantidad ?? inventarioData.distribucionAreas.jugosBarriles,
        casaPiedra: resumen.areas_casa?.cantidad ?? inventarioData.distribucionAreas.casaPiedra,
      };
      inventarioData.resumenEquipos = {
        picking: resumen.uso_picking?.cantidad ?? inventarioData.resumenEquipos.picking,
        backup: resumen.uso_backup?.cantidad ?? inventarioData.resumenEquipos.backup,
        libreUso: resumen.uso_libre?.cantidad ?? inventarioData.resumenEquipos.libreUso,
      };
      inventarioData.bateriasTrf = resumen.baterias_trf?.detalle ?? inventarioData.bateriasTrf;
      inventarioData.bateriasImpresoras = resumen.baterias_impresoras?.detalle ?? inventarioData.bateriasImpresoras;
      inventarioData.bateriasRadios = resumen.baterias_radios?.detalle ?? inventarioData.bateriasRadios;
    }

    // Equipos: se reemplazan los arrays locales con los de la base
    if (equipos) {
      trf330lData.length = 0; trf330lData.push(...equipos.trf330l);
      zq360Data.length = 0; zq360Data.push(...equipos.zq360);
      mc3300Data.length = 0; mc3300Data.push(...equipos.mc3300);
      mc3400Data.length = 0; mc3400Data.push(...equipos.mc3400);
    }

    updateSummaryCards();
    updateCharts();
  } catch (e) {
    console.warn('No se pudo sincronizar con Supabase, se usan los datos locales:', e);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  updateSummaryCards();
  updateCharts();
  inicializarCarrusel();
  await sincronizarConSupabase();
});
