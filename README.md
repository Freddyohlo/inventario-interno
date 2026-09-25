# 📡 Inventario interno — Equipos de radiofrecuencia

Reporte web estático para el levantamiento y control de equipos de radiofrecuencia
de una operación logística. Muestra el resumen de equipos por tipo y área, e
incluye páginas de detalle para cada categoría.

> Es un **reporte interno** de solo lectura: no tiene backend ni base de datos.
> Las cifras están definidas directamente en el HTML y el JavaScript.

## 📊 Qué muestra

- **Resumen general**: total de TRF, impresoras, radios, balizas y celulares.
- **Gráficos interactivos** (carrusel):
  - Distribución por área (Peto, Lata, Jugos/Barriles, Casa Piedra).
  - Resumen de equipos por uso (Picking, Backup, Libre Uso).
- **Páginas de detalle** (`page2.html`, `page3.html`) con la fecha de actualización.

## 🛠️ Tecnologías

- **HTML5** + **CSS3**
- **Bootstrap 5.3** (layout, tarjetas y carrusel) vía CDN
- **Chart.js** (gráficos) vía CDN
- **Bootstrap Icons** vía CDN

Sin build ni dependencias de Node para el contenido: el `package.json` solo
incluye `servor` para levantar un servidor local de estáticos.

## 🚀 Ver el reporte

### Opción 1 — Servidor local

```bash
npm install
npm start
```

Luego abre la URL que indique `servor` (por defecto en el puerto 8080).

### Opción 2 — Abrir directamente

Abre `index.html` en el navegador.

## 📁 Estructura

```
index.html      Página principal: resumen, tarjetas y carrusel de gráficos
page2.html      Detalle (recibe ?tipo=laboratorio o ?tipo=detalle)
page3.html      Fecha de actualización
script.js       Datos y construcción de los gráficos (Chart.js)
package.json    Servidor local de estáticos (servor)
```

## ✏️ Actualizar los datos

- Cifras del resumen: edita las tarjetas en `index.html`.
- Datos de los gráficos: edita los objetos `AREAS` y `EQUIPOS` en `script.js`.
- Fecha de actualización: enlace en la cabecera de `index.html`.

## 📄 Licencia

Uso interno. Todos los derechos reservados.
