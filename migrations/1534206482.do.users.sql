CREATE TABLE users (
  id UUID PRIMARY KEY,
  name text,
  email text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
