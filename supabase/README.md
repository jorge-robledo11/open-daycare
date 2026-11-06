# Supabase y migraciones

Proyecto remoto: `ngfqsfyhpjgezpbpguzs` (`open-daycare`). Todos los comandos se ejecutan desde la raíz del repositorio.

## Preparación

La CLI está fijada a `3.0.0` en las dependencias de desarrollo:

```sh
npm ci
npx supabase --version
```

La sesión OAuth del MCP no autentica la CLI. Preferir un personal access token limitado al proyecto y con los permisos necesarios mediante `SUPABASE_ACCESS_TOKEN` en el entorno. No pegar tokens en chats, pasarlos en argumentos de comandos ni guardarlos en el repositorio.

Como alternativa interactiva, desde una terminal propia:

```sh
npx supabase login
```

El flujo interactivo puede crear un token con acceso amplio a la cuenta, no limitado al proyecto. Si la CLI solicita credenciales adicionales, proporcionarlas de forma privada.

Vincular el checkout:

```sh
npx supabase link ngfqsfyhpjgezpbpguzs
```

La vinculación se guarda bajo `supabase/.temp/`, ignorado por `supabase/.gitignore`. `project_id` en `config.toml` es un identificador local, no el destino remoto. La configuración inicializada no se despliega: no ejecutar `config push` para aplicar migraciones.

La CLI v3 apunta al entorno local por defecto. Seleccionar explícitamente `--remote=ngfqsfyhpjgezpbpguzs` y comprobar siempre la línea `Target:`. No se requiere Docker para este flujo remoto. Consultar `--help` si se cambia de versión.

## Historial existente

Se recuperaron mediante `migration fetch` las versiones originales de la prueba inicial:

- `20261106194113_create_test_table.sql`.
- `20261106194320_drop_test_table.sql`.

La base de `daycares` ya se creó con `20261106200450_create_daycares.sql`. Por petición explícita, los tres archivos anteriores se normalizaron a la convención SQL actual, sin cambiar su semántica ni sus versiones. No se volvieron a ejecutar ni se modificó el SQL guardado en el historial remoto. La ampliación añade dos nuevas migraciones:

- `20261106201511_create_daycares_read_policy.sql`: privilegio `SELECT` y política `daycares_select_own` para `authenticated`.
- `20261106201514_seed_initial_daycare.sql`: inserción de «Guardería Sala Soles» con UUID y fecha por defecto.

Se conservan como historial, sin volver a aplicarlas al proyecto que ya las tiene registradas. No cambiar la lógica de migraciones aplicadas, inventar archivos ausentes ni usar `migration repair` para ocultar divergencias. Los cambios futuros de estructura, permisos o datos requieren nuevas migraciones.

En un checkout nuevo, obtener estos archivos desde Git. Solo para recuperar un historial remoto que aún no existe localmente:

```sh
npx supabase migration fetch --remote=ngfqsfyhpjgezpbpguzs
```

Este comando escribe archivos locales; no usarlo para sobrescribir trabajo pendiente. Si no puede recuperarse el SQL original, detenerse.

## Crear y aplicar una migración

1. Comprobar que el historial coincide antes de crear otro archivo:

   ```sh
   npx supabase migration list --remote=ngfqsfyhpjgezpbpguzs
   ```

2. Generar el archivo y escribir el SQL en la ruta que devuelve la CLI:

   ```sh
   npx supabase migration new nombre_descriptivo
   ```

3. Revisar el SQL y simular el despliegue:

   ```sh
   npx supabase db push --remote=ngfqsfyhpjgezpbpguzs --skip-vault --dry-run
   ```

   Continuar solo si la lista contiene exclusivamente las migraciones esperadas. Para la ampliación de la SPEC 07 deben aparecer únicamente `20261106201511_create_daycares_read_policy.sql` y `20261106201514_seed_initial_daycare.sql`, en ese orden. Después de aplicarlas, la lista debe quedar vacía.

4. Aplicar después de revisar el destino y confirmar el prompt:

   ```sh
   npx supabase db push --remote=ngfqsfyhpjgezpbpguzs --skip-vault
   ```

   `--skip-vault` evita cambios en Vault. No añadir `--include-seed`, `--include-roles` ni `--include-all`. Para ejecución no interactiva autorizada, añadir `--yes` tras revisar la simulación.

5. Comparar nuevamente el historial y comprobar que no quedan migraciones pendientes:

   ```sh
   npx supabase migration list --remote=ngfqsfyhpjgezpbpguzs
   npx supabase db push --remote=ngfqsfyhpjgezpbpguzs --skip-vault --dry-run
   ```

Versionar juntos el SQL y los archivos de configuración y dependencias necesarios. Este flujo no ejecuta resets remotos, repara historial ni despliega configuración de servicios.

## Verificar daycares

La tabla tiene `id uuid` autogenerado, `name text` obligatorio y no blanco, y `created_at timestamptz` con default `now()`. No recorta nombres ni exige nombres únicos.

RLS está activado. La política `daycares_select_own` permite a `authenticated` consultar únicamente la fila cuyo UUID coincide con `app_metadata.daycare_id` de su JWT. Se concede solo `SELECT`; `INSERT`, `UPDATE` y `DELETE` siguen bloqueados. `anon` no tiene acceso.

La política valida el formato del claim antes de convertirlo a UUID. Un valor ausente, nulo, malformado o sin coincidencia no permite ver filas. `user_metadata` nunca autoriza acceso porque el usuario puede editarlo. Se compara sobre el UUID original de la tabla para conservar la posibilidad de usar el índice de la clave primaria.

El acceso privilegiado de administración no equivale al acceso de clientes. Para habilitar lectura a una cuenta en el futuro, administración deberá asignar `app_metadata.daycare_id` mediante una operación privilegiada, conservando sus demás metadatos. El usuario debe refrescar su JWT para recibir el cambio; modificar metadatos no revoca inmediatamente tokens emitidos. Esta implementación no crea usuarios ni modifica cuentas reales, y no requiere funciones `SECURITY DEFINER`.

Ejecutar la comprobación con un rol privilegiado, confirmando el prompt:

```sh
npx supabase db query --remote=ngfqsfyhpjgezpbpguzs --file supabase/tests/daycares.sql
```

En ejecución no interactiva autorizada se puede añadir `--yes`. El archivo comprueba columnas, clave primaria, defaults, validación, nombres repetidos, RLS, lectura de la guardería propia y aislamiento entre dos guarderías temporales. También verifica claims inválidos, rechazo de `user_metadata`, bloqueo anónimo y ausencia de escritura incluso con pertenencia coincidente.

Los claims se simulan mediante configuración transaccional de una sesión SQL privilegiada, sin emitir JWT reales ni modificar `auth.users`. Las aserciones están habilitadas explícitamente; los fallos se propagan como errores. Los datos temporales y los claims se revierten con `ROLLBACK`. No requiere pgTAP ni crea funciones persistentes. El registro inicial y los demás datos previos deben permanecer intactos: comparar las filas antes y después de ejecutar la prueba.

Confirmar el recuento tras ejecutar la prueba:

```sh
npx supabase db query --remote=ngfqsfyhpjgezpbpguzs --read-only 'SELECT count(*)
FROM public.daycares;'
```

En esta entrega, sobre la tabla previamente vacía, debe devolver uno: «Guardería Sala Soles». No borrar registros ajenos para obtener ese recuento. Si falla alguna comprobación, detenerse y revisar la causa sin resets remotos ni reparaciones automáticas.

## Consultar el registro inicial

Desde una sesión privilegiada, ejecutar:

```sql
SELECT id, name, created_at
FROM public.daycares
WHERE name = 'Guardería Sala Soles';
```

El UUID obtenido es el valor que administración podrá asignar en el futuro a `app_metadata.daycare_id`. La migración de datos se ejecuta una sola vez mediante el historial; no se usa `ON CONFLICT (name)` porque el nombre no es único. Un segundo `db push` sin pendientes no vuelve a insertar el registro.

## Convención SQL

Palabras clave SQL y PL/pgSQL en MAYÚSCULAS, identificadores en inglés y `snake_case`, tipos y funciones en minúsculas. Separar cláusulas principales en líneas y terminar sentencias con `;`. No cambiar literales ni claves JSON. Aplicar a todas las migraciones, pruebas y ejemplos. El reformateo histórico autorizado afecta solo a los archivos locales; no habilita cambios semánticos ni reaplicaciones. La regla general está en `AGENTS.md`.

## Avisos detectados durante la verificación

`db advisors` reporta `auth_rls_initplan` sobre la expresión con `SELECT CASE`. Se comprobó con `EXPLAIN (FORMAT JSON)` bajo el rol `authenticated`: el plan utiliza `daycares_pkey` y calcula el claim mediante `InitPlan 1`, no por cada fila. El aviso no coincide con el plan observado; no se modifica una migración aplicada para silenciarlo.

También hay dos avisos de ejecución de la función existente `public.rls_auto_enable()` como `SECURITY DEFINER` por `anon` y `authenticated`. Esta implementación no creó ni modificó esa función. Su revisión queda pendiente fuera del alcance de la SPEC 07; no se debe considerar que el proyecto completo está libre de avisos de seguridad.
