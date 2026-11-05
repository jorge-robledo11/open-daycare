# SPEC 04 — Ajustes visuales y búsqueda de niños

> **Estado:** Implementado
> **Depende de:** SPEC 02
> **Fecha:** 2026-11-05
> **Objetivo:** Ajustar `/kids` a `ninos.dc.html` y permitir buscar y agregar niños mediante un modal de demostración sin persistencia.

## Alcance

**Incluye:**

- Revisar la pantalla existente contra `references/pantallas/ninos.dc.html` y corregir diferencias visuales.
- Filtrar inmediatamente por coincidencia parcial del nombre completo.
- Ignorar mayúsculas, tildes y espacios al principio o al final.
- Actualizar el contador según los resultados, usando «1 niño» o «N niños».
- Mostrar «0 niños» y «No se encontraron niños» cuando no haya coincidencias.
- Conservar la cabecera compacta y una columna en móvil.
- Mantener únicamente el enlace al perfil de Mateo.
- Abrir un modal al pulsar «Agregar niño», adaptando el diseño de `references/pantallas/agregar-nino.dc.html` sin crear una ruta nueva.
- Solicitar nombre completo y fecha de nacimiento como campos obligatorios, con Sala Soles fija. No admitir nombres compuestos solo por espacios ni fechas futuras.
- Al guardar datos válidos, añadir el niño al final de la lista temporal, cerrar el modal y actualizar la búsqueda y el contador sobre la lista completa. Conservar el filtro actual: el niño nuevo solo será visible si coincide con él.
- Mostrar los niños añadidos con inicial, edad calculada desde su fecha de nacimiento y «sin padres vinculados», sin enlace a perfil ni información clínica inventada.
- Cerrar el modal con Cancelar o Escape sin añadir niños. Abrirlo de nuevo presenta los campos vacíos.
- Mantener el foco dentro del modal abierto, identificarlo con un título accesible y devolver el foco a «Agregar niño» al cerrarlo.
- Adaptar el modal a escritorio y móvil, con todos sus campos y acciones accesibles mediante teclado y desplazamiento vertical.
- Mantener las altas solo en memoria durante la visita a `/kids`. Recargar o abandonar la pantalla descarta las altas; no se usa almacenamiento del navegador ni se envían datos a un servidor.
- Corregir exclusivamente los colores de enlaces y el interlineado de la barra lateral compartida para cerrar el criterio visual, según la ampliación de alcance solicitada por el usuario.

**Fuera de alcance (para futuras specs):**

- Alta persistente, edición y nuevos perfiles.
- Backend, autenticación y persistencia.
- Cambios en el contenido del feed, el perfil de Mateo o el comportamiento de la navegación compartida. Solo se permiten los ajustes visuales de la barra lateral descritos arriba.

## Modelo de datos

Se conserva el array `KIDS` de `app/kids/page.tsx` como lista inicial de ocho niños. El tipo `Kid` se reutiliza para las tarjetas añadidas.

El estado local comprende el texto de búsqueda `query`, inicialmente vacío, y las altas temporales `addedKids`, inicialmente vacías. Los resultados y el contador se calculan desde `KIDS` más `addedKids`; no se guardan como estado independiente. Cada alta recibe un identificador local estable para evitar usar el nombre como clave única.

El formulario contiene `name` y `birthDate` (fecha civil `YYYY-MM-DD`), inicialmente vacíos; la sala es siempre Soles. La edad se calcula en años cumplidos usando la fecha civil, sin desplazar el cumpleaños por conversiones UTC. No se incorporan padres, perfiles ni alergias al guardar.

El filtro conserva el orden original y coloca las altas al final. Vaciar el campo muestra toda la lista de esa visita. Recargar restaura los ocho niños iniciales y la búsqueda vacía. Cerrar el modal descarta el borrador del formulario.

## Plan de implementación

1. Consultar las guías locales de Next.js en `node_modules/next/dist/docs/` y Context7 antes de introducir estado interactivo.
2. Ajustar los estilos de `app/kids/page.tsx` que difieran del HTML y corregir los colores de enlaces e interlineado de la barra lateral en `components/app-shell.tsx`, sin alterar el comportamiento compartido.
3. Incorporar en esa página la búsqueda local, el contador derivado y el estado sin resultados. Mantener las tarjetas y sus enlaces actuales.
4. Añadir un nombre accesible al buscador y foco visible, conservando su diseño.
5. Convertir «Agregar niño» en un botón operativo y añadir el modal con los campos acordados, validación y gestión accesible del foco. Cancelar y Escape deben cerrar sin guardar.
6. Incorporar las altas en estado local, derivar edad y metadatos, y aplicar el filtro y el contador sobre la lista completa sin introducir persistencia.
7. Ampliar las comprobaciones de Playwright para validar apertura, errores de formulario, guardado, cancelación, Escape, foco, filtrado de altas y reinicio al recargar. Actualizar los scripts que todavía exigen que «Agregar niño» sea inactivo.

Cada paso deja el sistema compilable y ejecutable.

**Archivos previstos:**

- Modificar `app/kids/page.tsx`.
- Modificar exclusivamente los estilos de la barra lateral de `components/app-shell.tsx`.
- Añadir `.playwright-mcp/verify-spec-04.js` para comprobar el filtrado y las regresiones básicas.
- Añadir `.playwright-mcp/verify-spec-04-visual.js` para comparar el contenido principal y la barra lateral contra el HTML de referencia.
- Guardar las capturas de verificación en `.playwright-mcp/`.

No se añaden dependencias.

## Criterios de aceptación

- [x] En la visita inicial, sin búsqueda ni altas, aparecen los ocho niños en el orden y con los textos, colores y badges de la referencia.
- [x] A `1200x800`, la comparación con `ninos.dc.html` confirma una barra lateral de 248 px, contenedor principal de hasta 880 px con padding superior de 34 px y lateral de 40 px, grilla de dos columnas con separación de 14 px, fuentes Fredoka/Nunito y los mismos espaciados y colores en encabezado, buscador, tarjetas, botones y navegación.
- [x] Escribir `mate` muestra únicamente a Mateo Fernández y el contador «1 niño».
- [x] Escribir ` SOFIA ` muestra únicamente a Sofía Méndez.
- [x] Escribir `fernandez` encuentra a Mateo Fernández.
- [x] Escribir un nombre inexistente muestra «0 niños» y «No se encontraron niños», sin tarjetas.
- [x] Vaciar el buscador muestra todos los niños de la visita y el contador correspondiente, incluidas las altas temporales.
- [x] Recargar la página restablece la búsqueda vacía y las ocho tarjetas iniciales, descartando todas las altas temporales.
- [x] Solo la tarjeta de Mateo navega a su perfil; las otras tarjetas, incluidas las nuevas, no navegan. «Agregar niño» abre el modal.
- [x] El buscador tiene nombre accesible y foco visible al usar teclado.
- [x] A `390x844`, se conserva la cabecera compacta y una columna sin desbordamiento horizontal.
- [x] La búsqueda no envía solicitudes ni escribe en almacenamiento del navegador.
- [x] Los scripts de Playwright comprueban la búsqueda original y las altas temporales, sin seguir exigiendo que «Agregar niño» sea inactivo.
- [x] Se guardan capturas de escritorio y móvil en `.playwright-mcp/`.
- [x] `npm run lint` y `npm run build` pasan.
- [x] Pulsar «Agregar niño» con ratón o teclado abre un modal con título accesible y campos de nombre completo y fecha de nacimiento vacíos, con Sala Soles fija.
- [x] Guardar sin nombre, con nombre compuesto solo por espacios, sin fecha o con fecha futura mantiene el modal abierto, muestra validación e impide añadir la tarjeta.
- [x] Guardar un alta válida añade exactamente una tarjeta al final de la lista completa y cierra el modal; muestra inicial, nombre, edad en años cumplidos y «sin padres vinculados», sin enlace a perfil.
- [x] La edad es correcta antes, durante y después del cumpleaños, sin desfases por zona horaria.
- [x] Los niños añadidos participan en la búsqueda normalizada y en el contador; se conserva el filtro activo al guardar y limpiar ese filtro permite ver la lista completa.
- [x] Cancelar y Escape cierran sin añadir tarjetas; al volver a abrir, los campos están vacíos.
- [x] Dos altas con el mismo nombre se muestran como tarjetas distintas sin errores por claves duplicadas.
- [x] Al abrir, el foco entra en el modal; Tab y Shift+Tab no salen de él y, al cerrar, el foco vuelve a «Agregar niño».
- [x] A `1200x800` y `390x844`, el modal permite alcanzar todos los campos y acciones sin desbordamiento horizontal; se guardan capturas de ambos tamaños.
- [x] Guardar un alta no envía sus datos a un servidor ni los escribe en cookies, localStorage o sessionStorage.
- [x] Tras implementar el modal, los scripts de Playwright, `npm run lint` y `npm run build` vuelven a pasar.

Los 26 checks se respaldan con la validación final del modal documentada más abajo. Las dos secciones históricas siguientes se conservan como registro de la versión anterior, sin modal; no son el fundamento del cierre actual.

### Evidencia histórica de verificación (sin modal) — 2026-11-05

Los números siguientes corresponden a los 15 criterios de la versión anterior, no a la ampliación del modal.

- **1:** Comparación de las ocho tarjetas contra el DOM del HTML de referencia: coinciden iniciales, nombres, edades, padres vinculados, badges y colores calculados de avatares, nombres, metadatos, badges y fondos. Capturas revisadas visualmente.
- **2 — Verificado:** Tras la petición del usuario de cerrar el criterio pendiente, se amplió el alcance únicamente para corregir los estilos de la barra lateral compartida. `leading-[normal]` restaura el espaciado de referencia y las utilidades de color con el modificador `!` evitan que la regla global `a { color: inherit }` anule los colores de los enlaces. No se modifican los estilos globales ni los destinos de navegación.
- **Comparación reproducible del criterio 2:** `.playwright-mcp/verify-spec-04-visual.js` pasa a `1200x800`. Compara la barra lateral y todos los descendientes del contenido principal con `ninos.dc.html`: texto, familias de fuente, tamaños, pesos, colores, fondos, gradientes, bordes, radios, padding, gap, sombras y geometría. La tolerancia geométrica es de 0,5 px; se normalizan únicamente representaciones visualmente equivalentes (sombras transparentes auxiliares de Tailwind, radios limitados por el tamaño del elemento y color de bordes de ancho cero). «Nueva publicación» es blanco, «Niños» es `rgb(217, 88, 60)` y su posición vertical es 196 px, como en la referencia. El script requiere servir `references/pantallas` en `localhost:3001` además de la aplicación en `localhost:3000`.
- **Capturas del criterio 2:** Regeneradas `.playwright-mcp/kids-spec-04-1200x800.png` y `.playwright-mcp/kids-reference-spec-04-1200x800.png`, y revisadas visualmente. La comprobación automatizada compara DOM, estilos calculados y geometría; no es una comparación píxel a píxel.
- **3–8:** `.playwright-mcp/verify-spec-04.js` ejecutado correctamente: búsquedas `mate`, ` SOFIA `, `fernandez`, consulta inexistente, espacios, limpieza y recarga. Se comprueban nombres, orden, contador singular/plural y estado vacío.
- **9:** El script verifica el enlace de Mateo, la navegación al perfil y el regreso. «Agregar niño» no navega. Una comprobación adicional hizo clic en las otras siete tarjetas: no hubo navegación ni cambios en las ocho tarjetas.
- **10:** Playwright encuentra el buscador por su nombre accesible y comprueba foco de teclado con outline visible de al menos 2 px en ambos tamaños.
- **11:** Verificados cabecera móvil visible, lateral oculto, una columna y ausencia de desbordamiento horizontal tanto en el documento como en `main` a `390x844`.
- **12:** Al ejecutar las búsquedas no se registraron solicitudes ni llamadas a `Storage.setItem`, `removeItem` o `clear`. Cookies, localStorage y sessionStorage permanecieron sin cambios. El código solo actualiza estado local, sin APIs de red o persistencia.
- **13–14:** Script ejecutado y capturas guardadas: `.playwright-mcp/kids-spec-04-1200x800.png`, `.playwright-mcp/kids-spec-04-390x844.png` y `.playwright-mcp/kids-reference-spec-04-1200x800.png`. La comparación visual es manual, no píxel a píxel.
- **15:** `npm run lint` y `npm run build` completados sin errores.
- **Revalidación tras el cierre:** `.playwright-mcp/verify-spec-04.js`, lint, build y `git diff --check` pasan de nuevo. Feed y perfil de Mateo cargan a `1200x800` y `390x844`, sin errores de ejecución ni desbordamiento horizontal; la navegación Feed/Niños y el color de la sección activa pasan. Capturas en `.playwright-mcp/spec-04-regression-{feed,profile}-{1200x800,390x844}.png`. El contenido de ambas páginas y la cabecera móvil no se modifican.
- **Framework y consola:** Uso de `"use client"` y estado controlado confirmado con Context7 y las guías locales consultadas. `.playwright-mcp/spec-04-validation-console.log` registra cero errores y cero advertencias; solo mensajes informativos de React y HMR.

### Validación histórica de cierre del verificador (sin modal) — 2026-11-05

Esta revisión se ejecutó después de que el usuario devolviera el estado a Aprobado. Se inspeccionaron el código y los scripts y se repitieron las comprobaciones; los checks del builder no se tomaron como evidencia suficiente. No fue necesario modificar la implementación ni reescribir los criterios.

| Criterio | Resultado de esta ejecución |
| --- | --- |
| 1 | Pasa: comparación nueva contra el DOM del HTML, con las ocho tarjetas, orden, textos y estilos calculados coincidentes. |
| 2 | Pasa: script visual ejecutado de nuevo y capturas revisadas. El script adicional del verificador confirma lateral 248 px, contenedor 880 px, padding 34/40 px, gap 14 px, dos columnas, botón blanco y navegación activa coral. |
| 3 | Pasa: `mate` muestra solo Mateo y «1 niño». |
| 4 | Pasa: ` SOFIA ` muestra solo Sofía. |
| 5 | Pasa: `fernandez` encuentra Mateo sin exigir la tilde. |
| 6 | Pasa: consulta inexistente produce cero tarjetas, «0 niños» y el mensaje vacío. |
| 7 | Pasa: limpiar el campo restaura ocho tarjetas y «8 niños». |
| 8 | Pasa: búsqueda `mate`, recarga y comprobación de campo vacío y ocho tarjetas. |
| 9 | Pasa: navegación al perfil de Mateo y regreso; «Agregar niño» inactivo; clic individual en las otras siete tarjetas sin navegación ni cambios de contenido. |
| 10 | Pasa: nombre accesible «Buscar niño» y foco visible de teclado con outline sólido de al menos 2 px. |
| 11 | Pasa: `390x844`, cabecera compacta, lateral oculto, una columna sin desbordamiento y última tarjeta alcanzable mediante scroll. |
| 12 | Pasa: cero solicitudes durante las búsquedas y cero llamadas a métodos de escritura de Storage; cookies, localStorage y sessionStorage permanecen iguales. El código no contiene operaciones de persistencia ni red para el filtro. |
| 13 | Pasa: `.playwright-mcp/verify-spec-04.js` ejecutado nuevamente sin fallos, tras revisar sus aserciones. |
| 14 | Pasa: capturas nuevas de escritorio, móvil y final de la lista, guardadas y revisadas. |
| 15 | Pasa: nuevas ejecuciones de `npm run lint` y `npm run build` sin errores. |

**Evidencia nueva del verificador:**

- Script suplementario: `.playwright-mcp/verifier-spec-04-independent.js`, ejecutado correctamente además de los dos scripts originales revisados.
- Capturas: `.playwright-mcp/verifier-spec-04-desktop.png`, `.playwright-mcp/verifier-spec-04-mobile.png` y `.playwright-mcp/verifier-spec-04-mobile-bottom.png`.
- Referencia HTML capturada nuevamente: `.playwright-mcp/kids-reference-spec-04-1200x800.png`. También se revisaron `references/screenshots/ninos2.png` y `ninos.png`; el primero difiere del HTML y el segundo no muestra el contenido. Se mantiene el HTML como fuente de verdad acordada, sin copiar errores de las capturas secundarias.
- Consola: `.playwright-mcp/verifier-spec-04-console.log`, cero errores y cero advertencias. El script suplementario también detecta cero errores de ejecución.
- Context7 consultado de nuevo mediante resolución de biblioteca y consulta de documentación: `"use client"`, `useState` y el campo controlado siguen el patrón documentado. Se contrastó con la guía local de Next.js.
- Regresión básica nueva: feed y perfil responden 200 en escritorio y móvil, sin desbordamiento horizontal; navegación Feed/Niños operativa. No se afirma una auditoría completa de esas pantallas.

**Dictamen:** 15/15 criterios verificados. El verificador cambia el estado de Aprobado a Implementado. La revisión visual es manual y por DOM/estilos, con tolerancia geométrica de 0,5 px; no es una comparación píxel a píxel. No se realizaron commits.

### Validación final del verificador (alcance con modal) — 2026-11-05

Se recibió la spec en estado Aprobado. Se revisaron el alcance completo, la implementación y las aserciones de los scripts; se repitieron las pruebas sin tomar como evidencia suficiente la entrega del builder. Los criterios son verificables y no requirieron reescritura. No fue necesario modificar código de la aplicación.

En la tabla, los números corresponden al orden actual de los 26 criterios. Las rutas de scripts y capturas son relativas a `.playwright-mcp/`.

| Criterio | Evidencia nueva y resultado |
| --- | --- |
| 1 | Pasa: `verify-spec-04.js` comprueba nombres, orden y badges; `verify-spec-04-visual.js` compara textos y estilos de las ocho tarjetas contra el HTML. |
| 2 | Pasa: comparación visual automatizada ejecutada nuevamente y capturas revisadas. Lateral 248 px, contenedor 880 px, padding 34/40 px, gap 14 px, dos columnas y colores de navegación correctos. |
| 3 | Pasa: `mate` deja solo Mateo y «1 niño». |
| 4 | Pasa: ` SOFIA ` deja solo Sofía Méndez. |
| 5 | Pasa: `fernandez` encuentra a Mateo sin exigir la tilde. |
| 6 | Pasa: consulta inexistente produce cero tarjetas, «0 niños» y el mensaje vacío. |
| 7 | Pasa: después de dos altas y al limpiar el filtro aparecen diez tarjetas y «10 niños»; se comprueba también un alta en ambos tamaños. |
| 8 | Pasa: recargar descarta altas y filtro, y restaura las ocho tarjetas. |
| 9 | Pasa: Mateo navega al perfil y permite regresar; clic en las otras siete tarjetas y en una nueva no navega ni modifica la lista. El botón abre el modal. |
| 10 | Pasa: buscador localizado por nombre accesible y foco visible de teclado comprobado. |
| 11 | Pasa: a `390x844` hay cabecera compacta, lateral oculto, una columna y ausencia de desbordamiento horizontal. |
| 12 | Pasa: durante las búsquedas se registran cero solicitudes y cero llamadas a métodos de escritura de Storage; cookies y almacenamiento sin cambios. |
| 13 | Pasa: scripts revisados y ejecutados sobre búsqueda y altas. No quedan aserciones que exijan que «Agregar niño» sea inactivo. |
| 14 | Pasa: capturas de lista y modal regeneradas en escritorio y móvil dentro del directorio requerido. |
| 15 | Pasa: nuevas ejecuciones de lint y build sin errores. |
| 16 | Pasa: apertura con ratón, Enter y Espacio; diálogo identificado por «Agregar niño», campos vacíos y Sala Soles fija. |
| 17 | Pasa: cuatro envíos inválidos mantienen el diálogo abierto y ocho tarjetas. Los campos muestran mensajes nativos no vacíos para nombre vacío, espacios, fecha vacía y fecha futura. |
| 18 | Pasa: guardar añade exactamente una tarjeta al final, cierra el modal y muestra nombre recortado, inicial «Á», edad, «sin padres vinculados» y ningún perfil ni badge clínico. También se comprueba envío con Enter. |
| 19 | Pasa: seis casos con reloj fijo en Los Ángeles y Auckland, en ambos lados del cambio de fecha UTC. Edades esperadas antes, durante y después del cumpleaños: 2, 3 y 3 años. El código usa componentes de fecha civil, no `new Date(birthDate)`. |
| 20 | Pasa: alta coincidente y no coincidente con el filtro; se conserva `martina`, el contador refleja los resultados y limpiar muestra toda la lista. `SOFIA` encuentra tanto el dato inicial como el alta con tilde. |
| 21 | Pasa: Cancelar y Escape descartan los datos y no agregan tarjetas; ambas reaperturas muestran campos vacíos. |
| 22 | Pasa: dos altas «Martina López» permanecen como tarjetas distintas, sin errores de ejecución ni claves duplicadas en consola. |
| 23 | Pasa: foco inicial en el nombre; ciclos de Tab y Shift+Tab permanecen estrictamente dentro del diálogo. Cancelar, Escape y Guardar devuelven el foco al botón de apertura. |
| 24 | Pasa: todos los controles son alcanzables y caben en el viewport a `1200x800` y `390x844`; sin desbordamiento horizontal. Capturas revisadas en ambos tamaños. |
| 25 | Pasa: abrir y guardar no generan solicitudes ni llamadas de escritura a Storage. Cookies, localStorage y sessionStorage no cambian. El formulario impide el envío nativo y solo actualiza estado local. |
| 26 | Pasa: los seis scripts siguientes, lint, build y `git diff --check` se ejecutaron nuevamente sin errores. |

**Scripts ejecutados durante esta validación:**

- `verify-spec-04.js`: búsqueda, navegación, altas, contador, foco al guardar, responsive y privacidad de los datos.
- `check-modal-step5.js`: validación, cancelación, Escape, accesibilidad y acceso a controles.
- `check-modal-step6.js`: integración de las altas, nombres duplicados, descarte al abandonar la ruta y cálculo de edad en dos zonas horarias.
- `verify-spec-04-visual.js`: lista inicial y lateral comparadas con el HTML.
- `verifier-spec-04-independent.js`: mediciones explícitas, búsqueda sin red ni almacenamiento, siete tarjetas inactivas y comportamiento móvil.
- `verifier-spec-04-modal-extra.js`: comprobaciones adicionales del verificador para mensajes de validación, apertura con Espacio, guardado con Enter, reapertura vacía, inicial y ausencia de navegación en el alta.

**Artefactos revisados:**

- Lista: `kids-spec-04-1200x800.png`, `kids-spec-04-390x844.png` y referencia HTML regenerada `kids-reference-spec-04-1200x800.png`.
- Modal: `add-kid-spec-04-1200x800.png` y `add-kid-spec-04-390x844.png`, más las capturas de `check-modal-step5.js`.
- Alta: `verifier-spec-04-added-child.png`.
- Consola: `spec-04-modal-verifier-console.log`. Solo mensajes informativos de React/HMR; sin errores ni advertencias. El script de altas comprueba también que no aparezcan errores de claves duplicadas.

Se consultó Context7 mediante resolución y consulta de Next.js y se contrastó el patrón cliente con la guía local en `node_modules/next/dist/docs/`. No se detectaron APIs deprecadas en el código afectado.

La revisión visual combina visión y comparación de DOM/estilos con tolerancia geométrica de 0,5 px; no es una prueba píxel a píxel. Se revisó también `references/screenshots/ninos2.png`: ante sus diferencias con el HTML, prevalece el HTML acordado. El modal adapta `agregar-nino.dc.html` a los campos y comportamiento de la demo, sin añadir alergias ni notas médicas.

**Dictamen final del verificador:** 26/26 criterios pasan. Se marcan los checks pendientes y se cambia el estado de Aprobado a Implementado. No se hicieron commits. Los scripts y las capturas permanecen en `.playwright-mcp/`, directorio ignorado por Git según la configuración existente. Las altas son temporales y su descarte al salir o recargar es intencional.

## Decisiones

- **Sí:** Ampliar la implementación existente. SPEC 02 sigue documentando la versión estática anterior.
- **Sí:** Búsqueda local inmediata sobre los nombres de la lista inicial y las altas temporales.
- **Sí:** Modal de alta temporal basado en `agregar-nino.dc.html`, con nombre y fecha de nacimiento obligatorios y sala fija. La demo permite comprobar el flujo antes de integrar una base de datos.
- **Sí:** Las altas se descartan al recargar o abandonar `/kids`. Se conserva el filtro al guardar para no cambiar la búsqueda del usuario de forma inesperada.
- **No:** Backend, almacenamiento del navegador o perfiles ficticios para las altas temporales.
- **Sí:** HTML como referencia visual principal y adaptación móvil existente.
- **Sí:** Excepción mínima al alcance original, solicitada por el usuario para cerrar el check pendiente: corregir colores e interlineado de la barra lateral compartida y revalidar sus tres consumidores. No se alteran destinos ni comportamiento de navegación.
- **No:** Componentes genéricos, dependencias nuevas o refactor global de CSS.

## Qué **no** está en esta spec

- Alta persistente y formularios de edición.
- Perfiles adicionales.
- Datos reales y persistencia.

Cada uno de esos, si llega, va en su propia spec.
