CREATE USER boilerplate;
ALTER USER boilerplate WITH SUPERUSER;
CREATE DATABASE boilerplate_testing;
CREATE DATABASE boilerplate_development;
GRANT ALL PRIVILEGES ON DATABASE boilerplate_testing TO boilerplate;
GRANT ALL PRIVILEGES ON DATABASE boilerplate_development TO boilerplate;
