-- Connect to the database (assumes 'webapp' matches POSTGRES_DB in docker-compose)
\c webapp

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create Admin Role (Group Role)
CREATE ROLE admin
  NOLOGIN       -- Group role, not a login user
  INHERIT       -- Members inherit privileges
  CREATEDB      -- Can create databases
  CREATEROLE    -- Can manage roles
  NOSUPERUSER   -- Not a superuser
  NOREPLICATION
  NOBYPASSRLS;

-- 2. Revoke Public Privileges
REVOKE ALL ON DATABASE webapp FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- 3. Create Application Roles
CREATE ROLE developer
  NOLOGIN
  INHERIT
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  NOBYPASSRLS;

CREATE ROLE api
  NOLOGIN
  INHERIT
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  NOBYPASSRLS;

CREATE ROLE read_only
  NOLOGIN
  INHERIT
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  NOBYPASSRLS;

CREATE ROLE backup
  NOLOGIN
  INHERIT
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  NOBYPASSRLS;

CREATE ROLE auditor
  NOLOGIN
  INHERIT
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  NOBYPASSRLS;

-- Grant database-level privileges
GRANT CREATE ON DATABASE webapp TO admin, developer;
GRANT CONNECT, TEMPORARY ON DATABASE webapp TO admin, developer, api, read_only, backup, auditor;

-- 4. Create Default Login Users and Associate with Roles
CREATE ROLE app_admin LOGIN PASSWORD 'admin_pa55w0rd';
GRANT admin TO app_admin;

CREATE ROLE app_developer LOGIN PASSWORD 'developer_pa55w0rd';
GRANT developer TO app_developer;

CREATE ROLE app_api LOGIN PASSWORD 'api_pa55w0rd';
GRANT api TO app_api;

CREATE ROLE app_readonly LOGIN PASSWORD 'readonly_pa55w0rd';
GRANT read_only TO app_readonly;

CREATE ROLE app_backup LOGIN PASSWORD 'backup_pa55w0rd';
GRANT backup TO app_backup;

CREATE ROLE app_auditor LOGIN PASSWORD 'auditor_pa55w0rd';
GRANT auditor TO app_auditor;

-- 6. Event Trigger for Dynamic Schema Privileges
CREATE OR REPLACE FUNCTION apply_default_schema_privileges()
RETURNS event_trigger AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN
    SELECT * FROM pg_event_trigger_ddl_commands()
    WHERE command_tag = 'CREATE SCHEMA'
  LOOP
    -- Grant schema ownership and basic privileges
    EXECUTE format('ALTER SCHEMA %I OWNER TO admin', obj.object_identity);
    EXECUTE format('GRANT CREATE ON SCHEMA %I TO developer', obj.object_identity);
    EXECUTE format('GRANT USAGE ON SCHEMA %I TO developer, api, read_only, backup, auditor', obj.object_identity);

    -- Grant default privileges for tables
    EXECUTE format('ALTER DEFAULT PRIVILEGES FOR USER app_admin IN SCHEMA %I GRANT SELECT ON TABLES TO read_only, backup, auditor', obj.object_identity);
    EXECUTE format('ALTER DEFAULT PRIVILEGES FOR USER app_admin IN SCHEMA %I GRANT INSERT, SELECT, UPDATE, DELETE ON TABLES TO api, developer', obj.object_identity);

    EXECUTE format('ALTER DEFAULT PRIVILEGES FOR USER app_developer IN SCHEMA %I GRANT SELECT ON TABLES TO read_only, backup, auditor', obj.object_identity);
    EXECUTE format('ALTER DEFAULT PRIVILEGES FOR USER app_developer IN SCHEMA %I GRANT INSERT, SELECT, UPDATE, DELETE ON TABLES TO api, developer, admin', obj.object_identity);

    -- Grant default privileges for sequences
    EXECUTE format('ALTER DEFAULT PRIVILEGES FOR USER app_admin IN SCHEMA %I GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO api, developer', obj.object_identity);
    EXECUTE format('ALTER DEFAULT PRIVILEGES FOR USER app_developer IN SCHEMA %I GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO api, developer, admin', obj.object_identity);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE EVENT TRIGGER auto_schema_privs
ON ddl_command_end
WHEN TAG IN ('CREATE SCHEMA')
EXECUTE PROCEDURE apply_default_schema_privileges();

-- 7. Secure the Postgres Superuser this will only show the password once in the logs.
\pset format unaligned
\pset tuples_only on

DO $$
DECLARE
  new_password TEXT;
BEGIN
  new_password := encode(gen_random_bytes(12), 'base64');
  new_password := substring(new_password FROM 1 FOR 16);
  EXECUTE format('ALTER ROLE postgres WITH PASSWORD %L', new_password);
  RAISE NOTICE 'Generated password for postgres: %', new_password;
END;
$$;

-- Reset psql output (optional)
\pset tuples_only off
\pset format aligned