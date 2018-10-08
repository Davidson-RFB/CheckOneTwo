CREATE TABLE markers (
  id UUID PRIMARY KEY,
  submitted_by text NOT NULL,
  site_id UUID REFERENCES sites (id) ON UPDATE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
