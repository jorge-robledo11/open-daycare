# SPEC 03 — Login y activación de cuenta de demostración

> **Estado:** Implementado
> **Depende de:** SPEC 01
> **Fecha:** 2026-11-05
> **Objetivo:** Replicar las pantallas de login y activación como una demo navegable, sin selector de rol ni autenticación real.

## Alcance

**Incluye:**

- Crear `/login` siguiendo `references/pantallas/login.dc.html`.
- Eliminar completamente «INGRESO COMO», Personal y Familia, sin reservar su espacio.
- Crear `/activate-account` siguiendo `references/pantallas/activar-cuenta.dc.html`.
- Mantener `/` como feed actual.
- Enlazar «Activá tu cuenta» con `/activate-account` e «Iniciar sesión» con `/login`.
- Navegar al feed al enviar cualquiera de los formularios con campos válidos.
- Mostrar en ambas pantallas: «Demo: no se verifican credenciales ni se guardan datos».
- Conservar los textos en español y reutilizar las fuentes existentes.
- Adaptar ambas pantallas a móvil y permitir su uso con teclado.

**Fuera de alcance (para futuras specs):**

- Autenticación, sesiones, protección de rutas y cierre de sesión.
- Backend, base de datos y persistencia.
- Verificación real de códigos o credenciales.
- Recuperación de contraseña y feed específico de familias.

## Modelo de datos

Solo hay valores temporales en los formularios:

| Pantalla | Campo | Nombre | Valor inicial | Validación |
| --- | --- | --- | --- | --- |
| Login | Email | `email` | Vacío | Obligatorio y formato email |
| Login | Contraseña | `password` | Vacío | Obligatoria |
| Activación | Código de invitación | `invitationCode` | `7K4P9` | Obligatorio |
| Activación | Email | `email` | `lucia.fernandez@gmail.com` | Obligatorio y formato email |
| Activación | Contraseña | `password` | Vacío | Obligatoria |
| Activación | Autorización de fotos | `photoConsent` | Desmarcada | Opcional y editable |

La tarjeta «Mateo · Sala Soles» es contenido estático y no cambia al editar el código.

No se introduce ningún rol. Los valores viven únicamente en los controles del formulario durante la visita. La aplicación no los envía a un servidor, los incorpora a una URL ni los guarda en cookies o almacenamiento del navegador.

## Plan de implementación

1. Consultar la documentación local de Next.js en `node_modules/next/dist/docs/` y Context7 antes de implementar las rutas y la navegación.
2. Crear `app/login/page.tsx` con el panel coral, el formulario y el enlace de activación, sin usar `AppShell`. No incluir el selector de rol.
3. Crear `app/activate-account/page.tsx` con la tarjeta estática de Mateo, los campos y una casilla real de autorización.
4. Incorporar validación nativa y navegación al feed, evitando el envío de los campos. Añadir el aviso de demo en ambas pantallas.
5. Completar la adaptación móvil y los estados de foco sin alterar las pantallas existentes.

Cada paso deja el sistema compilable y ejecutable. Mientras no esté conectada la navegación de envío, los formularios deben impedir el envío nativo de sus valores.

Los estilos quedan locales a las páginas. Se reutilizan las fuentes de `app/layout.tsx`, sin modificar `components/app-shell.tsx`, el feed ni `app/globals.css`. No se añaden dependencias.

## Criterios de aceptación

- [x] `/login` y `/activate-account` cargan directamente, sin barra lateral.
- [x] A `1200x800`, ambas pantallas reproducen sus HTML de referencia en estructura, medidas, colores, tipografías y contenido, salvo las diferencias explícitas de esta spec.
- [x] El login no muestra selector, etiqueta ni estado de Personal/Familia.
- [x] Email y contraseña del login comienzan vacíos.
- [x] La activación comienza con código `7K4P9`, email `lucia.fernandez@gmail.com`, contraseña vacía y autorización desmarcada.
- [x] La tarjeta «Mateo · Sala Soles» permanece estática al editar el código de invitación.
- [x] La casilla de fotos se puede alternar con ratón y teclado.
- [x] La activación permite continuar sin autorizar fotos.
- [x] Un campo obligatorio vacío o un email inválido impiden navegar y muestran la validación nativa.
- [x] Con campos válidos, enviar cualquiera de los formularios mediante su botón o la tecla Enter navega a `/`.
- [x] No se exige una longitud mínima adicional para la contraseña ni se comprueba el código contra una lista de invitaciones.
- [x] «Activá tu cuenta» navega de `/login` a `/activate-account`, y «Iniciar sesión» permite volver.
- [x] «¿Olvidaste tu contraseña?» conserva su apariencia, pero no navega ni ejecuta recuperación.
- [x] Ambas pantallas muestran «Demo: no se verifican credenciales ni se guardan datos».
- [x] La aplicación no envía solicitudes con los valores de los formularios ni los añade a URLs, cookies, localStorage o sessionStorage.
- [x] Todos los campos tienen etiquetas asociadas y los controles operativos muestran foco visible.
- [x] A `390x844`, el login muestra una cabecera coral breve con logo, sin texto promocional, y el formulario debajo.
- [x] A `390x844`, ambas pantallas tienen una columna, sin desbordamiento horizontal y con todos los controles accesibles mediante desplazamiento vertical.
- [x] El feed y las rutas de niños mantienen su comportamiento y presentación.
- [x] `npm run lint` y `npm run build` pasan sin errores.
- [x] Se comprueban con Playwright los campos obligatorios, el email inválido, la casilla opcional y la navegación de ambos formularios. Los artefactos se guardan en `.playwright-mcp/`.
- [x] Se generan capturas de ambas pantallas a `1200x800` y `390x844` en `.playwright-mcp/` para comprobar escritorio y móvil.

### Evidencia de verificación — 2026-11-05

- Comprobaciones ejecutadas con Playwright: `.playwright-mcp/verify-spec-03.js`. Resultado: validación nativa de cada campo obligatorio y del email, navegación por botón y Enter, consentimiento con ratón y teclado, enlaces, etiquetas y foco visible correctos.
- Se comprobó el envío con contraseña de un carácter y código no verificado, sin marcar consentimiento. No hubo solicitudes que incluyeran el email, código o contraseña de prueba ni almacenamiento de la contraseña.
- Capturas revisadas junto con los HTML de referencia: `.playwright-mcp/login-1200x800.png`, `.playwright-mcp/login-390x844.png`, `.playwright-mcp/activate-account-1200x800.png` y `.playwright-mcp/activate-account-390x844.png`. La revisión visual es manual, no una comparación píxel a píxel.
- A `390x844`, la cabecera del login mide menos de 120 px y el texto promocional está oculto. Ambas rutas carecen de desbordamiento horizontal y permiten recorrer los controles mediante teclado y desplazamiento vertical.
- `/`, `/kids` y `/kids/mateo-fernandez` responden correctamente. `git diff` confirma que no se modificaron el feed, las páginas de niños, el shell, el layout ni los estilos globales.
- `npm run lint` y `npm run build` completados correctamente. La consola revisada solo contiene mensajes informativos de desarrollo y HMR.

## Decisiones

- **Sí:** Demo sin backend, coherente con las pantallas existentes.
- **Sí:** URLs en inglés y textos visibles en español, siguiendo la convención de SPEC 02.
- **Sí:** Ambos formularios llevan al feed existente, sin simular sesiones ni decidir destinos por rol.
- **Sí:** Validación mínima nativa, sin reglas adicionales de contraseña.
- **Sí:** Consentimiento opcional y desmarcado. No se registra porque no existe persistencia.
- **Sí:** HTML de referencia como fuente visual. No hay capturas específicas de estas pantallas en `references/screenshots/`.
- **Sí:** Cabecera coral compacta en móvil, sin el texto promocional del panel de escritorio.
- **Sí:** Mantener «¿Olvidaste tu contraseña?» únicamente como texto visual, sin un enlace falso ni un control operativo.
- **No:** Componentes genéricos, nuevas dependencias o cambios globales para dos páginas.
- **No:** Credenciales precargadas en el login ni contraseña de ejemplo en activación.
- **No:** Nuevos enlaces hacia el login desde el shell existente. Las rutas nuevas son accesibles directamente y se enlazan entre sí.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Confundir la demo con autenticación real | Aviso visible y ausencia explícita de sesiones. El feed sigue siendo público. |
| Interpretar la tarjeta de Mateo como invitación validada | Documentarla como contenido estático y no consultar códigos. |
| Enviar accidentalmente contraseñas mediante el formulario | Impedir el envío nativo y navegar sin incluir valores en la URL. No registrar ni persistir los campos. |
| Diferencias de disposición móvil no cubiertas por la maqueta | Validar la cabecera compacta y los formularios a `390x844` mediante Playwright. |

## Qué **no** está en esta spec

- Autenticación real, cuentas, sesiones ni protección del feed.
- Invitaciones verificadas o asociación real con un niño.
- Consentimiento registrado ni almacenamiento de contraseñas.
- Recuperación de contraseña y feed de familias.
- Base de datos, backend y persistencia.

Cada uno de esos, si llega, va en su propia spec.
