SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: app; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: groups; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid NOT NULL,
    name character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: todos; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.todos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    description text,
    owner_id uuid,
    group_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.users (
    id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users_groups; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.users_groups (
    user_id uuid NOT NULL,
    group_id uuid NOT NULL
);


--
-- Name: migrations_version; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations_version (
    version character varying(128) NOT NULL
);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (id);


--
-- Name: users_groups users_groups_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.users_groups
    ADD CONSTRAINT users_groups_pkey PRIMARY KEY (user_id, group_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: migrations_version migrations_version_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations_version
    ADD CONSTRAINT migrations_version_pkey PRIMARY KEY (version);


--
-- Name: groups fk_groups_owner_id; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.groups
    ADD CONSTRAINT fk_groups_owner_id FOREIGN KEY (owner_id) REFERENCES app.users(id) ON DELETE CASCADE;


--
-- Name: todos fk_todos_group_id; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.todos
    ADD CONSTRAINT fk_todos_group_id FOREIGN KEY (group_id) REFERENCES app.groups(id);


--
-- Name: todos fk_todos_owner_id; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.todos
    ADD CONSTRAINT fk_todos_owner_id FOREIGN KEY (owner_id) REFERENCES app.users(id) ON DELETE CASCADE;


--
-- Name: todos todos_owner_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.todos
    ADD CONSTRAINT todos_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES app.users(id) ON DELETE CASCADE;


--
-- Name: users_groups users_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.users_groups
    ADD CONSTRAINT users_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES app.groups(id) ON DELETE CASCADE;


--
-- Name: users_groups users_groups_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.users_groups
    ADD CONSTRAINT users_groups_user_id_fkey FOREIGN KEY (user_id) REFERENCES app.users(id) ON DELETE CASCADE;


--
-- Name: todos p_todos; Type: POLICY; Schema: app; Owner: -
--

CREATE POLICY p_todos ON app.todos TO appuser USING ((owner_id = (current_setting('app.uid'::text))::uuid));


--
-- Name: todos p_todos_insert; Type: POLICY; Schema: app; Owner: -
--

CREATE POLICY p_todos_insert ON app.todos FOR INSERT TO appuser WITH CHECK (true);


--
-- Name: todos; Type: ROW SECURITY; Schema: app; Owner: -
--

ALTER TABLE app.todos ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.migrations_version (version) VALUES
    ('20240325144512'),
    ('20240325144656'),
    ('20240325144820');
