// Datos de los gráficos
const AREAS = {
  labels: ['Peto', 'Lata', 'Jugos/Barriles', 'Casa Piedra'],
  data: [19, 18, 7, 6],
  backgroundColor: ['#28a745', '#0d6efd', '#6f42c1', '#fd7e14'],
};

const EQUIPOS = {
  labels: ['Picking', 'Backup', 'Libre Uso'],
  data: [50, 10, 72],
};

// Crea un gráfico solo si su canvas existe en la página.
function crearGrafico(id, tipo, datos, backgroundColor) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  new Chart(canvas, {
    type: tipo,
    data: {
      labels: datos.labels,
      datasets: [{ data: datos.data, backgroundColor }],
    },
    options:
      tipo === 'bar'
        ? { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        : {},
  });
}

// Distribución por área (slides 1 y 3)
crearGrafico('areaChart', 'pie', AREAS, AREAS.backgroundColor);
crearGrafico('areaChart2', 'pie', AREAS, AREAS.backgroundColor);

// Resumen de equipos (slides 1 y 2)
crearGrafico('equiposChart', 'bar', EQUIPOS, '#0d6efd');
crearGrafico('equiposChart2', 'bar', EQUIPOS, '#0d6efd');
