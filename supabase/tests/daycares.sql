-- Run as a privileged database role; all test rows and simulated claims are rolled back.
BEGIN;
SET LOCAL plpgsql.check_asserts = ON;

DO $$
DECLARE
  daycare public.daycares%ROWTYPE;
  daycare_ids uuid[];
  own_id uuid;
  invalid_name text;
  client_role text;
  claims jsonb;
  visible_ids uuid[];
  affected_rows bigint;
  expected_records jsonb;
BEGIN
  ASSERT (
    SELECT count(*) = 3
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'daycares'
  ), 'Expected exactly three columns';
  ASSERT (
    SELECT count(*) = 3
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'daycares'
      AND is_nullable = 'NO'
      AND (
        (column_name = 'id' AND data_type = 'uuid')
        OR (column_name = 'name' AND data_type = 'text')
        OR (column_name = 'created_at' AND data_type = 'timestamp with time zone')
      )
  ), 'Unexpected column types or nullability';
  ASSERT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.daycares'::regclass AND contype = 'p'
      AND conkey = ARRAY[(
        SELECT attnum
        FROM pg_attribute
        WHERE attrelid = 'public.daycares'::regclass AND attname = 'id'
      )]
  ), 'Expected id primary key';
  ASSERT (
    SELECT relrowsecurity
    FROM pg_class
    WHERE oid = 'public.daycares'::regclass
  ), 'RLS must be enabled';
  ASSERT (
    SELECT count(*) = 1
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'daycares'
  ), 'Expected exactly one policy';
  ASSERT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'daycares'
      AND policyname = 'daycares_select_own' AND cmd = 'SELECT'
      AND roles = ARRAY['authenticated']::name[]
  ), 'Expected authenticated SELECT policy';
  ASSERT has_table_privilege('authenticated', 'public.daycares', 'SELECT'), 'SELECT grant missing';
  ASSERT NOT has_table_privilege('anon', 'public.daycares', 'SELECT'), 'anon must not hold SELECT';
  ASSERT EXISTS (
    SELECT 1
    FROM public.daycares
    WHERE name = 'Guardería Sala Soles'
  ), 'Initial daycare missing';

  INSERT INTO public.daycares (name)
  VALUES ('  Spec 07 ' || gen_random_uuid()::text || '  ')
  RETURNING * INTO daycare;
  ASSERT daycare.id IS NOT NULL, 'UUID default failed';
  ASSERT daycare.created_at = CURRENT_TIMESTAMP, 'Timestamp default failed';
  ASSERT left(daycare.name, 2) = '  ' AND right(daycare.name, 2) = '  ', 'Name must not be automatically trimmed';
  daycare_ids := ARRAY[daycare.id];

  INSERT INTO public.daycares (name)
  VALUES (daycare.name)
  RETURNING id INTO own_id;
  daycare_ids := array_append(daycare_ids, own_id);
  ASSERT (
    SELECT count(*) = 2
    FROM public.daycares
    WHERE name = daycare.name
  ), 'Duplicate names must be allowed';

  BEGIN
    INSERT INTO public.daycares (id, name)
    VALUES (daycare.id, 'Duplicate id');
    RAISE EXCEPTION 'Duplicate primary key accepted';
  EXCEPTION WHEN unique_violation THEN
    NULL;
  END;

  FOREACH invalid_name IN ARRAY ARRAY[NULL::text, '', '   ', E'\t\n'] LOOP
    BEGIN
      INSERT INTO public.daycares (name)
      VALUES (invalid_name);
      RAISE EXCEPTION 'Invalid name accepted';
    EXCEPTION WHEN not_null_violation OR check_violation THEN
      NULL;
    END;
  END LOOP;

  SELECT jsonb_agg(to_jsonb(d) ORDER BY id)
  INTO expected_records
  FROM public.daycares AS d;

  FOREACH own_id IN ARRAY daycare_ids LOOP
    -- Simulate claims only in this privileged SQL session, never in auth.users.
    PERFORM set_config('request.jwt.claims', jsonb_build_object(
      'role', 'authenticated',
      'app_metadata', jsonb_build_object('daycare_id', own_id),
      'user_metadata', jsonb_build_object('daycare_id', gen_random_uuid())
    )::text, TRUE);
    SET LOCAL ROLE authenticated;

    SELECT array_agg(id)
    INTO visible_ids
    FROM public.daycares;
    ASSERT visible_ids = ARRAY[own_id], 'Client must read exactly its own daycare';

    RESET ROLE;

    FOREACH client_role IN ARRAY ARRAY['anon', 'authenticated'] LOOP
      EXECUTE format('SET LOCAL ROLE %I', client_role);
      ASSERT NOT has_table_privilege(CURRENT_USER, 'public.daycares', 'INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER'),
        'Client holds non-read privileges';

      IF client_role = 'anon' THEN
        BEGIN
          SELECT count(*) INTO affected_rows
          FROM public.daycares;
          ASSERT affected_rows = 0, 'anon can read rows';
        EXCEPTION WHEN insufficient_privilege THEN
          NULL;
        END;
      END IF;

      BEGIN
        INSERT INTO public.daycares (name)
        VALUES ('Unauthorized daycare');
        RAISE EXCEPTION 'Client can insert rows';
      EXCEPTION WHEN insufficient_privilege THEN
        NULL;
      END;

      BEGIN
        UPDATE public.daycares
        SET name = 'Unauthorized update'
        WHERE id = own_id;
        GET DIAGNOSTICS affected_rows = ROW_COUNT;
        ASSERT affected_rows = 0, 'Client can update rows';
      EXCEPTION WHEN insufficient_privilege THEN
        NULL;
      END;

      BEGIN
        DELETE FROM public.daycares
        WHERE id = own_id;
        GET DIAGNOSTICS affected_rows = ROW_COUNT;
        ASSERT affected_rows = 0, 'Client can delete rows';
      EXCEPTION WHEN insufficient_privilege THEN
        NULL;
      END;

      RESET ROLE;
    END LOOP;
  END LOOP;

  FOREACH claims IN ARRAY ARRAY[
    '{}'::jsonb,
    '{"app_metadata": null}'::jsonb,
    '{"app_metadata": {}}'::jsonb,
    '{"app_metadata": {"daycare_id": null}}'::jsonb,
    '{"app_metadata": {"daycare_id": ""}}'::jsonb,
    '{"app_metadata": {"daycare_id": "not-a-uuid"}}'::jsonb,
    '{"app_metadata": {"daycare_id": 123}}'::jsonb,
    '{"app_metadata": {"daycare_id": true}}'::jsonb,
    '{"app_metadata": {"daycare_id": {}}}'::jsonb,
    jsonb_build_object('app_metadata', jsonb_build_object('daycare_id', jsonb_build_array(daycare.id))),
    jsonb_build_object('app_metadata', jsonb_build_object('daycare_id', gen_random_uuid())),
    jsonb_build_object('user_metadata', jsonb_build_object('daycare_id', daycare.id)),
    jsonb_build_object(
      'app_metadata', jsonb_build_object('daycare_id', gen_random_uuid()),
      'user_metadata', jsonb_build_object('daycare_id', daycare.id)
    )
  ] LOOP
    PERFORM set_config('request.jwt.claims', claims::text, TRUE);
    SET LOCAL ROLE authenticated;

    SELECT count(*) INTO affected_rows
    FROM public.daycares;
    ASSERT affected_rows = 0, 'Missing, invalid or untrusted claim exposed rows';

    RESET ROLE;
  END LOOP;

  ASSERT (
    SELECT jsonb_agg(to_jsonb(d) ORDER BY id) = expected_records
    FROM public.daycares AS d
  ), 'Denied writes changed existing data';
END;
$$;

ROLLBACK;

SELECT 'daycares checks passed; test rows and claims rolled back' AS result;
