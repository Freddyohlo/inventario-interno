// Distribución por área
const ctx1 = document.getElementById('areaChart');
new Chart(ctx1, {
  type: 'pie',
  data: {
    labels: ['Peto', 'Lata', 'Jugos/Barriles', 'Casa Piedra'],
    datasets: [{
      data: [19 , 18 , 7 , 6 ], 
      backgroundColor: ['#28a745', '#0d6efd', '#6f42c1', '#fd7e14']
    }]
  }
});

// Distribución por área (copia para slide 3)
const ctx1_copy = document.getElementById('areaChart2');
new Chart(ctx1_copy, {
  type: 'pie',
  data: {
    labels: ['Peto', 'Lata', 'Jugos/Barriles', 'Casa Piedra'],
    datasets: [{
      data: [19 , 18 , 7 , 6 ], 
      backgroundColor: ['#28a745', '#0d6efd', '#6f42c1', '#fd7e14']
    }]
  }
});

// Resumen de equipos
const ctx2 = document.getElementById('equiposChart');
new Chart(ctx2, {
  type: 'bar',
  data: {
    labels: ['Picking', 'Backup', 'Libre Uso'], 
    datasets: [{
      label: 'Equipos',
      data: [50, 10, 72],
      backgroundColor: '#0d6efd'
    }]
  },
  options: {
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }
});

// Resumen de equipos (copia para slide 2)
const ctx2_copy = document.getElementById('equiposChart2');
new Chart(ctx2_copy, {
  type: 'bar',
  data: {
    labels: ['Picking', 'Backup', 'Libre Uso'], 
    datasets: [{
      label: 'Equipos',
      data: [50, 10, 72],
      backgroundColor: '#0d6efd'
    }]
  },
  options: {
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }
});