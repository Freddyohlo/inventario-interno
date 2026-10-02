/**
 * Optimizador de imagenes.
 *
 * Valida el peso, redimensiona y comprime antes de subir. Todo en el navegador
 * con la Canvas API, sin librerias externas.
 */

const LIMITE_BYTES = 2 * 1024 * 1024; // 2 MB
const ANCHO_MAX = 1200; // suficiente para ver el desperfecto
const CALIDAD = 0.82;

function formatearPeso(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Valida y optimiza un archivo de imagen.
 *
 * Devuelve { ok: true, blob, nombre } o { ok: false, error }.
 */
async function optimizarImagen(archivo) {
  if (!archivo) return { ok: false, error: 'No se selecciono ninguna imagen.' };

  if (!archivo.type.startsWith('image/')) {
    return { ok: false, error: 'El archivo debe ser una imagen.' };
  }

  // Validacion de peso (2 MB)
  if (archivo.size > LIMITE_BYTES) {
    return {
      ok: false,
      error: `La imagen pesa ${formatearPeso(archivo.size)}. El maximo es 2 MB.`,
    };
  }

  try {
    const bitmap = await cargarImagen(archivo);
    const blob = await comprimir(bitmap);
    const nombre = nombreUnico(archivo.name);
    return { ok: true, blob, nombre, pesoOriginal: archivo.size, pesoFinal: blob.size };
  } catch (e) {
    return { ok: false, error: 'No se pudo procesar la imagen.' };
  }
}

function cargarImagen(archivo) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('imagen invalida'));
    };
    img.src = url;
  });
}

/** Redimensiona (si hace falta) y recomprime a JPEG. */
function comprimir(img) {
  return new Promise((resolve, reject) => {
    const escala = Math.min(1, ANCHO_MAX / img.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * escala);
    canvas.height = Math.round(img.height * escala);

    const ctx = canvas.getContext('2d');
    // Fondo blanco: evita que los PNG con transparencia salgan en negro.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('sin blob'))),
      'image/jpeg',
      CALIDAD,
    );
  });
}

/** Nombre unico para evitar colisiones en Storage. */
function nombreUnico(nombreOriginal) {
  const base = (nombreOriginal || 'foto')
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .slice(0, 40)
    .toLowerCase();
  return `${Date.now()}-${base}.jpg`;
}

window.OptimizadorImagen = { optimizarImagen, formatearPeso, LIMITE_BYTES };
