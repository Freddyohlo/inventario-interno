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

let areaChartInstance;
let equiposChartInstance;

function updateCharts() {
  if (areaChartInstance) {
    areaChartInstance.destroy();
  }
  if (equiposChartInstance) {
    equiposChartInstance.destroy();
  }
  const ctx1 = document.getElementById('areaChart');
  areaChartInstance = new Chart(ctx1, {
    type: 'pie',
    data: {
      labels: ['Peto', 'Lata', 'Jugos/Barriles', 'Casa Piedra'],
      datasets: [
        {
          data: [
            inventarioData.distribucionAreas.peto,
            inventarioData.distribucionAreas.lata,
            inventarioData.distribucionAreas.jugosBarriles,
            inventarioData.distribucionAreas.casaPiedra,
          ],
          backgroundColor: ['#28a745', '#0d6efd', '#6f42c1', '#fd7e14'],
        },
      ],
    },
  });
  const ctx1_copy = document.getElementById('areaChart2');
  new Chart(ctx1_copy, {
    type: 'pie',
    data: {
      labels: ['Peto', 'Lata', 'Jugos/Barriles', 'Casa Piedra'],
      datasets: [
        {
          data: [
            inventarioData.distribucionAreas.peto,
            inventarioData.distribucionAreas.lata,
            inventarioData.distribucionAreas.jugosBarriles,
            inventarioData.distribucionAreas.casaPiedra,
          ],
          backgroundColor: ['#28a745', '#0d6efd', '#6f42c1', '#fd7e14'],
        },
      ],
    },
  });
  const ctx2 = document.getElementById('equiposChart');
  equiposChartInstance = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ['Picking', 'Backup', 'Libre Uso'],
      datasets: [
        {
          label: 'Equipos',
          data: [
            inventarioData.resumenEquipos.picking,
            inventarioData.resumenEquipos.backup,
            inventarioData.resumenEquipos.libreUso,
          ],
          backgroundColor: '#0d6efd',
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
  const ctx2_copy = document.getElementById('equiposChart2');
  new Chart(ctx2_copy, {
    type: 'bar',
    data: {
      labels: ['Picking', 'Backup', 'Libre Uso'],
      datasets: [
        {
          label: 'Equipos',
          data: [
            inventarioData.resumenEquipos.picking,
            inventarioData.resumenEquipos.backup,
            inventarioData.resumenEquipos.libreUso,
          ],
          backgroundColor: '#0d6efd',
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateSummaryCards();
  updateCharts();
});
