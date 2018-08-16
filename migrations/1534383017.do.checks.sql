CREATE TABLE checks (
  id UUID PRIMARY KEY,
  site_id UUID REFERENCES sites (id) ON UPDATE CASCADE,
  items jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
