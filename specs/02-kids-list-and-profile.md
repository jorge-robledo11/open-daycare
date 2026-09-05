# SPEC 02 — Lista de niños y perfil estático

> **Estado:** Implementado
> **Depende de:** SPEC 01
> **Fecha:** 2026-09-05
> **Objetivo:** Replicar `references/pantallas/ninos.dc.html` y `references/pantallas/perfil-nino.dc.html` como las rutas `/kids` y `/kids/[id]` con contenido estático, extrayendo el shell compartido del feed y habilitando solo la navegación interna de estos flujos.

## Alcance

**Incluye:**

- Extraer la barra lateral, la cabecera móvil y el contenedor principal de `app/page.tsx` a un componente compartido, y reutilizarlo en el feed y en las pantallas nuevas.
- Crear `/kids` reproduciendo `ninos.dc.html`: encabezado "GESTIÓN / Niños", botón "Agregar niño", buscador, separador "SALA SOLES · 8 niños" y la grilla de las ocho tarjetas de niños con textos y badges estáticos exactos.
- Crear la ruta dinámica `/kids/[id]` reproduciendo `perfil-nino.dc.html` únicamente para el niño `mateo-fernandez`; cualquier otro `id` devuelve 404.
- Enlaces operativos: Feed y logo llevan a `/`, "Niños" a `/kids`, la tarjeta de Mateo a `/kids/mateo-fernandez` y "Volver a Niños" a `/kids`.
- Mantener el texto visible en español tal como está en las maquetas; el inglés se usa solo en las URLs (`/kids`).
- Adaptar ambas pantallas a móvil: cabecera compacta, contenido en una columna y sin scroll horizontal.
- Usar `ninos.dc.html` y `perfil-nino.dc.html` como fuente de verdad visual (contenido, medidas y estilos).

**Fuera de alcance (para futuras specs):**

- Perfiles funcionales para los otros siete niños: cada tarjeta no enlaza a un perfil propio.
- Autenticación, base de datos y persistencia.
- Búsqueda funcional, formularios (agregar/editar niño, vincular padre) y la pantalla de crear publicación.
- Las rutas `avisos`, `mi-cuenta`, `crear-publicacion`, `agregar-nino`, `vincular-padre`, `resumen-dia` y sus interacciones.
- Cambiar los textos visibles a inglés.

## Modelo de datos

Esta funcionalidad no introduce estructuras de datos nuevas ni persistencia. Los ocho niños de la lista son contenido estático renderizado desde un array local en el JSX de `app/kids/page.tsx` (mismo patrón que `POSTS` en `app/page.tsx`), y el perfil de Mateo es contenido estático del JSX de `app/kids/[id]/page.tsx`. No hay estado ni props entre sesiones.

## Plan de implementación

1. Crear `components/app-shell.tsx` con la barra lateral (logo, "Nueva publicación", navegación Feed/Kids/Avisos/Mi cuenta, perfil de Caro), la cabecera móvil compacta y el contenedor principal con scroll, parametrizado por la sección activa. Refactorizar `app/page.tsx` para usarlo y verificar que `/` sigue idéntica a `references/screenshots/feed.png`.
2. Crear `app/kids/page.tsx` con el encabezado, el buscador estático, el separador de sala y la grilla de las ocho tarjetas (nombre, edad, padres vinculados, badge de alergia o chevron). Solo la tarjeta de Mateo enlaza al perfil.
3. Crear `app/kids/[id]/page.tsx` con el perfil estático de Mateo: "Volver a Niños", cabecera con avatar y botón "Editar" visual, tarjeta de alergias y notas, tarjeta de datos (nacimiento, sala, ingreso), botón "Resumen del día" visual y tarjeta de padres vinculados (Lucía activa, Diego pendiente, "Vincular otro padre" visual). Si `id` no es `mateo-fernandez`, renderizar `notFound()`.
4. Conectar la navegación: logo y Feed a `/`, "Niños" a `/kids`, y el vínculo "Volver a Niños" a `/kids`, marcando la sección activa correcta en el shell.
5. Adaptar ambas pantallas a móvil: cabecera compacta del shell, grilla en una sola columna y paddings coherentes, sin scroll horizontal.
6. Verificar con `npm run lint`, `npm run build` y capturas de Playwright de `/kids` y `/kids/mateo-fernandez` a `1200x800` y `390x844` en `.playwright-mcp/`.

Cada paso deja el sistema compilable y ejecutable (`npm run dev`).

## Criterios de aceptación

- [x] `npm run lint` y `npm run build` pasan sin errores.
- [x] `/` no presenta regresiones visuales tras el refactor al shell compartido (comparado con `references/screenshots/feed.png`).
- [x] `/kids` reproduce `ninos.dc.html` a `1200x800`: ocho tarjetas con nombres, edades, contadores de padres y badges (MANÍ, LACTOSA, VINCULAR) exactos.
- [x] En `/kids`, la barra lateral está fija, la sección "Niños" aparece activa y el contenido se desplaza de forma independiente.
- [x] En `/kids`, solo la tarjeta de Mateo navega a `/kids/mateo-fernandez`; el resto de controles (buscador, "Agregar niño") no tienen comportamiento.
- [x] `/kids/mateo-fernandez` reproduce `perfil-nino.dc.html` a `1200x800`: avatar M, alergias y notas, datos (nacimiento, sala, ingreso), padres vinculados con sus estados y el botón "Resumen del día".
- [x] En el perfil, "Volver a Niños" navega a `/kids`; "Editar", "Resumen del día" y "Vincular otro padre" no navegan.
- [x] Navegación: en `/` la sección "Niños" lleva a `/kids`, y en `/kids` la sección "Feed" y el logo llevan a `/`.
- [x] Cualquier `/kids/[id]` distinto de `mateo-fernandez` devuelve 404.
- [x] Todo el texto visible permanece en español y coincide con las maquetas.
- [x] A `390x844`, `/kids` y `/kids/mateo-fernandez` se adaptan: cabecera compacta, sin barra lateral y contenido en una columna sin scroll horizontal.

## Decisiones

- **Sí:** Extraer solo el shell compartido (`components/app-shell.tsx`). Es el único elemento duplicado entre el feed, la lista y el perfil; avatares, badges y tarjetas aún no tienen tres consumidores que justifiquen su extracción.
- **Sí:** Rutas en inglés (`/kids`, `/kids/[id]`) con texto visible en español. Las URLs se mantienen en inglés mientras la UI replica fielmente las maquetas.
- **Sí:** Únicamente `mateo-fernandez` tiene perfil; los demás IDs devuelven 404. Solo existe una referencia de perfil y no se deben inventar datos.
- **Sí:** Solo navegan Feed, Niños, la tarjeta de Mateo y "Volver a Niños". Los demás enlaces no tienen destino real todavía.
- **Sí:** Fuente de verdad visual = los `.dc.html` (contenido, medidas y estilos). Hay diferencias entre `ninos2.png` y `ninos.dc.html`, y no existe captura del perfil, así que el HTML manda.
- **Sí:** Contenido estático en JSX con el patrón de array local de SPEC 01, sin estructuras de datos ni persistencia.
- **Sí:** Adaptación móvil propia (cabecera compacta, una columna) porque las maquetas no definen móvil, replicando el criterio de SPEC 01.
- **No:** Datos de niños separados en un módulo compartido con el perfil. No hay consumidor que lo requiera y cada pantalla usa su propio contenido estático.
- **No:** Perfiles para los ocho niños. Inventar ocho perfiles ampliaría el alcance sin referencia visual que los respalde.
- **No:** Búsqueda funcional ni formularios. Requieren estado y persistencia que quedan para specs posteriores.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| El refactor del shell altera `/` | Se valida con captura comparada contra `references/screenshots/feed.png` antes de construir las rutas nuevas. |
| No hay captura de referencia del perfil | El criterio de fidelidad se apoya en `perfil-nino.dc.html` y en una captura nueva en `.playwright-mcp/`. |
| Diferencias entre `ninos2.png` y `ninos.dc.html` | Se prioriza el HTML de referencia; `ninos2.png` queda solo como referencia secundaria de escritorio. |

## Qué **no** está en esta spec

- Perfiles funcionales ni contenido para los otros siete niños.
- Autenticación, base de datos o persistencia.
- Búsqueda funcional, formularios (agregar/editar, vincular padre) ni estados interactivos.
- Rutas `avisos`, `mi-cuenta`, `crear-publicacion`, `agregar-nino`, `vincular-padre` y `resumen-dia`.
- Textos visibles en inglés.

Cada uno de esos, si llega, va en su propia spec.
