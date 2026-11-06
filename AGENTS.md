<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

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
- Supabase: MCP remoto configurado globalmente en `~/.config/opencode/opencode.json`, asociado al proyecto `ngfqsfyhpjgezpbpguzs`. Usa OAuth; gestionar la conexión y el inicio de sesión desde `/mcps` en OpenCode. No guardar tokens ni secretos en el repositorio.

## Supabase y skills

- `supabase` (`.agents/skills/supabase/SKILL.md`): cargarla para cualquier tarea relacionada con Supabase (Database, Auth, Storage, Realtime, Edge Functions, CLI o MCP). Consultar la documentación actualizada antes de implementar.
- `supabase-postgres-best-practices` (`.agents/skills/supabase-postgres-best-practices/SKILL.md`): cargarla antes de crear o modificar esquemas, SQL, migraciones, índices, funciones o políticas RLS, y al diagnosticar problemas de rendimiento o acceso a datos.
- Antes de modificar el esquema, inspeccionar las tablas existentes. Preferir desarrollo y pruebas locales; las operaciones del MCP afectan al proyecto remoto.
- Habilitar RLS en las tablas de esquemas expuestos y definir políticas según el modelo de acceso. Nunca exponer claves secretas o `service_role` al cliente.
- Al depurar, revisar logs y avisos de seguridad y rendimiento antes de cambiar código o datos. Verificar los cambios con pruebas o consultas apropiadas.

## Spec Driven Development

- `/spec` Usaremos esta habilidad para crear las especificaciones.
- `/spec-impl` Usaremos esta skill para hacer las implementaciones.
- `/spec-verifier` (`.opencode/agents/spec-verifier.md`) es el subagente que verifica los criterios de aceptación de una spec aprobada. Se invoca con `@spec-verifier verifica specs/NN-slug.md`. Revisa y corrige criterios ambiguos, valida las prácticas de Next.js con Context7, usa Playwright para las comprobaciones visuales (capturas en `.playwright-mcp/`), corrige el código mínimo si un criterio falla, marca los checks solo con evidencia y cambia el estado a `Implementado` cuando todos pasan. Usa el modelo con visión `opencode-go/deepseek-v4-flash-vision-exp` para comparar capturas.

## Reglas de código

- Usar clean code: nombres, variables, funciones, etc. en inglés
