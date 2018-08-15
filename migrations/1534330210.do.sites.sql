CREATE TABLE sites (
  id UUID PRIMARY KEY,
  group_id UUID REFERENCES groups (id) ON UPDATE CASCADE,
  name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
