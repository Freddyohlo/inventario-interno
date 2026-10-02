const modulosData = {
  "configuracion-trf": {
    titulo: "Configuración de TRF",
    pasos: [
      {
        numero: 1,
        nombre: "Reestablecimiento de fábrica",
        descripcion: "El equipo debe estar reestablecido a configuración de fábrica antes de comenzar, debes ir ajustes o configuración - sistema - opciones de restablecimiento - borrar todos los datos",
        fase: "prep",
        icono: "bi-arrow-clockwise",
        imagen: "Image/restablecer.jpg"
      },
      {
        numero: 2,
        nombre: "Seleccionar idioma",
        descripcion: "Selecciona español como idioma de la interfaz, despues no seleccionaras ninguna red wifi sino config. sin conexión, la fecha de igual manera no se configurará y se dará continuar, los servicios de google se apretara el botón aceptar y por último no elegiras ningún patron de seguridad",
        fase: "prep",
        icono: "bi-translate",
        imagen: "Image/idioma.jpg"
      },
      {
        numero: 3,
        nombre: "Conectar equipo al PC",
        descripcion: "Establece la conexión con el PC, esto permitira agregar los archivos necesarios para la configuración, recuerda dar la autorización a la TRF para poder traspasar los archivos, esto se hace desplegando el menú de la pantalla de arriba hacia abajo y presionar - cargando dispositivo mediante usb - transferencia de archivos",
        fase: "prep",
        icono: "bi-usb-symbol",
        imagen: "Image/conectar.jpg"
      },
      {
        numero: 4,
        nombre: "Traspaso de Archivos",
        descripcion: "Se deben traspasar 5 archivos desde el PC a la TRF, estos archivos se encuentran en la carpeta DCIM del computador y se deben enviar a la misma carpeta DCIM de la TRF",
        fase: "config",
        icono: "bi-file-earmark-arrow-down",
        imagen: "Image/Traspaso.jpg"
      },
      {
        numero: 5,
        nombre: "Instalación de Archivos",
        descripcion: "En primera instancia deberás instalar los 2 archivos que están seleccionados según la imagen, para instalar cada uno solo debes hacer 1 click sobre el archivo y continuar con la instalación, (recuerda los archivos estan en la carpeta DCIM)",
        fase: "config",
        icono: "bi-file-earmark-check",
        imagen: "Image/instalacion.jpg"
      },
      {
        numero: 6,
        nombre: "Mover Enterprise",
        descripcion: "Dentro de los 5 archivos debes seleccionar ENTERPRISE y luego presionar los 3 puntos en la esquina superior derecha, para luego seleccionar - Mover a...- Por último deberas seleccionar las 3 barras horizontales de la esquina superior izquierda - Seleccionar zebra folders - seleccionar enterprise - y presionar mover",
        fase: "config",
        icono: "bi-folder-symlink",
        imagen: "Image/enterprise.jpg"
      },
      {
        numero: 7,
        nombre: "DataWedge",
        descripcion: "Desde el menú principal de la TRF debes abrir la aplicación DataWedge, luego presionar los 3 puntos en la esquina superior derecha - configuración - importar - seleccionar donde sale solo 1 punto - luego busca la opción sdcard - DCIM - y selecciona datawedge.db",
        fase: "test",
        icono: "bi-database-gear",
        imagen: "Image/datawedge.jpg"
      },
      {
        numero: 8,
        nombre: "Traspaso Identificación Interna TRF",
        descripcion: "El archivo a traspasar ahora corresponde a la identificación interna del equipo, para esto debes saber a que numero de TRF pertenece o de lo contrario identificar si la TRF corresponde a picking o de libre movimiento, al momento de identificar este archivo debes traspasarlo desde el PC a la TRF a la carpeta - android - data - com.wavelink.velocity - files - y por último pegar el archivo",
        fase: "test",
        icono: "bi-person-badge",
        imagen: "Image/identificacion.jpg"
      },
      {
        numero: 9,
        nombre: "Conexión a Internet",
        descripcion: "Despliega el menú de la TRF desde arriba hacia abajo y selecciona la opcíón de conectar a internet, en este paso puedes pistolear el QR que se muestra a continuación y el equipo debería conectarse de manera automatica",
        fase: "test",
        icono: "bi-wifi",
        imagen: "Image/internet.jpg"
      },
      {
        numero: 10,
        nombre: "Detalles de Configuración",
        descripcion: "Ahora solo basta con modificar algunos detalles del equipo. En el menú principal de la TRF debes presionar los 3 puntos de la esquina superior derecha - preference - title - Aqui podras colocar el número del equipo, por último en configuración deberás deshabilitar la opción NFC",
        fase: "final",
        icono: "bi-check2-circle",
        imagen: "Image/detalles.jpg"
      }
    ]
  },
  "configuracion-impresora": {
    titulo: "Configuración de Impresora",
    pasos: [
      {
        numero: 1,
        nombre: "Conectar Impresora a PC",
        descripcion: "Primero se debe conectar la impresora al notebook como indica la foto.",

        fase: "prep",
        icono: "bi-power",
        imagen: "Image/conectarI.jpg"

      },
      {
        numero: 2,
        nombre: "Abrir Aplicación Zebra",
        descripcion: "Abrir en el escritorio la aplicación zebra para verificar la conexión entre la impresora y el pc.",

        fase: "prep",
        icono: "bi-app",
        imagen: "Image/appzebra.jpg"
      },
      {
        numero: 3,
        nombre: "Verificar La Conexión",
        descripcion: "En la aplicación debe aparecer un mensaje como el de la foto de ejemplo, esto indica que el equipo se encuentra conectado y listo para configurar.",


        fase: "config",
        icono: "bi-check-circle",
        imagen: "Image/verificarI.jpg"
      },
      {
        numero: 4,
        nombre: "Preparación De Archivo",
        descripcion: "En el block de notas, se debe modificar e indicar el núnero del equipo para el reconocimiento de la impresión como aparece en la foto.",

        fase: "config",
        icono: "bi-file-earmark-text",
        imagen: "Image/archivoI.jpg"
      },
      {
        numero: 5,
        nombre: "Traspaso De Archivo",
        descripcion: "Ahora que el equipo y el archivo están listos, se debe hacer el traspaso del archivo a la impresora.",

        fase: "test",
        icono: "bi-arrow-left-right",
        imagen: "Image/traspasoI.jpg"
      },
      {
        numero: 6,
        nombre: "Pasos Para Importación De Archivo",
        descripcion: "Primero debes buscar el botón Open Printers Tools, Segundo presionar la pestaña Action, Tercero buscar Send File, Luego buscar los 3 puntos en la esquina inferior derecha para buscar el archivo en el escritorio o en la carpeta de destino y por último presionar Send.",

        fase: "test",
        icono: "bi-printer",
        imagen: "Image/finalI.jpg"
      },
      {
        numero: 7,
        nombre: "Finalización",
        descripcion: "Si la configuración se realizo correctamente, la impresora de debe reiniciar y esto indica que el equipo esta listo para trabajar.",

        fase: "final",
        icono: "bi-check-circle",
        imagen: "Image/reinicioI.jpg"
      }
    ]
  },
  "reseteo-trf": {
    titulo: "Reseteo TRF",
    pasos: [
      {
        numero: 1,
        nombre: "Identificar Problema",
        descripcion: "Hay veces que el equipo trabaja de manera lenta, el lasér no funciona o queda estatica sin poder hacer movimientos en la TRF, una manera rápida de solucionar estos incovenientes es resetear de manera rapida el equipo.",


        fase: "prep",
        icono: "bi-exclamation-triangle",
        imagen: "Image/resetrf1.jpg"
      },
      {
        numero: 2,
        nombre: "Ejecutar Reseteo",
        descripcion: "Para realizar el reseteo se debe presionar de manera simulteana la tecla 1 + 9 + botón de encendido hasta que aparezca el logo de zebra.",

        fase: "final",
        icono: "bi-arrow-clockwise",
        imagen: "Image/resetrf1.jpg"
      }
    ]
  },
  "reseteo-impresora": {
    titulo: "Reseteo Impresora",
    pasos: [
      {
        numero: 1,
        nombre: "Apagar Impresora",
        descripcion: "Hay veces que el equipo trabaja de manera lenta, para realizar el reseeo se debe apagar completamente la impresora ZQ360 Plus.",

        fase: "prep",
        icono: "bi-power",
        imagen: "Image/resetI.jpg"

      },
      {
        numero: 2,
        nombre: "Ejecutar Reseteo",
        descripcion: "En este paso se debe presionar de manera constante el botón que expulsa papel durante 5 segundos, despues se debe presionar de manera simulteana el botón de encendido (sin dejar de presionar el botón anterior) despues se debe soltar el botón de encendido por 2 segundos y por último soltar todos los botones, en este paso debería salir el logo de zebra mas una impresión con los datos del equipo.",

        fase: "final",
        icono: "bi-arrow-clockwise",
        imagen: "Image/resetI.jpg"

      }
    ]
  },
  "pasillos": {
    titulo: "Pasillos",
    pasos: [
      {
        numero: 1,
        nombre: "Información de Pasillos",
        descripcion: "Los equipos TRF tienen pasillos establecidos que permiten destinar al pickeador a lugares donde debe realizar el trabajo, a continuación se detallara como modificar estos pasillos.",

        fase: "prep",
        icono: "bi-building",
        imagen: "Image/pasillos1.jpg"
      },
      {
        numero: 2,
        nombre: "Donde Modificar Pasillos",
        descripcion: "La opción de modificación de pasillos se encuentra en el sistema Cliente o aplicación de escritorio Dlx.exe, aqui debes ubicar la opción - Mantenimiento de Dispositivo - e indicar el número de TRF en - Nombre del Dispositivo.",

        fase: "prep",
        icono: "bi-signpost",
        imagen: "Image/pasillos2.jpg"
      },
      {
        numero: 3,
        nombre: "Modificar Ubicación de Pasillos",
        descripcion: "Al costado izquierdo encontraras todos los pasillos disponibles para trabajar, y en el sector derecho indica los pasillos que realmente tiene asignados el equipo TRF, aqui debes seleccionar y trasladar los pasillos que se requieran con la flechas de izquierda y derecha según lo requerido.",

        fase: "config",
        icono: "bi-pin-map",
        imagen: "Image/pasillos1.jpg"

      },
      {
        numero: 4,
        nombre: "Guardar Cambios",
        descripcion: "Al terminar toda la modificación requerida, se deben Guardar los cambios para dejar establecidos los pasillos requeridos.",

        fase: "test",
        icono: "bi-check2",
        imagen: "Image/pasillos1.jpg"

      }
    ]
  },
  "impresion-vales": {
    titulo: "Impresión de Vales",
    pasos: [
      {
        numero: 1,
        nombre: "Reimprimir Vales de Carga",
        descripcion: "El vale es un detalle de carga con los items que realizo un pickeador, para reimprimir este vale son necesario 2 datos, - La secuencia de viaje - y - LPN -.",

        fase: "prep",
        icono: "bi-file-earmark-text",
        imagen: "Image/imp1.jpg"
      },
      {
        numero: 2,
        nombre: "Menú Reimpresión",
        descripcion: "En el sistema web Blue Yonder es donde se puede reimprimir este vale, hay que buscar la opción - paginas personalizadas - Operaciones imprimir lista de surtido.",

        fase: "prep",
        icono: "bi-printer",
        imagen: "Image/imp2.jpg"
      },
      {
        numero: 3,
        nombre: "Seleccionar Datos",
        descripcion: "Ahora se debe ingresar la secuencia de carga en el rectangulo que aparece en la esquina superior derecha y presionar enter, despues apareceran los LPN y se debe seleccionar el requerido.",

        fase: "config",
        icono: "bi-input-cursor",
        imagen: "Image/imp3.jpg"
      },
      {
        numero: 4,
        nombre: "Enviar a Impresora",
        descripcion: "Teniendo todos lo datos seleccionados, se debe presionar - acciones - imprimir - y seleccionar el número de impresora a cual se enviara el documento -.",

        fase: "test",
        icono: "bi-printer-fill",
        imagen: "Image/imp4.jpg"
      },
      {
        numero: 5,
        nombre: "Búsqueda de Información",
        descripcion: "En caso de no tener información sobre la secuencia de viaje, el LPN. Hay varias formas de buscar esto, pero aqui se explicara con la opción de - Caja Pickeada - está opción se encuentra en la app de escritorio y seleccionando la fecha requerida aparece toda la información necesaria para imprimir el vale, incluso pudiendo filtrar por el pickeador para acotar la busqueda.",

        fase: "final",
        icono: "bi-search",
        imagen: "Image/imp5.jpg"
      }
    ]
  }
};

const faseInfo = {
  prep: { nombre: "Preparación", color: "prep" },
  config: { nombre: "Configuración", color: "config" },
  test: { nombre: "Pruebas", color: "test" },
  final: { nombre: "Finalización", color: "final" }
};

let currentModule = 'configuracion-trf';
let currentStep = 1;
let stepsData = [];
let totalSteps = 0;

function getModuleFromURL() {
  const params = new URLSearchParams(window.location.search);
  const modulo = params.get('modulo');
  return modulo && modulosData[modulo] ? modulo : 'configuracion-trf';
}

function loadModule(moduloId) {
  currentModule = moduloId;
  const modulo = modulosData[moduloId];

  if (!modulo) return;

  stepsData = modulo.pasos;
  totalSteps = stepsData.length;
  currentStep = 1;

  document.getElementById('moduleTitle').textContent = modulo.titulo;

  updateStep();
}

function updateStep() {
  const step = stepsData[currentStep - 1];

  if (!step) return;

  document.getElementById('currentStep').textContent = currentStep;
  document.getElementById('totalStepsDisplay').textContent = totalSteps;
  document.getElementById('stepTitle').textContent = `Paso ${currentStep} de ${totalSteps}`;
  document.getElementById('stepName').textContent = step.nombre;
  document.getElementById('stepDescription').textContent = step.descripcion;

  const avatarCircle = document.getElementById('avatarCircle');
  avatarCircle.className = `avatar-circle phase-${step.fase}`;
  avatarCircle.innerHTML = `<i class="bi ${step.icono} text-white" style="font-size: 3rem;"></i>`;

  const phaseBadge = document.getElementById('phaseBadge');
  phaseBadge.className = `badge phase-${step.fase}`;
  phaseBadge.textContent = faseInfo[step.fase].nombre;

  const progressPercent = (currentStep / totalSteps) * 100;
  document.getElementById('progressBar').style.width = progressPercent + '%';

  const stepImage = document.getElementById('stepImage');
  stepImage.src = step.imagen;

  document.getElementById('prevBtn').disabled = currentStep === 1;
  document.getElementById('nextBtn').disabled = currentStep === totalSteps;
}

function nextStep() {
  if (currentStep < totalSteps) {
    currentStep++;
    updateStep();
  }
}

function previousStep() {
  if (currentStep > 1) {
    currentStep--;
    updateStep();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const moduloInicial = getModuleFromURL();
  loadModule(moduloInicial);
});