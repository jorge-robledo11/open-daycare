<!-- BEGIN:nextjs-agent-rules -->

# Este NO es el Next.js que conoces

Esta versión incluye cambios incompatibles: las APIs, convenciones y estructura de archivos pueden diferir de los datos con los que fuiste entrenado. Lee la guía correspondiente en `node_modules/next/dist/docs/` (resuelta desde el directorio de este archivo; en monorepos el paquete `next` puede no ser visible desde la raíz del repositorio) antes de escribir cualquier código. Presta atención a los avisos de deprecación.

Este bloque es escrito y vuelto a añadir por `next dev`; puedes verificarlo en `node_modules/next/dist/server/lib/generate-agent-files.js`. Eliminarlo de un diff solo hará que el cambio no confirmado vuelva a generarse; confirmarlo junto con tu trabajo mantiene el árbol de trabajo limpio.

<!-- END:nextjs-agent-rules -->

# open-daycare

## Stack

- Next.js 16.3.3 (App Router) + React 19 + TypeScript strict + Tailwind v4.
- Tailwind v4 es CSS-first: la configuración está dentro de `app/globals.css` (`@import "tailwindcss"`), NO hay `tailwind.config.js`.
- Alias de rutas `@/*` → raíz del repositorio.
- Configuración flat de ESLint: `npm run lint` (core-web-vitals + typescript). No hay typecheck ni tests configurados.
- Servidor de desarrollo en `http://localhost:3000` (`npm run dev`).

## Fuentes de diseño

- `references/pantallas/*.dc.html` contiene los mockups de las pantallas a implementar. Antes de construir una UI, revisar el archivo `.dc.html` correspondiente (por ejemplo, `index.dc.html` para la página principal).
- `references/screenshots/*.png` contiene las capturas de referencia.

## Flujo de trabajo con specs

- Para funcionalidades grandes se usa un flujo spec-driven: las skills `/spec` y `/spec-impl` (ubicadas en `.agents/skills/`). Los specs viven en `specs/NN-slug.md`. El estado del spec lo define el usuario (`Draft` → `Approved`).
- Las respuestas y los specs se escriben en el mismo idioma del prompt (normalmente español).

## MCPs

- Playwright: los screenshots y cualquier cosa relacionada con Playwright deben estar en el directorio `.playwright-mcp`.
- Context7: usarlo para obtener la documentación actualizada del framework.

## Spec Driven Development

- `/spec` Usaremos esta habilidad para crear las especificaciones.
- `/spec-impl` Usaremos esta skill para hacer las implementaciones.