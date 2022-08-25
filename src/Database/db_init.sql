--
-- PostgreSQL database dump
--

-- Dumped from database version 10.21
-- Dumped by pg_dump version 14.4

-- Started on 2022-08-24 16:05:44

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
-- TOC entry 4530 (class 1262 OID 16384)
-- Name: mva; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE mva WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


ALTER DATABASE mva OWNER TO postgres;

\connect mva

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
-- TOC entry 4531 (class 0 OID 0)
-- Name: mva; Type: DATABASE PROPERTIES; Schema: -; Owner: postgres
--

ALTER DATABASE mva SET search_path TO '$user', 'public', 'topology', 'tiger';


\connect mva

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
-- TOC entry 9 (class 2615 OID 19058)
-- Name: tiger; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA tiger;


ALTER SCHEMA tiger OWNER TO postgres;

--
-- TOC entry 11 (class 2615 OID 19336)
-- Name: tiger_data; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA tiger_data;


ALTER SCHEMA tiger_data OWNER TO postgres;

--
-- TOC entry 10 (class 2615 OID 18885)
-- Name: topology; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO postgres;

--
-- TOC entry 4532 (class 0 OID 0)
-- Dependencies: 10
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';


--
-- TOC entry 3 (class 3079 OID 19047)
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- TOC entry 4533 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- TOC entry 4 (class 3079 OID 17940)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 4534 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


--
-- TOC entry 6 (class 3079 OID 19059)
-- Name: postgis_tiger_geocoder; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder WITH SCHEMA tiger;


--
-- TOC entry 4535 (class 0 OID 0)
-- Dependencies: 6
-- Name: EXTENSION postgis_tiger_geocoder; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_tiger_geocoder IS 'PostGIS tiger geocoder and reverse geocoder';


--
-- TOC entry 5 (class 3079 OID 18886)
-- Name: postgis_topology; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_topology WITH SCHEMA topology;


--
-- TOC entry 4536 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION postgis_topology; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_topology IS 'PostGIS topology spatial types and functions';


--
-- TOC entry 2 (class 3079 OID 19494)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 4537 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

--
-- TOC entry 278 (class 1259 OID 35968)
-- Name: anthropo_zoophagic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.anthropo_zoophagic (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    host_sampling_indoor character varying(50) NOT NULL,
    indoor_host_n integer NOT NULL,
    indoor_host_total integer NOT NULL,
    indoor_host_perc integer NOT NULL,
    host_sampling_outdoor character varying(50) NOT NULL,
    outdoor_host_n integer NOT NULL,
    outdoor_host_total integer NOT NULL,
    outdoor_host_perc integer NOT NULL,
    host_sampling_combined_1 character varying(50) NOT NULL,
    host_sampling_combined_2 character varying(50) NOT NULL,
    host_sampling_combined_3 character varying(50) NOT NULL,
    host_sampling_combined_n character varying(50) NOT NULL,
    combined_host_n integer NOT NULL,
    combined_host_total integer NOT NULL,
    combined_host integer NOT NULL,
    host_unit character varying(50) NOT NULL,
    host_sampling_other_1 character varying(50) NOT NULL,
    host_sampling_other_2 character varying(50) NOT NULL,
    host_sampling_other_3 character varying(50) NOT NULL,
    host_sampling_other_n character varying(50) NOT NULL,
    other_host_n integer NOT NULL,
    other_host_total integer NOT NULL,
    host_other integer NOT NULL,
    host_other_unit character varying(50) NOT NULL,
    notes character varying(10485760) NOT NULL
);


ALTER TABLE public.anthropo_zoophagic OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 35936)
-- Name: biology; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.biology (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    sampling_1 character varying(50) NOT NULL,
    sampling_2 character varying(50) NOT NULL,
    sampling_3 character varying(50) NOT NULL,
    sampling_n character varying(50) NOT NULL,
    parity_n integer NOT NULL,
    parity_total integer NOT NULL,
    parity_perc integer NOT NULL,
    daily_survival_rate integer NOT NULL,
    fecundity integer NOT NULL,
    gonotrophic_cycle_days integer NOT NULL,
    notes character varying(10485760) NOT NULL
);


ALTER TABLE public.biology OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 19547)
-- Name: bionomics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bionomics (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    adult_data boolean NOT NULL,
    larval_site_data boolean NOT NULL,
    contact_authors boolean NOT NULL,
    contact_notes character varying(50) NOT NULL,
    secondary_info character varying(50) NOT NULL,
    insecticide_control boolean NOT NULL,
    control character varying(250) NOT NULL,
    control_notes character varying(10485760) NOT NULL,
    month_start integer NOT NULL,
    year_start integer NOT NULL,
    month_end integer NOT NULL,
    year_end integer NOT NULL,
    season_given character varying(50) NOT NULL,
    season_calc character varying(50) NOT NULL,
    season_notes character varying(10485760) NOT NULL,
    id_1 character varying(250) NOT NULL,
    id_2 character varying(250) NOT NULL,
    data_abstracted_by character varying(250) NOT NULL,
    data_checked_by character varying(250) NOT NULL,
    "referenceId" uuid NOT NULL,
    "siteId" uuid NOT NULL,
    "speciesId" uuid NOT NULL,
    "biologyId" uuid,
    "infectionId" uuid,
    "bitingRateId" uuid,
    "anthropoZoophagicId" uuid,
    "endoExophagicId" uuid,
    "bitingActivityId" uuid,
    "endoExophilyId" uuid
);


ALTER TABLE public.bionomics OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 35959)
-- Name: biting_activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.biting_activity (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    sampling_nights_no_indoor integer NOT NULL,
    "18_30_21_30_indoor" integer NOT NULL,
    "21_30_00_30_indoor" integer NOT NULL,
    "00_30_03_30_indoor" integer NOT NULL,
    "03_30_06_30_indoor" integer NOT NULL,
    sampling_nights_no_outdoor integer NOT NULL,
    "18_30_21_30_outdoor" integer NOT NULL,
    "21_30_00_30_outdoor" integer NOT NULL,
    "00_30_03_30_outdoor" integer NOT NULL,
    "03_30_06_30_outdoor" integer NOT NULL,
    sampling_nights_no_combined integer NOT NULL,
    "18_30_21_30_combined" integer NOT NULL,
    "21_30_00_30_combined" integer NOT NULL,
    "00_30_03_30_combined" integer NOT NULL,
    "03_30_06_30_combined" integer NOT NULL,
    notes character varying(10485760) NOT NULL
);


ALTER TABLE public.biting_activity OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 35927)
-- Name: biting_rate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.biting_rate (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    hbr_sampling_indoor character varying(50) NOT NULL,
    indoor_hbr integer NOT NULL,
    hbr_sampling_outdoor character varying(50) NOT NULL,
    outdoor_hbr integer NOT NULL,
    hbr_sampling_combined_1 character varying(50) NOT NULL,
    hbr_sampling_combined_2 character varying(50) NOT NULL,
    hbr_sampling_combined_3 character varying(50) NOT NULL,
    hbr_sampling_combined_n character varying(50) NOT NULL,
    combined_hbr integer NOT NULL,
    hbr_unit character varying(50) NOT NULL,
    abr_sampling_combined_1 character varying(50) NOT NULL,
    abr_sampling_combined_2 character varying(50) NOT NULL,
    abr_sampling_combined_3 character varying(50) NOT NULL,
    abr_sampling_combined_n character varying(50) NOT NULL,
    abr integer NOT NULL,
    abr_unit character varying(50) NOT NULL,
    notes character varying(10485760) NOT NULL
);


ALTER TABLE public.biting_rate OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 35950)
-- Name: endo_exophagic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.endo_exophagic (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    sampling_nights_no_indoor integer NOT NULL,
    biting_sampling_indoor character varying(20) NOT NULL,
    indoor_biting_n integer NOT NULL,
    indoor_biting_total integer NOT NULL,
    indoor_biting_data integer NOT NULL,
    sampling_nights_no_outdoor integer NOT NULL,
    biting_sampling_outdoor character varying(20) NOT NULL,
    outdoor_biting_n integer NOT NULL,
    outdoor_biting_total integer NOT NULL,
    outdoor_biting_data integer NOT NULL,
    biting_unit character varying(20) NOT NULL,
    notes character varying(10485760) NOT NULL
);


ALTER TABLE public.endo_exophagic OWNER TO postgres;

--
-- TOC entry 279 (class 1259 OID 35977)
-- Name: endo_exophily; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.endo_exophily (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    resting_sampling_indoor character varying(20) NOT NULL,
    unfed_indoor integer NOT NULL,
    fed_indoor integer NOT NULL,
    gravid_indoor integer NOT NULL,
    total_indoor integer NOT NULL,
    resting_sampling_outdoor character varying(20) NOT NULL,
    unfed_outdoor integer NOT NULL,
    fed_outdoor integer NOT NULL,
    gravid_outdoor integer NOT NULL,
    total_outdoor integer NOT NULL,
    resting_sampling_other character varying(20) NOT NULL,
    unfed_other integer NOT NULL,
    fed_other integer NOT NULL,
    gravid_other integer NOT NULL,
    total_other integer NOT NULL,
    resting_unit character varying(50) NOT NULL,
    notes character varying(10485760) NOT NULL
);


ALTER TABLE public.endo_exophily OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 19505)
-- Name: geo_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.geo_data (
    location public.geometry(Point,4326),
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    species character varying(80) NOT NULL,
    prevalence integer NOT NULL
);


ALTER TABLE public.geo_data OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 35918)
-- Name: infection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.infection (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    sampling_1 character varying(50) NOT NULL,
    sampling_2 character varying(50) NOT NULL,
    sampling_3 character varying(50) NOT NULL,
    sampling_n character varying(50) NOT NULL,
    ir_by_csp_n_pool integer NOT NULL,
    ir_by_csp_total_pool integer NOT NULL,
    no_per_pool integer NOT NULL,
    ir_by_csp_perc integer NOT NULL,
    sr_by_dissection_n integer NOT NULL,
    sr_by_dissection_total integer NOT NULL,
    sr_by_dissection_perc integer NOT NULL,
    sr_by_csp_n integer NOT NULL,
    sr_by_csp_total integer NOT NULL,
    sr_by_csp_perc integer NOT NULL,
    sr_by_pf_n integer NOT NULL,
    sr_by_pf_total integer NOT NULL,
    sr_by_p_falciparum integer NOT NULL,
    oocyst_n integer NOT NULL,
    oocyst_total integer NOT NULL,
    oocyst_rate integer NOT NULL,
    eir integer NOT NULL,
    eir_period character varying(20) NOT NULL,
    eir_days integer NOT NULL,
    notes character varying(10485760) NOT NULL
);


ALTER TABLE public.infection OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 19512)
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 19518)
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO postgres;

--
-- TOC entry 4538 (class 0 OID 0)
-- Dependencies: 268
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 281 (class 1259 OID 35992)
-- Name: occurrence; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.occurrence (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    month_start integer NOT NULL,
    year_start integer NOT NULL,
    month_end integer NOT NULL,
    year_end integer NOT NULL,
    dec_id character varying(20) NOT NULL,
    dec_check character varying(20) NOT NULL,
    map_check character varying(20) NOT NULL,
    vector_notes character varying(10485760) NOT NULL,
    "referenceId" uuid NOT NULL,
    "siteId" uuid NOT NULL,
    "speciesId" uuid NOT NULL,
    "sampleId" uuid NOT NULL
);


ALTER TABLE public.occurrence OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 27726)
-- Name: reference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reference (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    author character varying(250) NOT NULL,
    article_title character varying(250) NOT NULL,
    journal_title character varying(250) NOT NULL,
    year integer NOT NULL,
    published boolean NOT NULL,
    report_type character varying(50) NOT NULL,
    v_data boolean NOT NULL
);


ALTER TABLE public.reference OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 35986)
-- Name: sample; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sample (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    mossamp_tech_1 character varying(50) NOT NULL,
    n_1 integer NOT NULL,
    mossamp_tech_2 character varying(50) NOT NULL,
    n_2 integer NOT NULL,
    mossamp_tech_3 character varying(50) NOT NULL,
    n_3 integer NOT NULL,
    mossamp_tech_4 character varying(50) NOT NULL,
    n_4 integer NOT NULL,
    n_all integer NOT NULL,
    mos_id_1 character varying(20) NOT NULL,
    mos_id_2 character varying(20) NOT NULL,
    mos_id_3 character varying(20) NOT NULL,
    mos_id_4 character varying(20) NOT NULL,
    control boolean NOT NULL,
    control_type character varying(20) NOT NULL
);


ALTER TABLE public.sample OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 27717)
-- Name: site; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    country character varying(250) NOT NULL,
    name character varying(250) NOT NULL,
    map_site integer NOT NULL,
    location public.geometry(Point,4326),
    area_type character varying(50) NOT NULL,
    georef_source character varying(50) NOT NULL,
    site_notes character varying(10485760) NOT NULL,
    gaul_code integer NOT NULL,
    admin_level integer NOT NULL,
    georef_notes character varying(10485760) NOT NULL,
    admin_1 character varying(50) NOT NULL,
    admin_2 character varying(50) NOT NULL,
    admin_3 character varying(50) NOT NULL,
    admin_2_id integer NOT NULL,
    location_2 public.geometry(Point,4326),
    latlong_source character varying(50) NOT NULL,
    good_guess boolean NOT NULL,
    bad_guess boolean NOT NULL,
    rural_urban character varying(50) NOT NULL,
    is_forest boolean NOT NULL,
    is_rice boolean NOT NULL
);


ALTER TABLE public.site OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 35909)
-- Name: species; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.species (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    species_1 character varying(50) NOT NULL,
    ss_sl character varying(20) NOT NULL,
    assi boolean NOT NULL,
    assi_notes character varying(10485760) NOT NULL,
    species_2 character varying(50) NOT NULL
);


ALTER TABLE public.species OWNER TO postgres;

--
-- TOC entry 4205 (class 2604 OID 19520)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- TOC entry 4364 (class 2606 OID 27734)
-- Name: reference PK_01bacbbdd90839b7dce352e4250; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reference
    ADD CONSTRAINT "PK_01bacbbdd90839b7dce352e4250" PRIMARY KEY (id);


--
-- TOC entry 4376 (class 2606 OID 35967)
-- Name: biting_activity PK_04ea47e075b41736e42d402a46b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biting_activity
    ADD CONSTRAINT "PK_04ea47e075b41736e42d402a46b" PRIMARY KEY (id);


--
-- TOC entry 4382 (class 2606 OID 35991)
-- Name: sample PK_1e92238b098b5a4d13f6422cba7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample
    ADD CONSTRAINT "PK_1e92238b098b5a4d13f6422cba7" PRIMARY KEY (id);


--
-- TOC entry 4372 (class 2606 OID 35944)
-- Name: biology PK_267213d4d955958ec6ecb053f7a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biology
    ADD CONSTRAINT "PK_267213d4d955958ec6ecb053f7a" PRIMARY KEY (id);


--
-- TOC entry 4380 (class 2606 OID 35985)
-- Name: endo_exophily PK_4abfe8867c98bde6fa0d7457c0a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endo_exophily
    ADD CONSTRAINT "PK_4abfe8867c98bde6fa0d7457c0a" PRIMARY KEY (id);


--
-- TOC entry 4362 (class 2606 OID 27725)
-- Name: site PK_635c0eeabda8862d5b0237b42b4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site
    ADD CONSTRAINT "PK_635c0eeabda8862d5b0237b42b4" PRIMARY KEY (id);


--
-- TOC entry 4370 (class 2606 OID 35935)
-- Name: biting_rate PK_75651183f2c5e29fd8191426cd0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biting_rate
    ADD CONSTRAINT "PK_75651183f2c5e29fd8191426cd0" PRIMARY KEY (id);


--
-- TOC entry 4344 (class 2606 OID 19522)
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- TOC entry 4378 (class 2606 OID 35976)
-- Name: anthropo_zoophagic PK_91219d23a7713d84209a2c9d2e7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anthropo_zoophagic
    ADD CONSTRAINT "PK_91219d23a7713d84209a2c9d2e7" PRIMARY KEY (id);


--
-- TOC entry 4342 (class 2606 OID 19524)
-- Name: geo_data PK_92625c9e39474c07ec99bd80114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_data
    ADD CONSTRAINT "PK_92625c9e39474c07ec99bd80114" PRIMARY KEY (id);


--
-- TOC entry 4368 (class 2606 OID 35926)
-- Name: infection PK_96f53885cb8e561f8898e3e641b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.infection
    ADD CONSTRAINT "PK_96f53885cb8e561f8898e3e641b" PRIMARY KEY (id);


--
-- TOC entry 4346 (class 2606 OID 19555)
-- Name: bionomics PK_97c382a3550af8e528406eb732b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "PK_97c382a3550af8e528406eb732b" PRIMARY KEY (id);


--
-- TOC entry 4374 (class 2606 OID 35958)
-- Name: endo_exophagic PK_a10eb8c471145fbf6738b359edf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endo_exophagic
    ADD CONSTRAINT "PK_a10eb8c471145fbf6738b359edf" PRIMARY KEY (id);


--
-- TOC entry 4366 (class 2606 OID 35917)
-- Name: species PK_ae6a87f2423ba6c25dc43c32770; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species
    ADD CONSTRAINT "PK_ae6a87f2423ba6c25dc43c32770" PRIMARY KEY (id);


--
-- TOC entry 4384 (class 2606 OID 36000)
-- Name: occurrence PK_db678abc0d87805e345ee35279a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.occurrence
    ADD CONSTRAINT "PK_db678abc0d87805e345ee35279a" PRIMARY KEY (id);


--
-- TOC entry 4348 (class 2606 OID 36026)
-- Name: bionomics UQ_45afe190a7c60150ad333cdcfa1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "UQ_45afe190a7c60150ad333cdcfa1" UNIQUE ("bitingRateId");


--
-- TOC entry 4350 (class 2606 OID 36030)
-- Name: bionomics UQ_6580eea7f5d8cbce7c40bada2a4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "UQ_6580eea7f5d8cbce7c40bada2a4" UNIQUE ("endoExophagicId");


--
-- TOC entry 4352 (class 2606 OID 36028)
-- Name: bionomics UQ_be07c46beb3c24f41a3a3715596; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "UQ_be07c46beb3c24f41a3a3715596" UNIQUE ("anthropoZoophagicId");


--
-- TOC entry 4354 (class 2606 OID 36032)
-- Name: bionomics UQ_da63932571ddc6bda157bd3d8cc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "UQ_da63932571ddc6bda157bd3d8cc" UNIQUE ("bitingActivityId");


--
-- TOC entry 4356 (class 2606 OID 36034)
-- Name: bionomics UQ_de7b58582f44473a538d91a61ed; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "UQ_de7b58582f44473a538d91a61ed" UNIQUE ("endoExophilyId");


--
-- TOC entry 4358 (class 2606 OID 36024)
-- Name: bionomics UQ_ef1c9d91807c836c714ce6fd589; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "UQ_ef1c9d91807c836c714ce6fd589" UNIQUE ("infectionId");


--
-- TOC entry 4360 (class 2606 OID 36022)
-- Name: bionomics UQ_f5707b7206f9b94b0e53476909d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "UQ_f5707b7206f9b94b0e53476909d" UNIQUE ("biologyId");


--
-- TOC entry 4393 (class 2606 OID 27740)
-- Name: bionomics FK_4440983ad72e1de4e830e586d77; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_4440983ad72e1de4e830e586d77" FOREIGN KEY ("siteId") REFERENCES public.site(id);


--
-- TOC entry 4389 (class 2606 OID 36045)
-- Name: bionomics FK_45afe190a7c60150ad333cdcfa1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_45afe190a7c60150ad333cdcfa1" FOREIGN KEY ("bitingRateId") REFERENCES public.biting_rate(id);


--
-- TOC entry 4396 (class 2606 OID 36011)
-- Name: occurrence FK_4823840f77c01c8be609169e940; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.occurrence
    ADD CONSTRAINT "FK_4823840f77c01c8be609169e940" FOREIGN KEY ("speciesId") REFERENCES public.species(id);


--
-- TOC entry 4392 (class 2606 OID 35945)
-- Name: bionomics FK_630b8ed50a5ca7876fd7a321dad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_630b8ed50a5ca7876fd7a321dad" FOREIGN KEY ("speciesId") REFERENCES public.species(id);


--
-- TOC entry 4387 (class 2606 OID 36055)
-- Name: bionomics FK_6580eea7f5d8cbce7c40bada2a4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_6580eea7f5d8cbce7c40bada2a4" FOREIGN KEY ("endoExophagicId") REFERENCES public.endo_exophagic(id);


--
-- TOC entry 4398 (class 2606 OID 36001)
-- Name: occurrence FK_69457bf7344e306225f91c5bb76; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.occurrence
    ADD CONSTRAINT "FK_69457bf7344e306225f91c5bb76" FOREIGN KEY ("referenceId") REFERENCES public.reference(id);


--
-- TOC entry 4388 (class 2606 OID 36050)
-- Name: bionomics FK_be07c46beb3c24f41a3a3715596; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_be07c46beb3c24f41a3a3715596" FOREIGN KEY ("anthropoZoophagicId") REFERENCES public.anthropo_zoophagic(id);


--
-- TOC entry 4394 (class 2606 OID 27735)
-- Name: bionomics FK_c16633f8b002bd154c433959095; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_c16633f8b002bd154c433959095" FOREIGN KEY ("referenceId") REFERENCES public.reference(id);


--
-- TOC entry 4395 (class 2606 OID 36016)
-- Name: occurrence FK_c77d571e529448a04a283924c17; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.occurrence
    ADD CONSTRAINT "FK_c77d571e529448a04a283924c17" FOREIGN KEY ("sampleId") REFERENCES public.sample(id);


--
-- TOC entry 4397 (class 2606 OID 36006)
-- Name: occurrence FK_c8affe6c11913c6e36211174267; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.occurrence
    ADD CONSTRAINT "FK_c8affe6c11913c6e36211174267" FOREIGN KEY ("siteId") REFERENCES public.site(id);


--
-- TOC entry 4386 (class 2606 OID 36060)
-- Name: bionomics FK_da63932571ddc6bda157bd3d8cc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_da63932571ddc6bda157bd3d8cc" FOREIGN KEY ("bitingActivityId") REFERENCES public.biting_activity(id);


--
-- TOC entry 4385 (class 2606 OID 36065)
-- Name: bionomics FK_de7b58582f44473a538d91a61ed; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_de7b58582f44473a538d91a61ed" FOREIGN KEY ("endoExophilyId") REFERENCES public.endo_exophily(id);


--
-- TOC entry 4390 (class 2606 OID 36040)
-- Name: bionomics FK_ef1c9d91807c836c714ce6fd589; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_ef1c9d91807c836c714ce6fd589" FOREIGN KEY ("infectionId") REFERENCES public.infection(id);


--
-- TOC entry 4391 (class 2606 OID 36035)
-- Name: bionomics FK_f5707b7206f9b94b0e53476909d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_f5707b7206f9b94b0e53476909d" FOREIGN KEY ("biologyId") REFERENCES public.biology(id);


-- Completed on 2022-08-24 16:05:48

--
-- PostgreSQL database dump complete
--

