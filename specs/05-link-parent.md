# SPEC 05 — Vincular padres en una demo local

> **Estado:** Implementado
> **Depende de:** SPEC 02
> **Fecha:** 2026-11-05
> **Objetivo:** Permitir añadir padres pendientes al perfil de Mateo mediante un modal de invitación sin envío real ni persistencia.

## Alcance

**Incluye:**

- Abrir el modal desde «Vincular otro padre» en `/kids/mateo-fernandez`.
- Adaptar `references/pantallas/vincular-padre.dc.html`, conservando textos, fuentes, colores y tarjeta de hasta 480 px.
- Solicitar nombre y email obligatorios.
- Seleccionar un único parentesco: Mamá, Papá o Tutor/a; inicialmente Mamá.
- Mostrar el código ilustrativo `7K4P9` y «Vence en 7 días».
- Mostrar «Demo: no se envían correos; el código y su vencimiento son ilustrativos. Los datos se descartan al recargar o salir del perfil».
- Al enviar datos válidos, añadir una entrada al final de los padres vinculados y cerrar el modal.
- Mostrar inicial, nombre, parentesco, «invitación enviada» y badge PENDIENTE, siguiendo la presentación existente. El aviso de demo permanece visible en la sección para aclarar la simulación.
- Permitir entradas repetidas.
- Cerrar mediante X o Escape sin guardar.
- Restablecer el formulario en cada apertura y devolver el foco al botón de apertura.
- Conservar las entradas únicamente durante la visita al perfil.

**Fuera de alcance (para futuras specs):**

- Correos, cuentas, permisos, códigos verificables y caducidad real.
- Backend y almacenamiento del navegador.
- Cambios en `/kids`, `/activate-account` u otros perfiles.
- Edición, eliminación y reenvío de invitaciones.

## Modelo de datos

Estado local del componente interactivo:

- `addedParents`: entradas temporales con `id`, `name`, `email` y `relationship`.
- `relationship`: `"mother" | "father" | "guardian"`.
- `id`: identificador local estable e independiente del nombre.
- Estado pendiente fijo para todas las entradas nuevas.

El formulario comienza con nombre y email vacíos. Se recortan espacios exteriores; un nombre compuesto solo por espacios es inválido. El email utiliza validación nativa de formato.

No se muestra el email en la tarjeta ni se transmite o persiste ningún campo. Lucía y Diego conservan su contenido actual. Recargar o abandonar el perfil elimina todas las entradas añadidas.

## Plan de implementación

1. Consultar las guías locales de Next.js en `node_modules/next/dist/docs/` y Context7 antes de introducir el componente cliente.
2. Extraer la sección de padres a `components/linked-parents.tsx`, manteniendo su presentación e integrándola desde `app/kids/[id]/page.tsx`.
3. Incorporar el modal con el patrón nativo de `<dialog>` utilizado en `/kids`, sin crear una abstracción compartida.
4. Incorporar selección de parentesco, validación, descarte del borrador y gestión del foco.
5. Conectar el envío con la lista temporal y cerrar el modal sin envío nativo del formulario.

Cada paso deja el sistema compilable y ejecutable. Antes de conectar el alta temporal, el formulario debe impedir el envío nativo de sus valores.

**Archivos previstos:**

- Modificar `app/kids/[id]/page.tsx`.
- Crear `components/linked-parents.tsx`.
- Añadir `.playwright-mcp/verify-spec-05.js` y capturas en ese directorio.
- Actualizar comprobaciones existentes únicamente si exigen que «Vincular otro padre» siga inactivo.

Sin nuevas dependencias ni cambios globales de estilos.

## Criterios de aceptación

- [x] «Vincular otro padre» abre un diálogo con título accesible mediante ratón y teclado.
- [x] Cada apertura muestra nombre y email vacíos y Mamá seleccionada.
- [x] Solo puede seleccionarse un parentesco; los tres son operativos con teclado.
- [x] Nombre vacío, solo espacios o email vacío o inválido impiden guardar y muestran validación.
- [x] Enviar mediante botón o Enter añade exactamente una entrada PENDIENTE y cierra el modal.
- [x] La entrada muestra la inicial, el nombre recortado y el parentesco elegido.
- [x] Dos envíos iguales generan dos entradas independientes, sin errores de claves.
- [x] Lucía y Diego permanecen sin cambios.
- [x] X y Escape descartan el borrador sin añadir entradas.
- [x] El foco entra en el diálogo, permanece dentro y vuelve al botón al cerrar.
- [x] Los campos tienen etiquetas asociadas y los controles muestran foco visible.
- [x] El código, vencimiento y avisos de demostración aparecen según el alcance.
- [x] A `1200x800`, el modal conserva la estructura, tarjeta de hasta 480 px, fuentes Fredoka/Nunito, colores, bordes y espaciados de la referencia, salvo su adaptación a diálogo y los avisos acordados.
- [x] A `390x844`, no hay desbordamiento horizontal y todos los controles son alcanzables mediante desplazamiento.
- [x] Recargar o abandonar y volver al perfil restaura únicamente a Lucía y Diego.
- [x] Los valores no se envían a servidores ni se incorporan a URLs, cookies, localStorage o sessionStorage.
- [x] El contador de `/kids` y la activación de cuenta permanecen sin cambios.
- [x] Playwright comprueba el flujo, validaciones, descarte, repetidos, foco y reinicio; las capturas de escritorio y móvil quedan en `.playwright-mcp/`.
- [x] `npm run lint` y `npm run build` pasan.

### Evidencia de verificación — 2026-11-05

Se recibió la spec en estado Aprobado. Se revisaron su alcance, el componente, su integración y las aserciones del script existente. Se ejecutaron nuevamente las pruebas y se añadieron comprobaciones suplementarias; no se tomó la entrega anterior como evidencia suficiente. Los criterios son operativos y no requirieron reescritura. No se modificó código de la aplicación.

Las rutas de scripts y capturas de esta sección son relativas a `.playwright-mcp/`.

| Criterio | Evidencia y resultado |
| --- | --- |
| 1 | Pasa: `verify-spec-05.js` abre por Enter y clic; `verifier-spec-05.js` comprueba apertura con Espacio. El diálogo se localiza por el nombre accesible «Vincular padre». |
| 2 | Pasa: campos vacíos y Mamá seleccionada en la apertura inicial y después de cerrar y reabrir. |
| 3 | Pasa: selección de las tres opciones mediante teclado y exactamente un radio marcado. También se usa la etiqueta de Tutor/a con ratón. |
| 4 | Pasa: cuatro envíos inválidos conservan el modal y no añaden entradas; se comprueba la invalidez nativa de los campos. |
| 5 | Pasa: envíos por botón y Enter cierran el modal y generan dos entradas independientes; el contador final es de tres PENDIENTE, incluido Diego. |
| 6 | Pasa: dos entradas «Ángela Spec05», recortadas, con inicial «Á» y «Tutor/a · invitación enviada». |
| 7 | Pasa: dos envíos con nombre y email iguales generan entradas distintas. Sin errores de ejecución ni advertencias de consola por claves duplicadas; el código usa un UUID local por entrada. |
| 8 | Pasa: el script suplementario compara el contenido completo de las dos filas originales antes y después del alta. No se modifican sus estilos al extraerlas del perfil. |
| 9 | Pasa: X y Escape cierran sin añadir entradas y las reaperturas restablecen el formulario. |
| 10 | Pasa: foco inicial en el nombre, ciclos de Tab dentro del modal, envoltura Tab/Shift+Tab entre extremos y retorno al disparador tras cancelar y guardar. |
| 11 | Pasa: campos localizados por sus etiquetas; el script suplementario comprueba foco de teclado con outline visible de al menos 2 px en cerrar, nombre, email, parentesco y enviar. Los radios comparten el mismo estilo de foco. |
| 12 | Pasa: código `7K4P9`, «Vence en 7 días» y aviso completo de demo. El aviso coincide exactamente tanto dentro del diálogo como en la sección de padres. |
| 13 | Pasa: referencia HTML servida en `localhost:3001`, capturada y comparada con la implementación a `1200x800`. Coinciden anchos, alturas de controles, padding, márgenes comparados, gaps, tamaños y pesos tipográficos, colores, fondos, gradiente y bordes visibles. Familias Nunito/Fredoka verificadas. Capturas revisadas visualmente. |
| 14 | Pasa: a `390x844` no hay desbordamiento horizontal en documento ni diálogo; campos y acciones se alcanzan con foco y desplazamiento. Captura móvil revisada. |
| 15 | Pasa: recargar elimina las dos entradas nuevas; abandonar mediante «Volver a Niños» y regresar elimina otra alta temporal. Solo quedan Lucía y Diego. |
| 16 | Pasa: script principal comprueba cookies y almacenamiento sin cambios, URL sin datos y ausencia de datos de prueba en solicitudes. El suplementario registra cero solicitudes durante el envío y cero llamadas a métodos de escritura de Storage. El código solo usa estado local y evita el envío nativo. |
| 17 | Pasa: tras un alta siguen «8 niños» y «2 padres vinculados» para Mateo en `/kids`. Activación conserva código `7K4P9` y email `lucia.fernandez@gmail.com`; no se modifican sus archivos. |
| 18 | Pasa: ambos scripts ejecutados sin fallos; capturas regeneradas en el directorio requerido. |
| 19 | Pasa: nuevas ejecuciones de `npm run lint`, `npm run build` y `git diff --check` sin errores. |

**Artefactos:**

- `verify-spec-05.js`: flujo, validaciones, parentesco, cancelación, foco, duplicados, responsive, privacidad y descarte.
- `verifier-spec-05.js`: comparación suplementaria de estilos y dimensiones contra el HTML, foco visible, avisos completos, ausencia de red/escrituras y regresión de contadores y activación.
- `verifier-spec-05-reference.png` y `verifier-spec-05-desktop.png`: referencia y modal a `1200x800`.
- `link-parent-spec-05-1200x800.png`, `link-parent-spec-05-390x844.png` y `link-parent-spec-05-added-mobile.png`: modal y altas temporales.
- `spec-05-verifier-console.log`: consulta de consola con nivel warning; sin advertencias ni errores. El script suplementario también recoge cero advertencias y errores durante su ejecución.

La comparación visual admite las adaptaciones acordadas: centrado y backdrop del diálogo, foco accesible y altura adicional del aviso. La comparación geométrica usa tolerancia de 0,5 px y omite color/estilo de bordes de ancho cero porque no son visibles. No es una comparación píxel a píxel. No existe una captura específica de esta pantalla en `references/screenshots/`; se usa el HTML como fuente visual acordada.

Se consultó Context7 mediante resolución y consulta de Next.js, además de la guía local de `use client`. El componente cliente anidado en la página servidor y las fuentes existentes con `next/font/google` y variables CSS siguen los patrones documentados.

**Dictamen:** 19/19 criterios verificados. Estado actualizado a Implementado. No se hicieron commits. Los scripts y capturas permanecen en `.playwright-mcp/`, directorio ignorado por Git según la configuración existente.

## Decisiones

- **Sí:** Modal local; es la solución mínima acordada y sigue el patrón existente.
- **Sí:** Entradas repetidas; no existe un directorio de cuentas contra el que validar.
- **Sí:** Estado limitado al perfil; evita sincronización no solicitada.
- **Sí:** Código fijo ilustrativo, coherente con la demo actual de activación.
- **Sí:** HTML como referencia visual principal, adaptado a modal accesible.
- **No:** Integración real con activación, correo o persistencia.
- **No:** Componentes genéricos, nuevas dependencias o cambios globales de estilos.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Confundir la simulación con un envío real | Mantener el aviso de demo visible tanto en el modal como en la sección de padres. |
| Envío accidental de datos del formulario | Impedir el envío nativo y actualizar únicamente estado local. |

## Qué **no** está en esta spec

- Correo real, autenticación y permisos.
- Persistencia y sincronización con otras pantallas.
- Códigos verificables y caducidad real.
- Edición, eliminación y reenvío de invitaciones.

Cada uno de esos, si llega, va en su propia spec.
