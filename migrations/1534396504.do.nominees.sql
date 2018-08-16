CREATE TABLE nominees (
  id UUID PRIMARY KEY,
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
