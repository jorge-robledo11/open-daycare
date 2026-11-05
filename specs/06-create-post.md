# SPEC 06 — Crear publicaciones temporales

> **Estado:** Implementado
> **Depende de:** SPEC 01
> **Fecha:** 2026-11-05
> **Objetivo:** Crear publicaciones temporales desde un modal con destinatarios, tipo, descripción y fotos locales, mostrándolas al inicio del feed.

## Alcance

**Incluye:**

- Adaptar `references/pantallas/crear-publicacion.dc.html` a un modal accesible de hasta 580 px.
- Abrirlo desde «Nueva publicación» y «Compartí un momento…».
- Desde Niños o el perfil, «Nueva publicación» navega al feed y abre el modal.
- Mostrar los ocho niños de la lista inicial de `/kids`: Mateo, Sofía, Benjamín, Valentina, Tomás, Emma, Lucas y Olivia.
- Elegir uno o varios niños mediante selección múltiple, o elegir Toda la sala como opción excluyente.
- Al seleccionar Toda la sala, desmarcar todos los niños; al seleccionar un niño, desmarcar Toda la sala.
- Permitir desmarcar niños y exigir al menos un destinatario para publicar.
- Elegir exactamente un tipo: Comida, Siesta, Actividad, Logro, Ánimo, Foto o Anuncio.
- Comenzar cada apertura con Mateo, Actividad, descripción vacía y ninguna foto.
- Exigir una descripción que no esté vacía ni contenga únicamente espacios.
- Adjuntar hasta cuatro imágenes JPEG, PNG o WebP, de hasta 5 MiB cada una.
- Previsualizar y quitar imágenes antes de publicar.
- Añadir la publicación al principio del feed, con hora local actual, «publicado por vos» y cero likes y comentarios.
- Conservar las publicaciones únicamente durante la visita al feed.
- Mostrar este aviso en el feed y el modal: «Demo: las publicaciones y fotos no se envían ni se guardan; se descartan al recargar o salir del feed».

**Fuera de alcance (para futuras specs):**

- Backend, almacenamiento del navegador y subida de imágenes.
- Edición, eliminación, likes y comentarios operativos.
- Sincronización con altas temporales de `/kids`.
- Visor de fotos, recorte y compresión.
- Nuevas rutas o dependencias.

## Modelo de datos

Estado temporal del feed:

- `addedPosts`: publicaciones nuevas, ordenadas de más reciente a más antigua.
- Cada publicación contiene `id`, `recipients`, `type`, `description`, `createdAt` y `photos`.
- `recipients`: array de identificadores `"mateo" | "sofia" | "benjamin" | "valentina" | "tomas" | "emma" | "lucas" | "olivia" | "room"`.
- El array no admite duplicados y debe contener al menos un elemento al publicar.
- `"room"` solo puede aparecer como único elemento del array.
- `type`: `"food" | "nap" | "activity" | "milestone" | "mood" | "photo" | "announcement"`.
- `photos`: imágenes locales con identificador, nombre y URL temporal.
- `id`: identificador local independiente del contenido.

Estado del formulario:

- Destinatarios y tipo seleccionados; inicialmente `recipients` es `["mateo"]`.
- Descripción.
- Fotos pendientes.
- Error de selección de archivos, cuando corresponda.
- Error de destinatarios, cuando no haya ninguno al intentar publicar.

Los contadores y estilos se derivan de estos datos; no se duplican como estado.

## Comportamiento

### Publicación

- Los destinatarios se seleccionan mediante checkboxes; el tipo conserva selección única mediante radios.
- Seleccionar Toda la sala sustituye los destinatarios por `["room"]`, sin conservar selecciones individuales anteriores.
- Seleccionar un niño mientras Toda la sala está marcada desmarca esa opción y selecciona únicamente ese niño.
- Desmarcar un niño conserva las demás selecciones individuales.
- Publicar sin destinatarios muestra «Elegí al menos un niño o Toda la sala.» y devuelve el foco al primer niño sin perder el borrador.
- Recortar los espacios exteriores de la descripción conservando los saltos de línea interiores.
- Las fotos son opcionales, también para el tipo Foto.
- Cada envío válido añade exactamente una tarjeta y cierra el modal.
- Permitir publicaciones repetidas con identificadores distintos.
- Conservar sin cambios las tres publicaciones originales.
- Para un niño, mostrar su nombre, inicial y «Para: familia de …».
- Para varios niños, mostrar sus nombres unidos con formato de lista en español y «Para: familias de …» en una única tarjeta; por ejemplo, «Mateo, Sofía y Olivia» y «Para: familias de Mateo, Sofía y Olivia».
- Para Toda la sala, mostrar «Toda la sala» y «Para: toda la sala», independientemente del tipo.
- Mostrar todas las fotos adjuntas en una cuadrícula adaptable dentro de la tarjeta.

### Fotos

- Validar formato, tamaño, cantidad total y posibilidad de cargar la imagen.
- Si una selección contiene archivos inválidos o supera el límite, rechazar esa selección completa y conservar las fotos anteriores.
- Mostrar un error concreto sin cerrar el modal ni perder la descripción.
- Cancelar el selector de archivos no altera el formulario.
- Liberar las URLs temporales al quitar fotos, descartar el borrador o abandonar el feed.
- Al publicar, mantener disponibles las imágenes mientras exista su tarjeta.

### Cierre y accesibilidad

- Cancelar y Escape descartan el borrador sin confirmación.
- Pulsar el fondo no cierra el modal.
- Cada apertura restablece los valores iniciales.
- El foco entra en el diálogo, permanece dentro y vuelve al disparador al cerrar.
- Si la apertura vino de otra pantalla, devolverlo a «Compartí un momento…».
- Identificar el diálogo mediante su título.
- Usar grupos de selección accesibles, etiquetas asociadas, foco visible y errores anunciados.

## Plan de implementación

1. Convertir `app/page.tsx` en componente cliente, manteniendo el contenido inicial y añadiendo el estado temporal del feed.
2. Crear `components/create-post-dialog.tsx` con el formulario y el patrón nativo de `<dialog>` existente.
3. Conectar los dos accesos y ampliar `components/app-shell.tsx` con un disparador opcional para el feed; desde las demás pantallas, enlazar a `/#new-post`.
4. Consumir y retirar ese marcador al abrir el diálogo, sin incorporar contenido del formulario a la URL.
5. Incorporar validación de descripción y destinatarios, selección múltiple de niños excluyente con Toda la sala, selección única de tipo y reinicio del borrador.
6. Añadir selección de archivos, validación, previsualización, eliminación y liberación de URLs temporales.
7. Conectar el envío con las tarjetas del feed y presentar sus destinatarios individuales o combinados y sus fotos sin modificar las tarjetas originales.

Cada paso deja la aplicación ejecutable. Los formularios impiden el envío nativo desde su incorporación.

**Archivos previstos:**

- Modificar `app/page.tsx`.
- Modificar `components/app-shell.tsx`.
- Crear `components/create-post-dialog.tsx`.
- Añadir `.playwright-mcp/verify-spec-06.js` y capturas en ese directorio.
- Actualizar únicamente las comprobaciones anteriores que exijan que los accesos de creación sigan inactivos.

Sin cambios globales de estilos. Las guías locales de Next.js y Context7 se consultaron para definir la frontera cliente y la navegación.

## Criterios de aceptación

- [x] Ambos accesos del feed abren el modal mediante ratón y teclado.
- [x] El acceso lateral desde `/kids` y el perfil navega al feed y abre el modal una sola vez.
- [x] Cada apertura comienza únicamente con Mateo seleccionado, Actividad, descripción vacía y ninguna foto.
- [x] Los tipos permiten exactamente una selección, también mediante teclado.
- [x] Descripción vacía o compuesta solo por espacios impide publicar y muestra validación.
- [x] Un envío válido añade exactamente una tarjeta al inicio y cierra el modal.
- [x] La tarjeta refleja los destinatarios, tipo, descripción, hora local y contadores iniciales en cero.
- [x] Las publicaciones repetidas aparecen como entradas independientes.
- [x] Se pueden añadir y quitar hasta cuatro imágenes válidas, con previsualizaciones.
- [x] Formatos no admitidos, archivos superiores a 5 MiB, imágenes ilegibles y selecciones que exceden cuatro fotos muestran error sin perder el borrador.
- [x] Las fotos publicadas permanecen visibles después de cerrar y volver a abrir el formulario.
- [x] Cancelar y Escape descartan el borrador; el fondo no cierra el diálogo.
- [x] El foco permanece dentro del modal y vuelve al control acordado al cerrar.
- [x] El diálogo tiene título accesible, la descripción tiene etiqueta asociada y los destinatarios y tipos se identifican por nombre y estado; Tab, Shift+Tab y Espacio permiten operar los controles con foco visible de al menos 2 px, y los errores de destinatarios y fotos se anuncian mediante `role="alert"`.
- [x] A `1200x800`, el modal conserva del HTML el ancho máximo de 580 px, radio de 24 px, borde y fondo de tarjeta, fuentes Fredoka/Nunito, padding de cabecera 20/26 px y cuerpo 24/26 px, separación de chips de 9 px, márgenes de grupos de 22 px, estilos de descripción y botón de fotos de 96 px; la comparación visual admite centrado y backdrop del diálogo, ocho niños, selección múltiple, tipo único seleccionado, formulario inicialmente vacío, avisos y foco accesible.
- [x] A `390x844`, todos los controles son alcanzables sin desbordamiento horizontal.
- [x] Recargar o abandonar y volver al feed restaura únicamente las tres publicaciones originales.
- [x] Texto y archivos no se transmiten ni se incorporan a URLs, cookies, localStorage o sessionStorage.
- [x] Se liberan las URLs temporales cuando dejan de utilizarse.
- [x] Las pruebas existentes de búsqueda y alta temporal de `/kids`, navegación al perfil de Mateo, vinculación temporal de padres y comparación visual de lista y barra lateral vuelven a pasar, salvo el cambio acordado en el acceso de creación.
- [x] Playwright comprueba el flujo y sus errores; las capturas quedan en `.playwright-mcp/`.
- [x] `npm run lint` y `npm run build` pasan.

### Criterios adicionales — selección múltiple de destinatarios

- [x] El selector muestra Mateo, Sofía, Benjamín, Valentina, Tomás, Emma, Lucas y Olivia, más Toda la sala.
- [x] Seleccionar varios niños conserva marcados todos los elegidos, mediante ratón y teclado.
- [x] Desmarcar un niño mantiene seleccionados los demás.
- [x] Seleccionar Toda la sala desmarca todos los niños y deja marcada únicamente esa opción.
- [x] Seleccionar un niño con Toda la sala marcada desmarca Toda la sala y deja seleccionado únicamente ese niño.
- [x] Publicar sin destinatarios mantiene abierto el modal, no añade tarjetas, muestra el error acordado y lleva el foco al primer niño sin perder el texto ni las fotos.
- [x] Publicar para varios niños añade exactamente una tarjeta con todos los nombres y el texto «Para: familias de …»; no genera una tarjeta por niño.
- [x] `.playwright-mcp/verify-spec-06.js` comprueba los ocho niños, selección acumulativa, deselección, exclusión de Toda la sala, validación sin destinatarios y publicación para varias familias.

### Evidencia de verificación — 2026-11-05

Se recibió la spec en estado Aprobado y se revisaron su contenido completo, los consumidores del modal y las aserciones del script existente. Se ejecutaron pruebas nuevas; los resultados anteriores del implementador no se tomaron como evidencia suficiente.

Los criterios 14, 15 y 20 mantienen su posición y se concretaron sin reducir su alcance: accesibilidad operable y foco de 2 px; medidas y estilos visuales comparables; regresiones ejecutables de las pantallas afectadas. Los demás criterios conservaron su redacción.

**Corrección mínima:** Los chips de destinatarios tenían una altura mínima de 41 px frente a los 40 px renderizados por el HTML. Se ajustó exclusivamente esa altura en `components/create-post-dialog.tsx` y se repitieron las comprobaciones funcionales y visuales dependientes.

En la tabla, los criterios 1–22 corresponden a la lista principal y los 23–30 a la lista adicional. Las rutas de scripts y capturas son relativas a `.playwright-mcp/`.

| Criterio | Evidencia y resultado |
| --- | --- |
| 1 | Pasa: `verify-spec-06.js` abre desde la barra lateral con clic, Enter y Espacio; desde «Compartí un momento…» con clic, Enter y Espacio. |
| 2 | Pasa: apertura desde `/kids` y el perfil de Mateo, consumo de `#new-post`, un único diálogo y ausencia de reapertura al recargar. |
| 3 | Pasa: aserciones de descripción vacía, cero fotos, Actividad y únicamente Mateo seleccionado en aperturas iniciales y posteriores a guardar o cancelar. |
| 4 | Pasa: selección de los siete tipos con Espacio, con exactamente un radio marcado. El script suplementario comprueba también su foco visible. |
| 5 | Pasa: descripción vacía y de solo espacios mantienen el diálogo abierto, sin nuevas tarjetas y con mensaje de validación nativa no vacío. |
| 6 | Pasa: cada envío suma una tarjeta al inicio y cierra el diálogo; envío por botón y por Enter sobre Publicar. |
| 7 | Pasa: textos individuales y combinados, tipo ÁNIMO, descripción recortada con saltos de línea conservados. `verifier-spec-06.js` compara la hora con la hora local del navegador antes y después de enviar y comprueba ambos contadores en cero. |
| 8 | Pasa: dos publicaciones con contenido idéntico permanecen como tarjetas distintas; sin errores de ejecución. El código usa un UUID por publicación. |
| 9 | Pasa: cuatro imágenes previsualizadas, incluidos JPEG, PNG y WebP; el suplementario elimina las cuatro de forma individual. También se admite una imagen válida de exactamente 5 MiB. |
| 10 | Pasa: texto no admitido, archivo de 5 MiB más un byte, imagen corrupta y selección que excede cuatro fotos. Se conservan descripción y foto anterior; las selecciones fallidas no incorporan archivos válidos del mismo lote. |
| 11 | Pasa: las cuatro fotos publicadas conservan sus URLs y permanecen legibles después de cerrar y reabrir el formulario. |
| 12 | Pasa: Cancelar descarta texto, selecciones y fotos; Escape descarta texto y una selección pendiente de decodificación. Las reaperturas restablecen el formulario. Clic en el fondo no cierra. |
| 13 | Pasa: foco inicial en descripción, ciclos de Tab y Shift+Tab dentro del modal, retorno al disparador al cancelar o guardar y a «Compartí un momento…» cuando la apertura procede de otra pantalla. |
| 14 | Pasa: localización por título y etiquetas accesibles; checkboxes y radios identificados por nombre y estado. El suplementario comprueba foco visible de al menos 2 px en todos los destinatarios, tipos y controles principales en ambos tamaños; errores con `role="alert"`. |
| 15 | Pasa: 27 comparaciones de estilos y dimensiones con el HTML a `1200x800`, incluidos tarjeta, cabecera, cuerpo, etiquetas, chips originales y avatares, tipos, descripción y botón Agregar. Capturas de referencia e implementación revisadas visualmente. |
| 16 | Pasa: a `390x844`, sin desbordamiento horizontal; cada destinatario, tipo y control principal es alcanzable con foco y desplazamiento. Capturas del inicio y final del modal revisadas. |
| 17 | Pasa: recargar descarta las altas; abandonar el feed y volver restaura las tres publicaciones originales. El contenido original se compara antes y después de publicar. |
| 18 | Pasa: cookies, localStorage y sessionStorage permanecen iguales y no se registran escrituras de Storage ni texto o nombres de archivos de prueba en solicitudes o URL. El formulario cancela el envío nativo y el código mantiene texto y blobs únicamente en memoria. |
| 19 | Pasa: instrumentación de creación y revocación de URLs en retirada de fotos, lotes rechazados, cancelación, Escape durante decodificación y salida del feed; las URLs publicadas se conservan mientras sus tarjetas existen. |
| 20 | Pasa: nuevas ejecuciones de `verify-spec-04.js`, `verify-spec-04-visual.js` y `verify-spec-05.js`, cubriendo búsqueda, altas, navegación, padres, responsive y comparación de lista y lateral. |
| 21 | Pasa: scripts principal y suplementario ejecutados sin errores; capturas de modal y feed guardadas en el directorio requerido. |
| 22 | Pasa: nuevas ejecuciones de `npm run lint` y `npm run build`, sin errores ni advertencias de lint. |
| 23 | Pasa: nueve checkboxes, localización individual de los ocho niños y Toda la sala, con los nombres acordados. |
| 24 | Pasa: selección acumulativa de los ocho niños con teclado y combinación de Mateo, Sofía y Olivia con ratón. |
| 25 | Pasa: quitar Sofía mantiene marcados los otros siete; comprobación adicional con Valentina, Tomás y Emma conserva Valentina y Emma al quitar Tomás. |
| 26 | Pasa: seleccionar Toda la sala tras marcar los ocho niños deja únicamente esa opción seleccionada. |
| 27 | Pasa: elegir Lucas con Toda la sala seleccionada desmarca la sala y selecciona únicamente Lucas. |
| 28 | Pasa: sin destinatarios no se añade tarjeta y aparece el mensaje exacto acordado con foco en Mateo. El suplementario conserva y compara descripción y URL de una foto legible tras el intento fallido. |
| 29 | Pasa: Mateo, Sofía y Olivia generan exactamente una tarjeta con «Para: familias de Mateo, Sofía y Olivia». |
| 30 | Pasa: script principal revisado, ampliado con deselección que conserva los otros siete niños y ejecutado de nuevo con todos los casos de selección múltiple. |

**Artefactos y límites de la comparación:**

- `verify-spec-06.js`: flujo completo, errores, fotos, privacidad, URLs temporales, reinicio y selección múltiple.
- `verifier-spec-06.js`: comparación con el HTML, conservación del borrador, límite de 5 MiB, hora local, contadores, foco y acceso a todos los controles.
- `verifier-spec-06-reference.png` y `verifier-spec-06-desktop.png`: referencia e implementación a `1200x800`.
- `verifier-spec-06-modal-{1200x800,390x844}.png` y `verifier-spec-06-bottom-{1200x800,390x844}.png`: inicio y final del diálogo.
- `create-post-spec-06-{1200x800,390x844}.png` y `create-post-feed-spec-06-{1200x800,390x844}.png`: formulario y publicación con fotos.
- `spec-06-verifier-console.log`: consulta de consola con cero errores y cero advertencias; el suplementario también registra cero advertencias y errores durante su ejecución.

Se revisaron `references/screenshots/compose.png` y `compose2.png`: la primera no muestra contenido útil y la segunda muestra otra pantalla. Prevalece el HTML acordado. La comparación combina visión y DOM/estilos, con tolerancia geométrica de 0,5 px; no es una comparación píxel a píxel. Se admiten exclusivamente las adaptaciones descritas en el criterio 15, incluida la altura adicional y el desplazamiento del modal. El color inicial de Comida difiere del HTML porque solo Actividad comienza seleccionada.

Se consultó Context7 mediante resolución y consultas de Next.js para frontera cliente, `next/font/google` y navegación con Link, además de la guía local de `use client`. Los componentes importados por la página cliente pertenecen a su grafo cliente; no se pasan callbacks desde componentes servidor. Las fuentes existentes conservan la configuración documentada con variables CSS. No se detectaron APIs deprecadas en el alcance revisado.

**Dictamen:** 30/30 criterios verificados. Estado actualizado a Implementado. Sin commits. Las publicaciones continúan siendo temporales por diseño. Los artefactos de `.playwright-mcp/` permanecen ignorados por Git según la configuración existente.

## Decisiones

- **Sí:** Demo temporal, coherente con las funcionalidades actuales.
- **Sí:** Uno o varios niños, o Toda la sala como opción excluyente, por ampliación solicitada por el usuario.
- **Sí:** Los ocho niños iniciales de `/kids`, conservando nombres cortos y colores de avatar en el selector, sin extraer un directorio compartido ni sincronizar altas temporales.
- **Sí:** Una sola tarjeta para varios destinatarios; evita duplicar publicaciones y fotos.
- **Sí:** Estado limitado al feed; no requiere contexto global.
- **Sí:** HTML como referencia visual, adaptado a diálogo y estados reales.
- **No:** Foto ilustrativa inicial ni descripción precargada.
- **No:** Componentes genéricos, persistencia o nuevas dependencias.

## Historial de cambios

### 2026-11-05 — Más niños y selección múltiple

- **Solicitud:** Añadir más niños y permitir seleccionar uno o varios, quitando todas las selecciones individuales al elegir Toda la sala.
- **Antes:** Tres niños del mockup y un único destinatario en `recipient`; la selección múltiple estaba fuera de alcance.
- **Ahora:** Ocho niños, selección múltiple en `recipients`, exclusión mutua con Toda la sala y validación de al menos un destinatario.
- **Integración:** `components/create-post-dialog.tsx` incorpora los checkboxes y la validación; `app/page.tsx` presenta las familias seleccionadas en una única tarjeta.
- **Pruebas:** Se amplió `.playwright-mcp/verify-spec-06.js` con los casos de selección múltiple y exclusión de Toda la sala.
- **Trazabilidad:** Se actualizan alcance, modelo de datos, comportamiento, plan y decisiones para sustituir la restricción original; se añaden criterios específicos sin marcar ningún check ni cambiar el estado Aprobado.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Confundir la demo con una publicación real | Aviso visible en formulario y feed. |
| Retener memoria de imágenes descartadas | Liberar URLs temporales y limitar archivos. |
| Perder publicaciones al navegar | Advertir explícitamente que son temporales. |

## Qué **no** está en esta spec

- Persistencia y envíos reales.
- Edición y eliminación.
- Interacciones sociales.

Cada uno de esos, si llega, va en su propia spec.
