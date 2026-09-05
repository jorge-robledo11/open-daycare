# SPEC 01 — Home del feed estático

> **Estado:** Implementado
> **Depende de:** —
> **Fecha:** 2026-08-30
> **Objetivo:** Replicar la plantilla `references/pantallas/feed.dc.html` como la página `/` (home) con estética idéntica, contenido estático y sin autenticación ni base de datos.

## Alcance

**Incluye:**

- Reemplazar la plantilla inicial de Next.js en `/` por la pantalla de feed.
- Reproducir la estructura completa: barra lateral (logo, botón "Nueva publicación", navegación Feed/Niños/Avisos/Mi cuenta, perfil), encabezado de la sala y las tres publicaciones (logro, actividad con foto, anuncio).
- Cargar las fuentes Fredoka y Nunito mediante `next/font/google`.
- Mantener la barra lateral fija en escritorio con desplazamiento independiente del feed.
- Adaptar la pantalla a móvil: cabecera compacta y feed en una columna.
- Mantener todos los textos, nombres, fechas, contadores y publicaciones exactos y estáticos.
- Renderizar botones y enlaces únicamente como elementos visuales, sin navegación ni cambios de estado.

**Fuera de alcance (para futuras specs):**

- Autenticación, inicio de sesión y sesiones.
- Base de datos y persistencia.
- Navegación real hacia crear-publicación, detalle, foto, niños, avisos, mi-cuenta o inicio de sesión.
- Interacciones (me gusta, comentarios, edición).
- Las demás pantallas de la maqueta (`crear-publicacion`, `ninos`, `avisos`, `mi-cuenta`, etc.).

## Modelo de datos

Esta funcionalidad no introduce estructuras de datos nuevas: todo el contenido es estático y vive directamente en el JSX de `app/page.tsx`. No hay estado, props ni persistencia.

## Plan de implementación

1. Reemplazar el contenido de `app/page.tsx` con la estructura del feed estático replicando `references/pantallas/feed.dc.html`.
2. Sustituir las fuentes Geist en `app/layout.tsx` por Fredoka y Nunito usando `next/font/google`, y actualizar el `metadata`.
3. Ajustar `app/globals.css` con el fondo `#F6ECDF`, color de texto `#3F362E`, la tipografía Nunito por defecto y el estilo de la barra de desplazamiento de la referencia.
4. Añadir la estructura fija de escritorio (barra lateral fija, feed con scroll propio) y la adaptación móvil con cabecera compacta.
5. Verificar con `npm run lint`, `npm run build` y capturas de Playwright a `1200x800` y `390x844`.

Cada paso deja el sistema compilable y ejecutable (`npm run dev`).

## Criterios de aceptación

- [x] `npm run lint` y `npm run build` pasan sin errores.
- [x] `/` muestra el feed con estética idéntica a `references/screenshots/feed.png` a `1200x800` (la captura es la fuente de verdad; el HTML de referencia manda para medidas y contenido).
- [x] En escritorio la barra lateral permanece fija mientras el feed se desplaza de forma independiente.
- [x] A `390x844` la pantalla se adapta: cabecera compacta, navegación lateral oculta y tarjetas del feed en una columna completa.
- [x] Las tres publicaciones (logro, actividad con foto, anuncio) reproducen textos, contadores y metadatos estáticos exactos.
- [x] Las fuentes Fredoka y Nunito se cargan y los títulos y el cuerpo usan la tipografía correspondiente.
- [x] Ningún botón o enlace navega ni modifica el estado de la página.

## Decisiones

- **Sí:** Contenido 100% estático. No hay backend, así que extraer datos a estructuras separadas sería abstracción sin consumidor.
- **Sí:** `next/font/google` para Fredoka y Nunito. Es la integración nativa de Next.js; evita etiquetas `link` externas manuales.
- **Sí:** Fuente de verdad visual = `references/screenshots/feed.png`; el HTML de la plantilla se usa para medidas y contenido.
- **Sí:** Barra lateral fija con scroll propio del feed, replicando la plantilla en escritorio.
- **Sí:** Adaptación móvil con cabecera compacta y feed en una columna, porque la maqueta no define móvil.
- **Sí:** Controles únicamente visuales, sin destinos `href` reales, porque las rutas objetivo aún no existen.
- **No:** Crear rutas vacías para cada enlace. Ampliaría el alcance a la navegación sin necesidad actual.
- **No:** Datos de ejemplo separados en TypeScript. YAGNI mientras no exista un consumidor de datos.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Las fuentes de Google Fonts no están disponibles sin conexión | `next/font/google` usa como respaldo `system-ui, sans-serif`; la fidelidad se valida con el servidor de desarrollo en línea. |
| Diferencia sutil entre captura y HTML de referencia | Se prioriza la captura; cualquier divergencia se registra como decisión visual, no se reinterpreta. |

## Qué **no** está en esta spec

- Autenticación, base de datos o persistencia.
- Navegación real y rutas de las demás pantallas.
- Interacciones del feed (me gusta, comentarios, edición).
- Generación dinámica de contenido o fecha.

Cada uno de esos, si llega, va en su propia spec.