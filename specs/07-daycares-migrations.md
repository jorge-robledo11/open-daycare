# SPEC 07 — Crear daycares mediante migraciones

> **Estado:** Implementado
> **Depende de:** Ninguna
> **Fecha:** 2026-11-06
> **Objetivo:** Crear `public.daycares` mediante migraciones versionadas con lectura limitada a la propia guardería, un registro inicial y un flujo reproducible con la CLI.

## Alcance

**Incluye:**

- Configurar Supabase CLI como dependencia de desarrollo con versión exacta.
- Inicializar su configuración en el repositorio.
- Vincular el proyecto remoto `ngfqsfyhpjgezpbpguzs`.
- Recuperar las dos migraciones existentes conservando sus versiones y SQL originales.
- Crear y aplicar una nueva migración para `public.daycares`.
- Activar RLS con una política de lectura de la propia guardería para `authenticated`, basada en `app_metadata.daycare_id` del JWT.
- Mantener sin acceso a `anon` y sin permisos de escritura para clientes.
- Insertar una guardería inicial llamada «Guardería Sala Soles» mediante una migración de datos independiente.
- Documentar la convención SQL en esta spec y en `AGENTS.md`.
- Documentar el flujo y añadir una comprobación SQL transaccional.

**Fuera de alcance (para futuras specs):**

- Integración con Next.js, UI y cliente Supabase.
- Otras tablas, relaciones, enums y autenticación de la aplicación.
- Otras guarderías iniciales, `supabase/seed.sql` y datos persistentes de prueba adicionales.
- Crear usuarios reales, asignarles guarderías o modificar sus metadatos.
- Políticas de escritura, directorio público y tablas de pertenencias.
- Entorno Supabase local, Docker y CI/CD.
- Limpieza o reparación del historial remoto.

## Modelo de datos

Fuente: referencia `docs`, archivo `opendaycare-database-schema.md`, sección `daycares`. La referencia describe el esquema previsto, no uno ya implementado.

| Campo | Tipo | Restricciones |
| --- | --- | --- |
| `id` | `uuid` | Clave primaria, default `gen_random_uuid()` |
| `name` | `text` | Obligatorio; rechazar vacío o compuesto únicamente por espacios |
| `created_at` | `timestamptz` | Obligatorio, default `now()` |

- No añadir `updated_at` ni unicidad sobre `name`.
- La validación del nombre no implica recortar automáticamente lo almacenado.
- RLS activado con lectura limitada para `authenticated`, según el modelo de acceso siguiente.
- Después de verificar debe conservarse el registro inicial y cualquier dato previo ajeno a la prueba. Solo los datos temporales de verificación se revierten.

### Modelo de acceso

- Crear una política llamada `daycares_select_own` para `SELECT`, dirigida a `authenticated`.
- Conceder únicamente `SELECT` sobre `public.daycares` a `authenticated`; una política RLS por sí sola no restablece los privilegios revocados en la migración inicial.
- Permitir consultar una fila solo si su `id` coincide con el identificador confiable de `app_metadata.daycare_id` obtenido mediante `auth.jwt()`.
- Claims ausentes, nulos, malformados o sin coincidencia deben producir cero filas visibles, sin errores de conversión de UUID.
- No usar `user_metadata` para autorizar. Una clave `daycare_id` allí no debe conceder acceso.
- Mantener sin acceso a `anon` y bloqueadas las operaciones `INSERT`, `UPDATE` y `DELETE` de ambos roles de cliente.
- No añadir funciones `SECURITY DEFINER` ni políticas permisivas de acceso general.
- Administración asignará el claim por un mecanismo privilegiado fuera de esta implementación. Los cambios en metadatos requieren refrescar el JWT para surtir efecto.
- Probar los claims temporalmente en una sesión SQL privilegiada; no crear ni modificar cuentas reales.

### Registro inicial

- Insertar exactamente una fila nueva con `name = 'Guardería Sala Soles'` mediante una migración de datos.
- Omitir `id` y `created_at` en la inserción para utilizar los valores por defecto existentes.
- No imponer unicidad al nombre ni usar `ON CONFLICT (name)`, ya que no existe esa restricción.
- Evitar duplicar la carga mediante el historial de migraciones: un segundo despliegue sin pendientes no debe repetir la inserción.
- Documentar cómo consultar el UUID generado para una futura asignación administrativa del claim, sin realizarla en esta spec.

## Convención SQL

- Palabras clave y comandos en MAYÚSCULAS: `SELECT`, `FROM`, `WHERE`, `CREATE POLICY`, `FOR SELECT`, `TO`, `USING`, `GRANT`, `INSERT INTO`, `VALUES`, etc. Aplicar también a PL/pgSQL (`DO`, `DECLARE`, `BEGIN`, `END`, `ASSERT`, etc.).
- Identificadores en inglés y `snake_case`; tipos y funciones en minúsculas, como `uuid`, `text`, `timestamptz`, `auth.jwt()` y `now()`.
- Conservar el contenido de literales y claves JSON; la convención no cambia `app_metadata` ni `daycare_id`.
- Separar cláusulas principales en líneas y terminar cada sentencia con `;`.
- Aplicar a todas las migraciones, al archivo de pruebas actualizado y a los ejemplos SQL de documentación.
- Por petición explícita posterior, reformatear también las tres migraciones históricas. Cambiar únicamente capitalización de palabras clave, espacios y separadores vacíos redundantes, sin modificar la semántica, las versiones ni el SQL guardado en el historial remoto. No volver a ejecutarlas.

```sql
SELECT id, name, created_at
FROM public.daycares
WHERE name = 'Guardería Sala Soles';
```

## Plan de implementación

**Base implementada (pasos 1–6; no repetir ni alterar su lógica; formato histórico normalizado en el paso 11):**

1. Consultar las skills `supabase` y `supabase-postgres-best-practices`, la documentación actualizada y la ayuda de la CLI. Instalar una versión exacta compatible como dependencia de desarrollo.
2. Inicializar `supabase/`, configurar los archivos ignorados y documentar autenticación y vinculación al proyecto. No guardar credenciales.
3. Recuperar el SQL original de las migraciones remotas `20261106194113_create_test_table.sql` y `20261106194320_drop_test_table.sql`. Comparar los historiales local y remoto. Si no puede recuperarse el SQL original, detenerse sin fabricar archivos ni reparar el historial.
4. Generar la nueva migración con la CLI y definir `daycares`, sus restricciones y RLS.
5. Añadir la prueba SQL transaccional y la guía operativa.
6. Revisar el destino y la simulación de aplicación. Aplicar únicamente la migración pendiente mediante la CLI y ejecutar las verificaciones remotas.

**Ampliación implementada y verificada (pasos 7–11):**

7. Consultar la documentación actualizada, inspeccionar tabla, permisos, políticas e historial remoto y confirmar el estado previo. Generar mediante CLI una nueva migración `create_daycares_read_policy` con `GRANT SELECT` y la política `daycares_select_own`, sin editar la migración inicial ni conceder escritura.
8. Generar mediante CLI una segunda migración `seed_initial_daycare` e insertar «Guardería Sala Soles» con UUID y fecha por defecto.
9. Actualizar `supabase/tests/daycares.sql` para probar lectura propia, aislamiento entre guarderías, claims ausentes o inválidos, rechazo de autorización basada en `user_metadata` y bloqueo de escritura. Conservar las comprobaciones de estructura y validación y revertir únicamente los datos temporales. Actualizar `supabase/README.md` con la nueva política, el registro inicial y la consulta de su UUID. Aplicar el formato SQL acordado y registrarlo en `AGENTS.md`.
10. Simular la aplicación y comprobar que solo aparecen las dos migraciones nuevas, en orden. Aplicarlas por CLI al proyecto correcto sin seeds independientes, cambios en Vault ni reparaciones de historial. Ejecutar las pruebas, comparar los datos antes y después de probar y comprobar que los historiales coinciden y no quedan migraciones pendientes.
11. Normalizar el formato de las tres migraciones históricas por solicitud explícita del usuario. Comprobar equivalencia de sentencias, conservando identificadores y literales, y actualizar las referencias documentales a la excepción anterior. No desplegar ni modificar el historial remoto por un cambio de formato.

Los comandos concretos se comprobarán con `--help` para la versión instalada. No se asumirán flags de otras versiones. La ejecución habitual utilizará `npx supabase` para resolver la dependencia del proyecto.

Cada paso conserva la aplicación ejecutable. La ausencia de autenticación de la CLI es un bloqueo que debe resolverse antes de desplegar, no una razón para usar otro mecanismo sin autorización.

**Archivos previstos:**

- Modificar `package.json`, `package-lock.json` y `.gitignore`.
- Crear `supabase/config.toml`.
- Recuperar `supabase/migrations/20261106194113_create_test_table.sql`.
- Recuperar `supabase/migrations/20261106194320_drop_test_table.sql`.
- Crear `supabase/migrations/<version_generada>_create_daycares.sql`; la versión la genera la CLI, no se inventa durante la implementación.
- Crear `supabase/tests/daycares.sql`.
- Crear `supabase/README.md`.

**Archivos de la ampliación:**

- Crear `supabase/migrations/<version_generada>_create_daycares_read_policy.sql`.
- Crear `supabase/migrations/<version_generada>_seed_initial_daycare.sql`.
- Modificar `supabase/tests/daycares.sql` y `supabase/README.md`.
- Modificar `AGENTS.md` para registrar la convención SQL.
- Actualizar esta spec con alcance, criterios e historial de la ampliación.

La CLI genera ambas versiones nuevas; no se inventan nombres de archivo con timestamps. Los tres archivos históricos reciben únicamente el reformateo autorizado en el paso 11. Esta ampliación no requiere nuevas dependencias ni cambios en la configuración de servicios.

Conservar los archivos auxiliares de inicialización que requiera la CLI, sin incorporar credenciales ni estado temporal al repositorio.

## Criterios de aceptación

- [x] La CLI tiene una versión exacta registrada en `devDependencies` y el lockfile.
- [x] La guía permite autenticar la CLI y vincular el proyecto `ngfqsfyhpjgezpbpguzs` sin guardar secretos.
- [x] Las dos migraciones históricas recuperadas conservan sus versiones originales y sentencias semánticamente equivalentes; las diferencias locales se limitan al formato autorizado.
- [x] No se borran ni reparan entradas del historial remoto.
- [x] Las migraciones se generan mediante la CLI y quedan en `supabase/migrations/` para su versionado en Git.
- [x] La simulación de la ampliación identifica únicamente `create_daycares_read_policy` y `seed_initial_daycare`, en ese orden; no intenta volver a aplicar las tres migraciones históricas.
- [x] `public.daycares` contiene exactamente los tres campos y restricciones especificados.
- [x] Una inserción válida genera automáticamente UUID y fecha.
- [x] Se rechazan nombres nulos, vacíos y compuestos únicamente por espacios.
- [x] Se permiten guarderías con nombres repetidos.
- [x] RLS está activado y la política `daycares_select_own` permite exclusivamente lectura a `authenticated` con pertenencia coincidente en `app_metadata.daycare_id`.
- [x] `authenticated` tiene el privilegio `SELECT` necesario; `anon` no puede consultar filas.
- [x] Las pruebas con dos guarderías temporales comprueban que cada claim coincidente permite consultar solo la fila propia.
- [x] Claims ausentes, nulos, malformados o sin coincidencia devuelven cero filas sin errores de conversión de UUID.
- [x] Un `daycare_id` situado únicamente en `user_metadata` no permite consultar ninguna guardería.
- [x] `INSERT`, `UPDATE` y `DELETE` siguen bloqueados para `anon` y `authenticated`, incluso cuando el claim coincide; la prueba no exige un tipo concreto de error de permisos.
- [x] La prueba SQL revierte todos sus datos, incluidos los insertados antes de comprobar errores esperados.
- [x] La migración de datos inserta exactamente una fila nueva «Guardería Sala Soles», con UUID y fecha generados por sus defaults.
- [x] Después de probar permanecen el registro inicial y los datos previos ajenos a las pruebas, sin registros temporales residuales.
- [x] La guía incluye la consulta del UUID inicial y explica asignación administrativa y refresco del JWT, sin crear ni modificar usuarios reales.
- [x] Un segundo despliegue sin migraciones pendientes no duplica el registro inicial.
- [x] Los historiales local y remoto coinciden tras aplicar la migración.
- [x] Una segunda simulación no muestra migraciones pendientes.
- [x] No hay cambios de aplicación en tablas internas ni en archivos de la aplicación; se exceptúan únicamente los registros del historial de migraciones gestionados automáticamente por la CLI.
- [x] La guía documenta creación, revisión, aplicación y comprobación de futuras migraciones, sin resets remotos.
- [x] Las cinco migraciones, las pruebas actualizadas y los ejemplos SQL usan palabras clave en MAYÚSCULAS, identificadores en inglés y `snake_case`, tipos y funciones en minúsculas, cláusulas principales separadas y `;` final.
- [x] `AGENTS.md` documenta la convención SQL y exige autorización explícita para reformatear migraciones aplicadas sin cambios semánticos ni reaplicaciones.
- [x] El reformateo de las tres migraciones históricas conserva sentencias equivalentes, identificadores, literales y versiones, sin modificar ni volver a ejecutar el historial remoto.

### Dictamen de verificación — 2026-11-06

**Resultado: 28/28 criterios verificados. Estado actualizado a Implementado.**

Se leyó la spec completa en estado Aprobado y se revisaron migraciones, pruebas, configuración, dependencias, instrucciones y guía. Se realizaron nuevas comprobaciones remotas; las narraciones de implementación no se tomaron por sí solas como evidencia.

**Precisión del criterio 24:** conserva su posición y explicita la única excepción necesaria: los registros de historial que la CLI debe gestionar para aplicar migraciones. No se autorizan otros cambios en tablas internas.

| Criterio | Evidencia verificada |
| --- | --- |
| 1 | `package.json`, entrada raíz del lockfile, paquete resuelto y ejecución de `npx supabase --version`: todos fijan `3.0.0`. |
| 2 | Guía de autenticación y vinculación revisada; conexión real al proyecto correcto. `.temp/` y archivos de entorno ignorados; no hay credenciales incrustadas en los archivos de esta implementación. |
| 3 | Comparación nueva de tokens, literales y límites de sentencias entre los archivos locales recuperados y el SQL original del historial remoto: equivalentes. |
| 4 | Las cinco entradas conservan versiones, nombres y SQL almacenado; comparación exacta del historial antes y después de verificar. No se ejecutan reparaciones. |
| 5 | Salidas reales de `migration fetch` y `migration new` registradas en esta sesión, contrastadas con las cinco rutas locales y versiones remotas. |
| 6 | Evidencia histórica directa de herramientas en esta sesión: la simulación anterior al despliegue enumeró solo `20261106201511_create_daycares_read_policy.sql` y `20261106201514_seed_initial_daycare.sql`, en orden. No se altera el historial para reproducir una simulación ya aplicada. |
| 7 | Consulta nueva de columnas y defaults, revisión de restricciones de catálogo y prueba de clave primaria: exactamente `id`, `name` y `created_at`, con tipos, nulabilidad y defaults acordados. |
| 8 | Nueva ejecución transaccional: inserción omitiendo UUID y fecha, con aserciones de valores generados y timestamp de la transacción. |
| 9 | Rechazo comprobado de `NULL`, cadena vacía, espacios y tabulación/salto de línea. |
| 10 | Dos filas temporales con idéntico nombre se insertan correctamente; catálogo sin restricción de unicidad adicional sobre el nombre. |
| 11 | RLS activado, exactamente una política `SELECT` para `authenticated`, expresión basada solo en `app_metadata` y pruebas de aislamiento superadas. |
| 12 | Aserciones de privilegios y consultas reales bajo los roles de cliente: lectura autenticada autorizada y acceso anónimo denegado. |
| 13 | Dos UUID temporales distintos; para cada claim válido la consulta devuelve exactamente el UUID propio, excluyendo el otro y el registro inicial. |
| 14 | Trece variantes de claims no autorizados ejecutadas sin errores de conversión y con cero filas visibles. |
| 15 | Casos con `user_metadata` como única fuente y en conflicto con un claim no coincidente: cero filas. |
| 16 | Pruebas reales de `INSERT`, `UPDATE` y `DELETE` para ambos roles con pertenencia coincidente; privilegios de escritura ausentes y datos intactos. |
| 17 | Prueba con `ROLLBACK`, aserciones activadas y comparación exacta externa de filas antes y después, incluidos los casos de error esperado. |
| 18 | SQL de la migración de datos contiene una sola inserción del nombre y omite UUID/fecha. La tabla vacía antes del despliegue consta en la consulta real de esta sesión; el estado actual conserva exactamente el registro inicial generado. |
| 19 | Snapshots nuevos iguales antes y después de las pruebas: solo permanece «Guardería Sala Soles», con UUID y fecha originales. |
| 20 | Consulta del UUID, separación entre herramientas privilegiadas y clientes y advertencia de refresco del JWT documentadas; pruebas solo simulan claims transaccionales, sin escribir en `auth.users`. |
| 21 | Nuevo `db push --skip-vault --yes`, precedido por simulación vacía: no aplica migraciones y el snapshot posterior es idéntico. |
| 22 | `migration list` ejecutado de nuevo: cinco versiones coincidentes en local y remoto. |
| 23 | Simulación nueva: `upToDate: true`, `migrations: []`. |
| 24 | SQL limitado a la tabla, sus permisos/política y datos; pruebas transaccionales sin cambios de cuentas. Diff de archivos de aplicación y configuración Next.js vacío. |
| 25 | Guía revisada: generar con CLI, comparar historial, simular, confirmar destino, aplicar con `--skip-vault` y verificar; no requiere resets remotos. |
| 26 | Revisión de las cinco migraciones, pruebas y ejemplos; comprobación automatizada de palabras clave fuera de comentarios/literales y terminadores. Identificadores, funciones, tipos y separación de cláusulas revisados. |
| 27 | Regla comprobada en la sección «Convención SQL» de `AGENTS.md`, incluida la autorización explícita y la prohibición de cambios semánticos o reaplicaciones. |
| 28 | Comparación actual contra el SQL remoto original de las tres migraciones históricas: sentencias y literales equivalentes. El historial permanece exactamente igual tras validar; no se reaplican. |

**Comandos y artefactos nuevos:**

- `node .playwright-mcp/verify-spec-07.mjs`: pasa; comprueba catálogo, versiones, SQL remoto, permisos mediante pruebas, preservación de datos/historial e idempotencia.
- `.playwright-mcp/spec-07-verification.json`: resultados estructurados de la última ejecución, incluidos columnas, restricciones, política, historial, snapshot, advisors y plan de ejecución.
- `npm run lint`, `npm run build` y `git diff --check`: pasan.
- `git check-ignore`: confirma que el estado temporal de vinculación y los artefactos de verificación no se versionan.

Se consultó Context7 para contrastar el uso de `auth.jwt()`, `app_metadata` y las advertencias sobre claims editables y JWT desactualizados. No hay prácticas nuevas de Next.js ni cambios de UI que validar; Playwright, capturas y un entorno Supabase local no corresponden al alcance de esta spec.

**Avisos fuera del dictamen funcional:** Advisors mantiene dos avisos sobre la función existente `public.rls_auto_enable()` y uno `auth_rls_initplan` sobre la política. Se repitió `EXPLAIN` bajo `authenticated`: usa `daycares_pkey` e `InitPlan 1`, por lo que el aviso de evaluación por fila no coincide con el plan observado. No se modificó esa función ajena al alcance ni se ocultaron avisos. Las vulnerabilidades npm comunicadas durante la implementación no se corrigen en esta spec.

No fue necesario corregir código de la aplicación ni SQL de implementación. Se añadió el verificador reproducible; su primera versión CommonJS provocó errores de lint en el propio artefacto y se convirtió a ESM antes de repetir con éxito lint y verificaciones. No se hicieron commits.

### Evidencia de implementación — 2026-11-06

Evidencia histórica de la implementación base en la rama `spec-07-daycares-migrations`, sin commits automáticos. No acredita la ampliación de políticas y datos iniciales descrita después. El recuento cero y el bloqueo total de lectura de esta sección corresponden al alcance original, sustituido por los criterios actuales. Se conserva el estado Aprobado y los checks pendientes para la validación independiente.

- CLI `3.0.0` instalada con versión exacta en `package.json` y `package-lock.json`; `npx supabase --version` devuelve `3.0.0`.
- Proyecto `ngfqsfyhpjgezpbpguzs` vinculado mediante CLI. Los comandos remotos muestran como destino `open-daycare`, entorno `production`.
- Las dos migraciones históricas se recuperaron con `migration fetch`. Se conservaron los archivos emitidos por la CLI sin editar su SQL; el historial remoto mantiene las versiones originales.
- La CLI generó `supabase/migrations/20261106200450_create_daycares.sql`.
- La simulación previa mostró exclusivamente esa migración; se aplicó mediante `db push --remote=ngfqsfyhpjgezpbpguzs --skip-vault --yes`, sin seeds ni roles adicionales.
- `supabase/tests/daycares.sql` pasó en remoto. Comprueba estructura, clave primaria, UUID y fecha automáticos, conservación de espacios, rechazo de nombres inválidos, nombres repetidos y bloqueo de SELECT/INSERT/UPDATE/DELETE para `anon` y `authenticated`.
- Las aserciones se habilitan explícitamente con `plpgsql.check_asserts`. Los datos se revierten con `rollback`.
- Una consulta posterior devuelve `daycare_count: 0`.
- `migration list` muestra las tres versiones coincidentes en local y remoto; la segunda simulación devuelve `upToDate: true` y ninguna migración pendiente.
- `npm run lint`, `npm run build` y `git diff --check` pasan.
- Se utiliza el `.gitignore` generado dentro de `supabase/` para ignorar `.temp/` y `.branches/`; no fue necesario duplicar esas reglas en el `.gitignore` raíz. `git check-ignore` confirma que la vinculación temporal no se versiona.
- La guía operativa queda en `supabase/README.md`. No se modificaron archivos de la aplicación ni se ejecutaron resets, reparaciones de historial o despliegues de configuración.

**Límite conocido ajeno a esta implementación:** `npm audit` reporta 13 vulnerabilidades en el árbol de dependencias, incluida una crítica en Next.js. No se actualizaron dependencias fuera del alcance de esta spec. No se ejecutaron pruebas locales de Supabase ni comprobaciones visuales, conforme al alcance exclusivamente remoto y sin cambios de UI.

### Evidencia de implementación de la ampliación — 2026-11-06

Se completaron los pasos 7–10 en la misma rama, sin commits automáticos. El estado permanece Aprobado y los criterios siguen sin marcar para la validación independiente.

- Inspección previa por CLI: tres migraciones sincronizadas, tres columnas en `daycares`, RLS activado, sin políticas ni privilegios de cliente y tabla vacía.
- La CLI generó `20261106201511_create_daycares_read_policy.sql` y `20261106201514_seed_initial_daycare.sql`.
- La primera migración concede solo `SELECT` a `authenticated` y crea `daycares_select_own`. La expresión valida el formato del claim antes de convertirlo a UUID, sin usar `user_metadata` ni funciones `SECURITY DEFINER`.
- La segunda inserta únicamente el nombre «Guardería Sala Soles», utilizando los defaults de UUID y fecha.
- La simulación mostró exclusivamente esas dos migraciones, en orden. Se aplicaron mediante `db push --remote=ngfqsfyhpjgezpbpguzs --skip-vault --yes`, sin seeds independientes ni roles adicionales.
- Registro persistente generado: `ca18376e-cda8-46ba-9121-15baaee00e51`, «Guardería Sala Soles», `2026-11-06 20:16:58.697658+00`.
- `supabase/tests/daycares.sql` pasó: estructura, validación, defaults, nombres repetidos, política y privilegios, aislamiento de dos guarderías temporales y bloqueo de escritura de ambos roles con claim coincidente.
- Se probaron 13 variantes de claims no autorizados, incluyendo ausentes, nulos, malformados, UUID sin coincidencia y `daycare_id` situado solo en `user_metadata` o en conflicto con `app_metadata`.
- Una autocomprobación con Node comparó exactamente las filas antes y después de las pruebas: sin cambios persistentes. También ejecutó una segunda simulación y un segundo despliegue real sin pendientes y volvió a comparar las filas: sin duplicados ni cambios en el registro inicial.
- `migration list` muestra cinco versiones coincidentes en local y remoto. La segunda simulación y el segundo despliegue devuelven `upToDate: true` y ninguna migración pendiente.
- En la verificación original de los pasos 7–10, las sumas SHA-256 de las tres migraciones históricas coincidían antes y después. El paso 11 posterior cambia su formato local por petición explícita; aquella comparación de bytes no acredita el estado posterior al reformateo.
- Se actualizaron pruebas y ejemplos con palabras clave SQL y PL/pgSQL en MAYÚSCULAS. La convención general ya está documentada en `AGENTS.md`.
- `npm run lint`, `npm run build` y `git diff --check` pasan. No se crearon cuentas, asignaron claims reales ni modificaron archivos de la aplicación.

**Avisos de advisors:** Hay dos avisos sobre ejecución de la función existente `public.rls_auto_enable()` como `SECURITY DEFINER` por clientes; no fue creada ni modificada aquí y su revisión queda fuera de alcance. También se reportó `auth_rls_initplan` sobre la política nueva: se contrastó con `EXPLAIN (FORMAT JSON)` bajo `authenticated`, que muestra `Index Scan` sobre `daycares_pkey`, condición `id = (InitPlan 1).col1` y un subplan `InitPlan 1`. No se observó evaluación del claim por fila en ese plan. Los avisos y su interpretación se documentan también en `supabase/README.md`.

## Decisiones

- **Sí:** Migraciones imperativas SQL y CLI como mecanismo de despliegue.
- **Sí:** CLI como dependencia de desarrollo con versión exacta para reproducir el flujo desde el repositorio.
- **Sí:** Conservar el historial de las pruebas anteriores para mantener trazabilidad.
- **Sí:** Verificación exclusivamente remota, según lo acordado.
- **Sí:** Lectura de la propia guardería mediante un claim confiable en `app_metadata`, sin crear por ahora una tabla de pertenencias.
- **Sí:** Un registro inicial mediante migración de datos independiente para que se despliegue con el mismo historial versionado.
- **Sí:** Convención SQL explícita en esta spec y en `AGENTS.md`, incluyendo el reformateo histórico autorizado posteriormente sin cambios semánticos ni reaplicaciones.
- **Sí:** Prueba SQL transaccional sin datos residuales.
- **No:** Aplicar DDL por MCP en esta feature. El MCP puede usarse para inspecciones y verificaciones.
- **No:** `supabase/seed.sql`, políticas de escritura o acceso general, integración frontend ni infraestructura local.
- **No:** Crear cuentas o asignar claims reales en esta implementación.

## Historial de cambios

### 2026-11-06 — Políticas de lectura, registro inicial y formato SQL

- **Solicitud:** Ampliar la spec con políticas, datos iniciales y palabras clave SQL en MAYÚSCULAS.
- **Antes:** RLS sin políticas de acceso, sin registros iniciales y tabla vacía tras verificar.
- **Ahora:** Política de lectura de la propia guardería para `authenticated`, basada en `app_metadata.daycare_id`, y un registro persistente «Guardería Sala Soles».
- **Migraciones:** Añadir dos archivos nuevos, uno de permisos y política y otro de datos. Inicialmente se conservaron las tres migraciones aplicadas sin editar; el ajuste posterior autoriza únicamente su normalización de formato local.
- **Pruebas:** Adaptar aislamiento por claim, acceso anónimo, escritura y preservación del registro inicial. Usar claims temporales sin modificar usuarios reales.
- **Formato:** Palabras clave SQL y PL/pgSQL en MAYÚSCULAS; identificadores, tipos y funciones según las reglas acordadas. Documentar también en `AGENTS.md`.
- **Estado:** Ampliación implementada en los pasos 7–10; la evidencia se registra en su sección correspondiente. No se marcan criterios ni se cambia automáticamente el estado Aprobado antes de la validación independiente.

### 2026-11-06 — Normalizar también las migraciones históricas

- **Solicitud:** Aplicar la nueva convención a las queries antiguas, retirando la excepción de formato previamente acordada.
- **Cambios:** Palabras clave en MAYÚSCULAS en las tres migraciones históricas, separación de sentencias y cláusulas principales, y eliminación de puntos y coma vacíos redundantes en los archivos recuperados.
- **Límite:** No cambiar identificadores, literales, semántica, versiones ni historial remoto; no volver a ejecutar las migraciones.
- **Documentación:** Actualizar esta spec, `AGENTS.md` y `supabase/README.md` para reflejar la autorización específica sin permitir cambios lógicos en migraciones aplicadas.

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| Aplicar cambios al proyecto equivocado | Comprobar referencia y destino antes del despliegue. |
| Divergencia del historial | Recuperar los archivos originales antes de crear la nueva migración. |
| CLI sin autenticación | Completar su autenticación por separado; OAuth del MCP no basta. |
| Fallo de una prueba remota | Usar transacciones y detenerse sin resets ni reparaciones automáticas. |
| Diferencias entre versiones de CLI | Fijar versión y verificar comandos con su ayuda instalada. |
| JWT con pertenencia desactualizada | Documentar que los cambios administrativos requieren refrescar el token. |
| Confundir app_metadata con user_metadata | Autorizar solo con app_metadata y probar que user_metadata no concede acceso. |
| RLS sin privilegio de lectura | Incluir GRANT SELECT a authenticated y probar la lectura real con el rol de cliente. |
| Duplicar el registro inicial o eliminarlo al probar | Insertarlo una vez mediante el historial de migraciones y comparar datos antes y después de las pruebas transaccionales. |

## Qué **no** está en esta spec

- Interfaz e integración de la aplicación.
- Otras tablas, políticas de escritura y administración de cuentas reales.
- Guarderías iniciales adicionales, seeds independientes y pruebas locales.
- Limpieza del historial remoto.

Cada uno de esos, si llega, va en su propia spec.
