CREATE TABLE things (
  id UUID PRIMARY KEY,
  quantity integer,
  description text,
  name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
