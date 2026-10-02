/**
 * Panel editor del inventario.
 *
 * Login con Supabase Auth (email + contrasena). Una vez autenticado permite
 * editar el resumen, los equipos y los historiales, y deja registro de cada
 * cambio en la tabla `bitacora`.
 */

const URL_BASE = window.SUPABASE_URL;
const ANON = window.SUPABASE_ANON_KEY;
const CLAVE_SESION = 'inventario_sesion';

let sesion = JSON.parse(localStorage.getItem(CLAVE_SESION) || 'null');
let cache = { resumen: [], equipos: [], actualizaciones: [], reparaciones: [] };

// ---------------------------------------------------------------- utilidades

function aviso(texto) {
  const box = document.getElementById('aviso');
  document.getElementById('avisoTexto').textContent = texto;
  box.classList.remove('d-none');
  setTimeout(() => box.classList.add('d-none'), 2500);
}

async function rest(path, options = {}) {
  const headers = {
    apikey: ANON,
    Authorization: `Bearer ${sesion?.access_token || ANON}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
    ...(options.headers || {}),
  };
  const res = await fetch(`${URL_BASE}/rest/v1/${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  const t = await res.text();
  return t ? JSON.parse(t) : null;
}

/** Deja registro del cambio en la bitacora. */
async function registrar(accion, tabla, detalle) {
  try {
    await rest('bitacora', {
      method: 'POST',
      body: JSON.stringify({
        usuario: sesion?.user?.email || 'desconocido',
        accion,
        tabla,
        detalle,
      }),
    });
  } catch (e) {
    console.warn('No se pudo registrar en bitacora', e);
  }
}

function fechaCorta(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
}

// ---------------------------------------------------------------- login

document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('btnLogin');
  const err = document.getElementById('loginError');
  err.classList.add('d-none');
  btn.disabled = true;
  btn.textContent = 'Entrando...';

  try {
    const res = await fetch(`${URL_BASE}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: ANON, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error_description || data.msg || 'Credenciales inválidas');

    sesion = data;
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    entrarAlPanel();
  } catch (ex) {
    err.textContent = ex.message;
    err.classList.remove('d-none');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Entrar';
  }
});

document.getElementById('btnSalir').addEventListener('click', async () => {
  try {
    await fetch(`${URL_BASE}/auth/v1/logout`, {
      method: 'POST',
      headers: { apikey: ANON, Authorization: `Bearer ${sesion?.access_token}` },
    });
  } catch (e) { /* la sesion local se borra igual */ }
  localStorage.removeItem(CLAVE_SESION);
  location.reload();
});

function entrarAlPanel() {
  document.getElementById('vistaLogin').classList.add('d-none');
  document.getElementById('vistaPanel').classList.remove('d-none');
  document.getElementById('btnSalir').classList.remove('d-none');
  document.getElementById('usuarioActual').textContent = sesion?.user?.email || '';
  cargarTodo();
}

// ---------------------------------------------------------------- carga

async function cargarTodo() {
  try {
    const [resumen, equipos, detalle, actualizaciones, reparaciones] = await Promise.all([
      rest('resumen?select=clave,cantidad,detalle,orden&order=orden'),
      rest('equipos?select=id,tipo,codigo,serie&order=codigo'),
      rest('equipos_detalle?select=id,tipo,codigo,nombre,descripcion,foto_url&order=codigo'),
      rest('actualizaciones?select=id,fecha,leyenda&order=fecha.desc'),
      rest('reparaciones?select=id,fecha,usuario,equipo,empresa,observacion&order=fecha.desc'),
    ]);
    cache = { resumen, equipos, detalle, actualizaciones, reparaciones };
    pintarResumen();
    pintarEquipos();
    pintarDetalle();
    pintarActualizaciones();
    pintarReparaciones();
    cargarBitacora();
  } catch (e) {
    aviso('Error al cargar: ' + e.message);
  }
}

async function cargarBitacora() {
  try {
    const filas = await rest('bitacora?select=usuario,accion,tabla,detalle,creado_en&order=creado_en.desc&limit=100');
    document.getElementById('tbodyBitacora').innerHTML = filas.map((f) => `
      <tr>
        <td class="small text-muted">${fechaCorta(f.creado_en)}</td>
        <td class="small">${f.usuario}</td>
        <td><span class="badge bg-secondary">${f.accion}</span></td>
        <td class="small">${f.tabla}</td>
        <td class="small">${f.detalle}</td>
      </tr>`).join('');
  } catch (e) {
    console.warn(e);
  }
}

// ---------------------------------------------------------------- resumen

function pintarResumen() {
  document.getElementById('tbodyResumen').innerHTML = cache.resumen.map((f) => `
    <tr data-clave="${f.clave}">
      <td class="small font-monospace">${f.clave}</td>
      <td><input type="number" class="form-control form-control-sm res-cantidad" value="${f.cantidad}"></td>
      <td><input type="text" class="form-control form-control-sm res-detalle" value="${(f.detalle || '').replace(/"/g, '&quot;')}"></td>
    </tr>`).join('');
}

document.getElementById('btnGuardarResumen').addEventListener('click', async () => {
  const filas = [...document.querySelectorAll('#tbodyResumen tr')];
  try {
    for (const tr of filas) {
      const clave = tr.dataset.clave;
      const cantidad = Number(tr.querySelector('.res-cantidad').value);
      const detalle = tr.querySelector('.res-detalle').value;
      const original = cache.resumen.find((r) => r.clave === clave);
      if (original.cantidad === cantidad && original.detalle === detalle) continue;

      await rest(`resumen?clave=eq.${encodeURIComponent(clave)}`, {
        method: 'PATCH',
        body: JSON.stringify({ cantidad, detalle }),
      });
      await registrar('editar', 'resumen',
        `${clave}: cantidad ${original.cantidad}->${cantidad}, detalle "${original.detalle}" -> "${detalle}"`);
    }
    aviso('Resumen guardado');
    cargarTodo();
  } catch (e) {
    aviso('Error: ' + e.message);
  }
});

// ---------------------------------------------------------------- equipos

const NOMBRE_TIPO = { trf330l: 'TRF 330L', zq360: 'Impresoras ZQ360', mc3300: 'MC3300', mc3400: 'MC3400' };

function pintarEquipos() {
  const tipo = document.getElementById('tipoEquipo').value;
  const filas = cache.equipos.filter((e) => e.tipo === tipo);
  document.getElementById('tbodyEquipos').innerHTML = filas.map((f, i) => `
    <tr data-id="${f.id}" data-tipo="${f.tipo}">
      <td class="text-muted small">${i + 1}</td>
      <td><input type="text" class="form-control form-control-sm eq-codigo" value="${f.codigo}"></td>
      <td><input type="text" class="form-control form-control-sm eq-serie" value="${f.serie}"></td>
      <td><button class="btn btn-sm btn-outline-danger eq-borrar"><i class="bi bi-trash"></i></button></td>
    </tr>`).join('');
}

document.getElementById('tipoEquipo').addEventListener('change', pintarEquipos);

document.getElementById('btnNuevoEquipo').addEventListener('click', () => {
  const tipo = document.getElementById('tipoEquipo').value;
  const tbody = document.getElementById('tbodyEquipos');
  const tr = document.createElement('tr');
  tr.dataset.id = '';
  tr.dataset.tipo = tipo;
  tr.dataset.nuevo = '1';
  tr.innerHTML = `
    <td class="text-muted small">+</td>
    <td><input type="text" class="form-control form-control-sm eq-codigo" placeholder="T00"></td>
    <td><input type="text" class="form-control form-control-sm eq-serie" placeholder="numero de serie"></td>
    <td><button class="btn btn-sm btn-outline-danger eq-borrar"><i class="bi bi-trash"></i></button></td>`;
  tbody.prepend(tr);
});

document.getElementById('tbodyEquipos').addEventListener('click', (e) => {
  if (e.target.closest('.eq-borrar')) e.target.closest('tr').remove();
});

document.getElementById('btnGuardarEquipos').addEventListener('click', async () => {
  const filas = [...document.querySelectorAll('#tbodyEquipos tr')];
  try {
    for (const tr of filas) {
      const codigo = tr.querySelector('.eq-codigo').value.trim();
      const serie = tr.querySelector('.eq-serie').value.trim();
      if (!codigo || !serie) continue;

      if (tr.dataset.nuevo === '1') {
        await rest('equipos', {
          method: 'POST',
          body: JSON.stringify({ tipo: tr.dataset.tipo, codigo, serie }),
        });
        await registrar('crear', 'equipos', `${NOMBRE_TIPO[tr.dataset.tipo]} ${codigo} (${serie})`);
      } else {
        const original = cache.equipos.find((e) => String(e.id) === tr.dataset.id);
        if (original && (original.codigo !== codigo || original.serie !== serie)) {
          await rest(`equipos?id=eq.${tr.dataset.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ codigo, serie }),
          });
          await registrar('editar', 'equipos',
            `${NOMBRE_TIPO[tr.dataset.tipo]} ${original.codigo} (${original.serie}) -> ${codigo} (${serie})`);
        }
      }
    }
    aviso('Equipos guardados');
    cargarTodo();
  } catch (e) {
    aviso('Error: ' + e.message);
  }
});

// ---------------------------------------------------------------- equipos en detalle

const NOMBRE_TIPO_DETALLE = { laboratorio: 'Equipos en Laboratorio', detalle: 'Equipos con Detalle' };

/** Clave del resumen que corresponde a cada tipo. */
const CLAVE_RESUMEN = { laboratorio: 'equiposLab', detalle: 'equiposDetalle' };

/** Cantidad declarada en el resumen (la condicionante). */
function cantidadDeclarada(tipo) {
  const fila = cache.resumen.find((r) => r.clave === CLAVE_RESUMEN[tipo]);
  return fila ? fila.cantidad : 0;
}

function pintarDetalle() {
  const tipo = document.getElementById('tipoDetalle').value;
  const filas = cache.detalle.filter((d) => d.tipo === tipo);
  const cont = document.getElementById('listaDetalle');

  cont.innerHTML = filas
    .map(
      (f) => `
    <div class="col-md-6 col-lg-4">
      <div class="card h-100" data-id="${f.id}">
        <div class="card-body">
          <div class="text-center mb-2">
            <img class="dt-preview rounded" src="${f.foto_url ? window.InventarioAPI.urlFoto(f.foto_url) : ''}"
                 alt="" style="width:100%;height:130px;object-fit:cover;background:#eef2f7;${f.foto_url ? '' : 'display:none;'}">
            <div class="dt-sin-foto text-muted small py-4" style="${f.foto_url ? 'display:none;' : ''}">
              <i class="bi bi-camera" style="font-size:1.6rem;"></i><br>Sin foto
            </div>
          </div>
          <input type="file" class="form-control form-control-sm dt-file mb-2" accept="image/*">
          <input type="text" class="form-control form-control-sm mb-2 dt-codigo" placeholder="Código (T16)" value="${(f.codigo || '').replace(/"/g, '&quot;')}">
          <input type="text" class="form-control form-control-sm mb-2 dt-nombre" placeholder="Nombre del equipo" value="${(f.nombre || '').replace(/"/g, '&quot;')}">
          <textarea class="form-control form-control-sm dt-descripcion" rows="2" placeholder="Descripción del desperfecto">${(f.descripcion || '').replace(/</g, '&lt;')}</textarea>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <span class="badge bg-light text-dark dt-estado">${f.foto_url ? 'Foto cargada' : 'Falta foto'}</span>
            <button class="btn btn-sm btn-outline-danger dt-borrar"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    </div>`
    )
    .join('');

  actualizarCondicionante();
}

/** Muestra si falta subir fotos para cumplir con la cantidad declarada. */
function actualizarCondicionante() {
  const tipo = document.getElementById('tipoDetalle').value;
  const declarada = cantidadDeclarada(tipo);
  const conFoto = [...document.querySelectorAll('#listaDetalle .dt-preview')]
    .filter((img) => img.style.display !== 'none').length;
  const total = document.querySelectorAll('#listaDetalle .card').length;

  const aviso = document.getElementById('avisoCondicionante');
  aviso.classList.remove('d-none', 'alert-success', 'alert-warning', 'alert-danger');

  if (declarada === 0 && total === 0) {
    aviso.classList.add('alert', 'alert-secondary');
    aviso.innerHTML = `<i class="bi bi-info-circle"></i> No hay equipos declarados en el resumen.`;
    return;
  }

  if (total !== declarada) {
    aviso.classList.add('alert', 'alert-warning');
    aviso.innerHTML = `<i class="bi bi-exclamation-triangle"></i> El resumen declara <strong>${declarada}</strong> equipo(s) y aquí hay <strong>${total}</strong>. Ajústalos con "Agregar equipo" o "Ajustar a la cantidad del resumen".`;
    return;
  }

  if (conFoto < declarada) {
    aviso.classList.add('alert', 'alert-warning');
    aviso.innerHTML = `<i class="bi bi-camera"></i> Faltan fotos: <strong>${conFoto} de ${declarada}</strong> equipos tienen foto. Cada equipo necesita la suya.`;
    return;
  }

  aviso.classList.add('alert', 'alert-success');
  aviso.innerHTML = `<i class="bi bi-check-circle"></i> Todo en orden: <strong>${declarada}</strong> equipo(s) con su foto y descripción.`;
}

document.getElementById('tipoDetalle').addEventListener('change', pintarDetalle);

/** Al elegir un archivo: valida 2 MB, comprime y actualiza la vista previa. */
document.getElementById('listaDetalle').addEventListener('change', async (e) => {
  const input = e.target.closest('.dt-file');
  if (!input) return;
  const card = input.closest('.card');
  const archivo = input.files[0];
  if (!archivo) return;

  const resultado = await window.OptimizadorImagen.optimizarImagen(archivo);
  if (!resultado.ok) {
    aviso(resultado.error);
    input.value = '';
    return;
  }

  const preview = card.querySelector('.dt-preview');
  const sinFoto = card.querySelector('.dt-sin-foto');
  preview.src = URL.createObjectURL(resultado.blob);
  preview.style.display = '';
  sinFoto.style.display = 'none';
  card.dataset.pendiente = '1';
  card.dataset.pesoFinal = resultado.pesoFinal;

  card.querySelector('.dt-estado').textContent =
    `Lista para subir (${window.OptimizadorImagen.formatearPeso(resultado.pesoFinal)})`;
  actualizarCondicionante();
});

document.getElementById('listaDetalle').addEventListener('click', (e) => {
  if (e.target.closest('.dt-borrar')) {
    e.target.closest('.col-md-6').remove();
    actualizarCondicionante();
  }
});

/** Agrega una tarjeta vacía para un equipo nuevo. */
document.getElementById('btnNuevoDetalle').addEventListener('click', () => {
  const tipo = document.getElementById('tipoDetalle').value;
  cache.detalle.push({ id: '', tipo, codigo: '', nombre: '', descripcion: '', foto_url: '' });
  pintarDetalle();
});

/** Rellena o quita tarjetas hasta igualar la cantidad del resumen. */
document.getElementById('btnSincronizarDetalle').addEventListener('click', () => {
  const tipo = document.getElementById('tipoDetalle').value;
  const declarada = cantidadDeclarada(tipo);
  const actuales = document.querySelectorAll('#listaDetalle .card').length;

  if (actuales < declarada) {
    for (let i = actuales; i < declarada; i += 1) {
      cache.detalle.push({ id: '', tipo, codigo: '', nombre: '', descripcion: '', foto_url: '' });
    }
    pintarDetalle();
    aviso(`Se agregaron ${declarada - actuales} tarjeta(s).`);
  } else if (actuales > declarada) {
    aviso(`Hay más tarjetas (${actuales}) que equipos declarados (${declarada}). Elimina las que sobren.`);
  } else {
    aviso('Ya coinciden con la cantidad declarada.');
  }
});

/** Sube una foto a Storage y devuelve su ruta. */
async function subirFoto(archivo) {
  const resultado = await window.OptimizadorImagen.optimizarImagen(archivo);
  if (!resultado.ok) throw new Error(resultado.error);

  const res = await fetch(
    `${URL_BASE}/storage/v1/object/fotos-equipos/${resultado.nombre}`,
    {
      method: 'POST',
      headers: {
        apikey: ANON,
        Authorization: `Bearer ${sesion?.access_token}`,
        'Content-Type': 'image/jpeg',
        'x-upsert': 'true',
      },
      body: resultado.blob,
    },
  );
  if (!res.ok) throw new Error(`No se pudo subir la foto (${res.status})`);
  return resultado.nombre;
}

document.getElementById('btnGuardarDetalle').addEventListener('click', async () => {
  const tipo = document.getElementById('tipoDetalle').value;
  const declarada = cantidadDeclarada(tipo);
  const tarjetas = [...document.querySelectorAll('#listaDetalle .card')];

  // Condicionante: mismo numero de equipos que declara el resumen
  if (declarada > 0 && tarjetas.length !== declarada) {
    aviso(`El resumen declara ${declarada} equipo(s) pero hay ${tarjetas.length}. Ajústalos antes de guardar.`);
    return;
  }

  try {
    for (const card of tarjetas) {
      const codigo = card.querySelector('.dt-codigo').value.trim();
      const nombre = card.querySelector('.dt-nombre').value.trim();
      const descripcion = card.querySelector('.dt-descripcion').value.trim();
      const input = card.querySelector('.dt-file');

      if (!codigo || !nombre) {
        aviso('Cada equipo necesita al menos código y nombre.');
        return;
      }

      let foto = cache.detalle.find((d) => String(d.id) === card.dataset.id)?.foto_url || '';
      if (input.files[0]) {
        card.querySelector('.dt-estado').textContent = 'Subiendo…';
        foto = await subirFoto(input.files[0]);
      }

      if (!foto) {
        aviso(`El equipo ${codigo} no tiene foto. Cada equipo necesita la suya.`);
        return;
      }

      const cuerpo = { tipo, codigo, nombre, descripcion, foto_url: foto };
      if (card.dataset.id) {
        await rest(`equipos_detalle?id=eq.${card.dataset.id}`, {
          method: 'PATCH', body: JSON.stringify(cuerpo),
        });
        await registrar('editar', 'equipos_detalle', `${NOMBRE_TIPO_DETALLE[tipo]} ${codigo}`);
      } else {
        await rest('equipos_detalle', { method: 'POST', body: JSON.stringify(cuerpo) });
        await registrar('crear', 'equipos_detalle', `${NOMBRE_TIPO_DETALLE[tipo]} ${codigo}`);
      }
    }
    aviso('Equipos en detalle guardados');
    cargarTodo();
  } catch (e) {
    aviso('Error: ' + e.message);
  }
});

// ---------------------------------------------------------------- actualizaciones

function pintarActualizaciones() {
  document.getElementById('tbodyActualizaciones').innerHTML = cache.actualizaciones.map((f) => `
    <tr data-id="${f.id}">
      <td><input type="date" class="form-control form-control-sm ac-fecha" value="${(f.fecha || '').slice(0, 10)}"></td>
      <td><input type="text" class="form-control form-control-sm ac-leyenda" value="${(f.leyenda || '').replace(/"/g, '&quot;')}"></td>
      <td><button class="btn btn-sm btn-outline-danger ac-borrar"><i class="bi bi-trash"></i></button></td>
    </tr>`).join('');
}

document.getElementById('btnNuevaActualizacion').addEventListener('click', () => {
  const hoy = new Date().toISOString().slice(0, 10);
  const tr = document.createElement('tr');
  tr.dataset.nuevo = '1';
  tr.innerHTML = `
    <td><input type="date" class="form-control form-control-sm ac-fecha" value="${hoy}"></td>
    <td><input type="text" class="form-control form-control-sm ac-leyenda" placeholder="Describe el cambio"></td>
    <td><button class="btn btn-sm btn-outline-danger ac-borrar"><i class="bi bi-trash"></i></button></td>`;
  document.getElementById('tbodyActualizaciones').prepend(tr);
});

document.getElementById('tbodyActualizaciones').addEventListener('click', (e) => {
  if (e.target.closest('.ac-borrar')) e.target.closest('tr').remove();
});

document.getElementById('btnGuardarActualizaciones').addEventListener('click', async () => {
  try {
    for (const tr of [...document.querySelectorAll('#tbodyActualizaciones tr')]) {
      const fecha = tr.querySelector('.ac-fecha').value;
      const leyenda = tr.querySelector('.ac-leyenda').value.trim();
      if (!fecha || !leyenda) continue;

      if (tr.dataset.nuevo === '1') {
        await rest('actualizaciones', { method: 'POST', body: JSON.stringify({ fecha, leyenda }) });
        await registrar('crear', 'actualizaciones', `${fecha}: ${leyenda}`);
      } else {
        const original = cache.actualizaciones.find((a) => String(a.id) === tr.dataset.id);
        if (original && (original.leyenda !== leyenda || (original.fecha || '').slice(0, 10) !== fecha)) {
          await rest(`actualizaciones?id=eq.${tr.dataset.id}`, {
            method: 'PATCH', body: JSON.stringify({ fecha, leyenda }),
          });
          await registrar('editar', 'actualizaciones', `${fecha}: ${leyenda}`);
        }
      }
    }
    aviso('Actualizaciones guardadas');
    cargarTodo();
  } catch (e) {
    aviso('Error: ' + e.message);
  }
});

// ---------------------------------------------------------------- reparaciones

function pintarReparaciones() {
  document.getElementById('tbodyReparaciones').innerHTML = cache.reparaciones.map((f) => `
    <tr data-id="${f.id}">
      <td><input type="date" class="form-control form-control-sm rp-fecha" value="${(f.fecha || '').slice(0, 10)}"></td>
      <td><input type="text" class="form-control form-control-sm rp-usuario" value="${(f.usuario || '').replace(/"/g, '&quot;')}"></td>
      <td><input type="text" class="form-control form-control-sm rp-equipo" value="${(f.equipo || '').replace(/"/g, '&quot;')}"></td>
      <td><input type="text" class="form-control form-control-sm rp-empresa" value="${(f.empresa || '').replace(/"/g, '&quot;')}"></td>
      <td><input type="text" class="form-control form-control-sm rp-observacion" value="${(f.observacion || '').replace(/"/g, '&quot;')}"></td>
      <td><button class="btn btn-sm btn-outline-danger rp-borrar"><i class="bi bi-trash"></i></button></td>
    </tr>`).join('');
}

document.getElementById('btnNuevaReparacion').addEventListener('click', () => {
  const hoy = new Date().toISOString().slice(0, 10);
  const tr = document.createElement('tr');
  tr.dataset.nuevo = '1';
  tr.innerHTML = `
    <td><input type="date" class="form-control form-control-sm rp-fecha" value="${hoy}"></td>
    <td><input type="text" class="form-control form-control-sm rp-usuario" value="${sesion?.user?.email || ''}"></td>
    <td><input type="text" class="form-control form-control-sm rp-equipo" placeholder="T01"></td>
    <td><input type="text" class="form-control form-control-sm rp-empresa" placeholder="STG"></td>
    <td><input type="text" class="form-control form-control-sm rp-observacion" placeholder="Observación"></td>
    <td><button class="btn btn-sm btn-outline-danger rp-borrar"><i class="bi bi-trash"></i></button></td>`;
  document.getElementById('tbodyReparaciones').prepend(tr);
});

document.getElementById('tbodyReparaciones').addEventListener('click', (e) => {
  if (e.target.closest('.rp-borrar')) e.target.closest('tr').remove();
});

document.getElementById('btnGuardarReparaciones').addEventListener('click', async () => {
  try {
    for (const tr of [...document.querySelectorAll('#tbodyReparaciones tr')]) {
      const datos = {
        fecha: tr.querySelector('.rp-fecha').value,
        usuario: tr.querySelector('.rp-usuario').value.trim(),
        equipo: tr.querySelector('.rp-equipo').value.trim(),
        empresa: tr.querySelector('.rp-empresa').value.trim(),
        observacion: tr.querySelector('.rp-observacion').value.trim(),
      };
      if (!datos.fecha || !datos.equipo) continue;

      if (tr.dataset.nuevo === '1') {
        await rest('reparaciones', { method: 'POST', body: JSON.stringify(datos) });
        await registrar('crear', 'reparaciones', `${datos.fecha} ${datos.equipo}: ${datos.observacion}`);
      } else {
        const original = cache.reparaciones.find((r) => String(r.id) === tr.dataset.id);
        if (original && JSON.stringify({ ...original, fecha: (original.fecha || '').slice(0, 10) }) !== JSON.stringify({ ...datos })) {
          await rest(`reparaciones?id=eq.${tr.dataset.id}`, { method: 'PATCH', body: JSON.stringify(datos) });
          await registrar('editar', 'reparaciones', `${datos.fecha} ${datos.equipo}: ${datos.observacion}`);
        }
      }
    }
    aviso('Reparaciones guardadas');
    cargarTodo();
  } catch (e) {
    aviso('Error: ' + e.message);
  }
});

// ---------------------------------------------------------------- arranque

if (!URL_BASE || !ANON) {
  document.getElementById('loginError').textContent =
    'Falta configurar Supabase en js/config.js';
  document.getElementById('loginError').classList.remove('d-none');
} else if (sesion?.access_token) {
  entrarAlPanel();
}
