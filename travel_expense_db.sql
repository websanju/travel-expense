--
-- PostgreSQL database dump
--

\restrict vA9QXw1J8bi5CFaVOIJuXL6BayrjzciNR9T5RRd1arPYb6oUC4AfwrMphrsq6If

-- Dumped from database version 16.14 (Homebrew)
-- Dumped by pg_dump version 16.14 (Homebrew)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: sanjaykumbhar
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO sanjaykumbhar;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: sanjaykumbhar
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Expense; Type: TABLE; Schema: public; Owner: sanjaykumbhar
--

CREATE TABLE public."Expense" (
    id text NOT NULL,
    title text NOT NULL,
    amount double precision NOT NULL,
    category text NOT NULL,
    notes text,
    "expenseDate" timestamp(3) without time zone NOT NULL,
    "isPublic" boolean DEFAULT false NOT NULL,
    "tripId" text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "paidById" text
);


ALTER TABLE public."Expense" OWNER TO sanjaykumbhar;

--
-- Name: Trip; Type: TABLE; Schema: public; Owner: sanjaykumbhar
--

CREATE TABLE public."Trip" (
    id text NOT NULL,
    title text NOT NULL,
    destination text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "isPublic" boolean DEFAULT false NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Trip" OWNER TO sanjaykumbhar;

--
-- Name: TripMember; Type: TABLE; Schema: public; Owner: sanjaykumbhar
--

CREATE TABLE public."TripMember" (
    id text NOT NULL,
    name text NOT NULL,
    "tripId" text NOT NULL
);


ALTER TABLE public."TripMember" OWNER TO sanjaykumbhar;

--
-- Name: User; Type: TABLE; Schema: public; Owner: sanjaykumbhar
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    image text,
    phone text
);


ALTER TABLE public."User" OWNER TO sanjaykumbhar;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: sanjaykumbhar
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO sanjaykumbhar;

--
-- Data for Name: Expense; Type: TABLE DATA; Schema: public; Owner: sanjaykumbhar
--

COPY public."Expense" (id, title, amount, category, notes, "expenseDate", "isPublic", "tripId", "userId", "createdAt", "paidById") FROM stdin;
cmpuscq460003it23ejb3uarr	Water Park	250	General	\N	2026-06-01 05:46:16.756	f	cmpura3g90007itx43mdlpnc3	cmpqylweu0000itua8vagvbpz	2026-06-01 05:46:16.759	cmpus30hl0000it23rzri2864
cmpusdqis0004it2319mlolgs	Lunch	3200	General	\N	2026-06-01 05:47:03.939	f	cmpura3g90007itx43mdlpnc3	cmpqylweu0000itua8vagvbpz	2026-06-01 05:47:03.941	cmpus3i1y0001it231mm7wa3b
cmpuseboo0005it23dcui8en9	Nasto	890	General	\N	2026-06-01 05:47:31.367	f	cmpura3g90007itx43mdlpnc3	cmpqylweu0000itua8vagvbpz	2026-06-01 05:47:31.368	cmpus3mb80002it23lhj88j4c
\.


--
-- Data for Name: Trip; Type: TABLE DATA; Schema: public; Owner: sanjaykumbhar
--

COPY public."Trip" (id, title, destination, "startDate", "endDate", "isPublic", "userId", "createdAt") FROM stdin;
cmpura3g90007itx43mdlpnc3	PATAN 	DWARKA	2026-06-01 05:16:14.367	2026-06-01 05:16:14.367	f	cmpqylweu0000itua8vagvbpz	2026-06-01 05:16:14.456
cmpv3goii0007it2384fl6qt2	Udaipur Toor 	Udaipur	2026-06-01 10:57:16.992	2026-06-01 10:57:16.993	f	cmpqylweu0000itua8vagvbpz	2026-06-01 10:57:17.082
\.


--
-- Data for Name: TripMember; Type: TABLE DATA; Schema: public; Owner: sanjaykumbhar
--

COPY public."TripMember" (id, name, "tripId") FROM stdin;
cmpus30hl0000it23rzri2864	Sanjay	cmpura3g90007itx43mdlpnc3
cmpus3i1y0001it231mm7wa3b	Anil	cmpura3g90007itx43mdlpnc3
cmpus3mb80002it23lhj88j4c	sunil	cmpura3g90007itx43mdlpnc3
cmpw8uw2e0000itjamzbsadzp	vedant	cmpura3g90007itx43mdlpnc3
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: sanjaykumbhar
--

COPY public."User" (id, name, email, password, "createdAt", image, phone) FROM stdin;
cmpqylweu0000itua8vagvbpz	sanjay	sanjay@gmail.com	$2b$10$eVD63wbBiZxnubNVdv9enuLuTGPLyzcofJjMRTO0No6rYuMq5d.Ym	2026-05-29 13:30:17.794	https://media.licdn.com/dms/image/v2/D5603AQEl43f0-oMFSQ/profile-displayphoto-crop_800_800/B56Z3amafyIQAI-/0/1777489001888?e=1781740800&v=beta&t=wW-5fZMSfiNRW7rbHsI4geMmyhxcpbgVNkjmQ12MxwY	9173645474
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: sanjaykumbhar
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
4fba1506-c0d7-4b1a-8c79-e307a736fc65	77f7b7ef68b0b20e60ea5132f5858417970816f8161280af186c2099ae1b557c	2026-05-29 17:36:52.923545+05:30	20260529050444_init	\N	\N	2026-05-29 17:36:52.913097+05:30	1
9f04d055-e444-4cb1-906c-ca3ecb5c2aa1	d0343b0742b874a36b315b75aade9dde7229cb9b9c0a8a50b27f3c12fc427b52	2026-05-29 17:43:08.345561+05:30	20260529121308_trip_members	\N	\N	2026-05-29 17:43:08.342285+05:30	1
ad7cac9c-50e9-4e28-927f-f3b4f43572b8	530f84f952dfdd76688cdf008961695b0244e8bee1f3650aedfbc906db3130ad	2026-05-29 19:20:54.378087+05:30	20260529135054_optional_paidby	\N	\N	2026-05-29 19:20:54.37364+05:30	1
29c87a07-3429-47b0-bb1f-13341b717f64	24a20dd3c1ca6a40ce9a8eb85009f5b19a3cd8c1c5f0545c9108edda03ad6804	2026-06-01 16:48:14.821153+05:30	20260601111814_add_user_profile_fields	\N	\N	2026-06-01 16:48:14.81842+05:30	1
\.


--
-- Name: Expense Expense_pkey; Type: CONSTRAINT; Schema: public; Owner: sanjaykumbhar
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_pkey" PRIMARY KEY (id);


--
-- Name: TripMember TripMember_pkey; Type: CONSTRAINT; Schema: public; Owner: sanjaykumbhar
--

ALTER TABLE ONLY public."TripMember"
    ADD CONSTRAINT "TripMember_pkey" PRIMARY KEY (id);


--
-- Name: Trip Trip_pkey; Type: CONSTRAINT; Schema: public; Owner: sanjaykumbhar
--

ALTER TABLE ONLY public."Trip"
    ADD CONSTRAINT "Trip_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: sanjaykumbhar
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: sanjaykumbhar
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: sanjaykumbhar
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Expense Expense_paidById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sanjaykumbhar
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_paidById_fkey" FOREIGN KEY ("paidById") REFERENCES public."TripMember"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Expense Expense_tripId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sanjaykumbhar
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES public."Trip"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Expense Expense_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sanjaykumbhar
--

ALTER TABLE ONLY public."Expense"
    ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TripMember TripMember_tripId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sanjaykumbhar
--

ALTER TABLE ONLY public."TripMember"
    ADD CONSTRAINT "TripMember_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES public."Trip"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Trip Trip_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: sanjaykumbhar
--

ALTER TABLE ONLY public."Trip"
    ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: sanjaykumbhar
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict vA9QXw1J8bi5CFaVOIJuXL6BayrjzciNR9T5RRd1arPYb6oUC4AfwrMphrsq6If

