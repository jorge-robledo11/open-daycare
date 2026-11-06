GRANT SELECT ON TABLE public.daycares TO authenticated;

CREATE POLICY daycares_select_own
ON public.daycares
FOR SELECT
TO authenticated
USING (
  id = (
    SELECT CASE
      -- Validate the claim before casting so malformed values deny access without errors.
      WHEN (auth.jwt() -> 'app_metadata' ->> 'daycare_id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
        THEN (auth.jwt() -> 'app_metadata' ->> 'daycare_id')::uuid
      ELSE NULL
    END
  )
);
