CREATE TABLE public.daycares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CONSTRAINT daycares_name_not_blank CHECK (name ~ '[^[:space:]]'),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.daycares ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.daycares
FROM anon, authenticated;
