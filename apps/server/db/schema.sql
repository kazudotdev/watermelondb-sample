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
-- Name: jwks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jwks (
    id integer NOT NULL,
    key_data text NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: jwks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jwks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jwks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jwks_id_seq OWNED BY public.jwks.id;


--
-- Name: migrations_version; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations_version (
    version character varying(128) NOT NULL
);


--
-- Name: passcodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.passcodes (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    ttl integer NOT NULL,
    code character varying(255) NOT NULL,
    try_count integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: password_credentials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_credentials (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: schema_migration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migration (
    version character varying(14) NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    verified boolean NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: webauthn_credential_transports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.webauthn_credential_transports (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    webauthn_credential_id character varying(255) NOT NULL
);


--
-- Name: webauthn_credentials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.webauthn_credentials (
    id character varying(255) NOT NULL,
    user_id uuid NOT NULL,
    public_key text NOT NULL,
    attestation_type character varying(255) NOT NULL,
    aaguid uuid NOT NULL,
    sign_count integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: webauthn_session_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.webauthn_session_data (
    id uuid NOT NULL,
    challenge character varying(255) NOT NULL,
    user_id uuid NOT NULL,
    user_verification character varying(255) NOT NULL,
    operation character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: webauthn_session_data_allowed_credentials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.webauthn_session_data_allowed_credentials (
    id uuid NOT NULL,
    credential_id character varying(255) NOT NULL,
    webauthn_session_data_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: jwks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jwks ALTER COLUMN id SET DEFAULT nextval('public.jwks_id_seq'::regclass);


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
-- Name: jwks jwks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jwks
    ADD CONSTRAINT jwks_pkey PRIMARY KEY (id);


--
-- Name: migrations_version migrations_version_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations_version
    ADD CONSTRAINT migrations_version_pkey PRIMARY KEY (version);


--
-- Name: passcodes passcodes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passcodes
    ADD CONSTRAINT passcodes_pkey PRIMARY KEY (id);


--
-- Name: password_credentials password_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_credentials
    ADD CONSTRAINT password_credentials_pkey PRIMARY KEY (id);


--
-- Name: schema_migration schema_migration_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migration
    ADD CONSTRAINT schema_migration_pkey PRIMARY KEY (version);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credential_transports webauthn_credential_transports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webauthn_credential_transports
    ADD CONSTRAINT webauthn_credential_transports_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: webauthn_session_data_allowed_credentials webauthn_session_data_allowed_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webauthn_session_data_allowed_credentials
    ADD CONSTRAINT webauthn_session_data_allowed_credentials_pkey PRIMARY KEY (id);


--
-- Name: webauthn_session_data webauthn_session_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webauthn_session_data
    ADD CONSTRAINT webauthn_session_data_pkey PRIMARY KEY (id);


--
-- Name: password_credentials_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX password_credentials_user_id_idx ON public.password_credentials USING btree (user_id);


--
-- Name: schema_migration_version_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX schema_migration_version_idx ON public.schema_migration USING btree (version);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: webauthn_credential_transports_name_webauthn_credential_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX webauthn_credential_transports_name_webauthn_credential_id_idx ON public.webauthn_credential_transports USING btree (name, webauthn_credential_id);


--
-- Name: webauthn_session_data_challenge_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX webauthn_session_data_challenge_idx ON public.webauthn_session_data USING btree (challenge);


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
-- Name: passcodes passcodes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.passcodes
    ADD CONSTRAINT passcodes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: password_credentials password_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_credentials
    ADD CONSTRAINT password_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: webauthn_credential_transports webauthn_credential_transports_webauthn_credential_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webauthn_credential_transports
    ADD CONSTRAINT webauthn_credential_transports_webauthn_credential_id_fkey FOREIGN KEY (webauthn_credential_id) REFERENCES public.webauthn_credentials(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: webauthn_session_data_allowed_credentials webauthn_session_data_allowed_cre_webauthn_session_data_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webauthn_session_data_allowed_credentials
    ADD CONSTRAINT webauthn_session_data_allowed_cre_webauthn_session_data_id_fkey FOREIGN KEY (webauthn_session_data_id) REFERENCES public.webauthn_session_data(id) ON UPDATE CASCADE ON DELETE CASCADE;


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
