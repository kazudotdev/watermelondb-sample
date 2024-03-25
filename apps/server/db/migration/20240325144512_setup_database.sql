-- migrate:up
CREATE USER appuser;
CREATE SCHEMA app;
GRANT USAGE ON SCHEMA app TO appuser;
GRANT SELECT ON ALL TABLES IN SCHEMA public to appuser;

-- migrate:down
REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM appuser;
REVOKE USAGE ON SCHEMA app FROM appuser;
DROP SCHEMA app;
DROP USER appuser;

