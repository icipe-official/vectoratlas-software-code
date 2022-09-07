
--
-- TOC entry 2 (class 3079 OID 19494)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 4529 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

--
-- TOC entry 266 (class 1259 OID 19505)
-- Name: anthropo_zoophagic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.anthropo_zoophagic (
    host_sampling_indoor character varying(50),
    indoor_host_n integer,
    host_sampling_outdoor character varying(50),
    outdoor_host_n integer,
    host_sampling_combined_1 character varying(50),
    host_sampling_combined_2 character varying(50),
    host_sampling_combined_3 character varying(50),
    host_sampling_combined_n character varying(50),
    combined_host_n integer,
    host_unit character varying(50),
    host_sampling_other_1 character varying(50),
    host_sampling_other_2 character varying(50),
    host_sampling_other_3 character varying(50),
    host_sampling_other_n character varying(50),
    other_host_n integer,
    other_host_total integer,
    host_other_unit character varying(50),
    indoor_host_perc double precision,
    outdoor_host_perc double precision,
    combined_host double precision,
    host_other double precision,
    id character varying(256) NOT NULL,
    notes character varying,
    indoor_host_total double precision,
    outdoor_host_total double precision,
    combined_host_total double precision
);


ALTER TABLE public.anthropo_zoophagic OWNER TO postgres;

--
-- TOC entry 267 (class 1259 OID 19512)
-- Name: biology; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.biology (
    sampling_1 character varying(50),
    sampling_2 character varying(50),
    sampling_3 character varying(50),
    sampling_n character varying(50),
    parity_n double precision,
    parity_total double precision,
    parity_perc double precision,
    daily_survival_rate double precision,
    fecundity double precision,
    gonotrophic_cycle_days double precision,
    id character varying(256) NOT NULL,
    notes character varying
);


ALTER TABLE public.biology OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 19519)
-- Name: bionomics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bionomics (
    adult_data boolean,
    larval_site_data boolean,
    contact_authors boolean,
    contact_notes character varying(50),
    secondary_info character varying(50),
    insecticide_control boolean,
    control character varying(250),
    month_start integer,
    year_start integer,
    month_end integer,
    year_end integer,
    season_given character varying(50),
    season_calc character varying(50),
    data_abstracted_by character varying(250),
    data_checked_by character varying(250),
    id character varying(256) NOT NULL,
    control_notes character varying,
    season_notes character varying,
    "referenceId" character varying(256) NOT NULL,
    "siteId" character varying(256) NOT NULL,
    "speciesId" character varying(256) NOT NULL,
    "biologyId" character varying(256),
    "infectionId" character varying(256),
    "bitingRateId" character varying(256),
    "anthropoZoophagicId" character varying(256),
    "endoExophagicId" character varying(256),
    "bitingActivityId" character varying(256),
    "endoExophilyId" character varying(256)
);


ALTER TABLE public.bionomics OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 19526)
-- Name: biting_activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.biting_activity (
    sampling_nights_no_indoor integer,
    "18_30_21_30_indoor" integer,
    "21_30_00_30_indoor" integer,
    "00_30_03_30_indoor" integer,
    "03_30_06_30_indoor" integer,
    sampling_nights_no_outdoor integer,
    "18_30_21_30_outdoor" integer,
    "21_30_00_30_outdoor" integer,
    "00_30_03_30_outdoor" integer,
    "03_30_06_30_outdoor" integer,
    sampling_nights_no_combined integer,
    "18_30_21_30_combined" integer,
    "21_30_00_30_combined" integer,
    "00_30_03_30_combined" integer,
    "03_30_06_30_combined" integer,
    id character varying(256) NOT NULL,
    notes character varying
);


ALTER TABLE public.biting_activity OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 19533)
-- Name: biting_rate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.biting_rate (
    hbr_sampling_indoor character varying(50),
    hbr_sampling_outdoor character varying(50),
    hbr_sampling_combined_1 character varying(50),
    hbr_sampling_combined_2 character varying(50),
    hbr_sampling_combined_3 character varying(50),
    hbr_sampling_combined_n character varying(50),
    hbr_unit character varying(50),
    abr_sampling_combined_1 character varying(50),
    abr_sampling_combined_2 character varying(50),
    abr_sampling_combined_3 character varying(50),
    abr_sampling_combined_n character varying(50),
    abr_unit character varying(50),
    indoor_hbr double precision,
    outdoor_hbr double precision,
    combined_hbr double precision,
    abr double precision,
    id character varying(256) NOT NULL,
    notes character varying
);


ALTER TABLE public.biting_rate OWNER TO postgres;

--
-- TOC entry 271 (class 1259 OID 19540)
-- Name: endo_exophagic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.endo_exophagic (
    sampling_nights_no_indoor integer,
    biting_sampling_indoor character varying(20),
    sampling_nights_no_outdoor integer,
    biting_sampling_outdoor character varying(20),
    biting_unit character varying(20),
    indoor_biting_n double precision,
    indoor_biting_total double precision,
    indoor_biting_data double precision,
    outdoor_biting_n double precision,
    outdoor_biting_total double precision,
    outdoor_biting_data double precision,
    id character varying(256) NOT NULL,
    notes character varying
);


ALTER TABLE public.endo_exophagic OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 19547)
-- Name: endo_exophily; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.endo_exophily (
    resting_sampling_indoor character varying(20),
    resting_sampling_outdoor character varying(20),
    resting_sampling_other character varying(20),
    resting_unit character varying(50),
    unfed_indoor double precision,
    fed_indoor double precision,
    gravid_indoor double precision,
    total_indoor double precision,
    unfed_outdoor double precision,
    fed_outdoor double precision,
    gravid_outdoor double precision,
    total_outdoor double precision,
    unfed_other double precision,
    fed_other double precision,
    gravid_other double precision,
    total_other double precision,
    id character varying(256) NOT NULL,
    notes character varying
);


ALTER TABLE public.endo_exophily OWNER TO postgres;

--
-- TOC entry 273 (class 1259 OID 19554)
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
-- TOC entry 274 (class 1259 OID 19561)
-- Name: infection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.infection (
    sampling_1 character varying(50),
    sampling_2 character varying(50),
    sampling_3 character varying(50),
    sampling_n character varying(50),
    ir_by_csp_n_pool integer,
    ir_by_csp_total_pool integer,
    no_per_pool integer,
    sr_by_dissection_n integer,
    sr_by_dissection_total integer,
    sr_by_csp_n integer,
    sr_by_csp_total integer,
    sr_by_pf_n integer,
    sr_by_pf_total integer,
    oocyst_n integer,
    oocyst_total integer,
    eir_period character varying(20),
    ir_by_csp_perc double precision,
    sr_by_dissection_perc double precision,
    sr_by_csp_perc double precision,
    sr_by_p_falciparum double precision,
    oocyst_rate double precision,
    eir double precision,
    eir_days double precision,
    id character varying(256) NOT NULL,
    notes character varying
);


ALTER TABLE public.infection OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 19568)
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 19574)
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
-- TOC entry 4530 (class 0 OID 0)
-- Dependencies: 276
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- TOC entry 277 (class 1259 OID 19576)
-- Name: occurrence; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.occurrence (
    month_start integer,
    year_start integer,
    month_end integer,
    year_end integer,
    dec_id character varying(20),
    dec_check character varying(20),
    map_check character varying(20),
    id character varying(256) NOT NULL,
    vector_notes character varying,
    "referenceId" character varying(256) NOT NULL,
    "siteId" character varying(256) NOT NULL,
    "speciesId" character varying(256) NOT NULL,
    "sampleId" character varying(256)
);


ALTER TABLE public.occurrence OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 19583)
-- Name: reference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reference (
    author character varying(250),
    article_title character varying(250),
    journal_title character varying(250),
    year integer,
    published boolean,
    report_type character varying(50),
    citations character varying(250),
    v_data boolean,
    id character varying(256) NOT NULL
);


ALTER TABLE public.reference OWNER TO postgres;

--
-- TOC entry 279 (class 1259 OID 19590)
-- Name: sample; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sample (
    mossamp_tech_1 character varying(50),
    n_1 integer,
    mossamp_tech_2 character varying(50),
    n_2 integer,
    mossamp_tech_3 character varying(50),
    n_3 integer,
    mossamp_tech_4 character varying(50),
    n_4 integer,
    n_all integer,
    control boolean,
    control_type character varying(20),
    id character varying(256) NOT NULL
);


ALTER TABLE public.sample OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 19594)
-- Name: site; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site (
    country character varying(250) NOT NULL,
    name character varying(250) NOT NULL,
    map_site integer,
    location public.geometry(Point,4326) NOT NULL,
    georef_source character varying(50),
    gaul_code integer,
    admin_level integer,
    admin_1 character varying(50),
    admin_2 character varying(50),
    admin_3 character varying(50),
    admin_2_id integer,
    location_2 public.geometry(Point,4326),
    latlong_source character varying(50),
    good_guess boolean,
    bad_guess boolean,
    rural_urban character varying(50),
    is_forest boolean,
    is_rice boolean,
    latitude character varying(50) NOT NULL,
    longitude character varying(50) NOT NULL,
    latitude_2 character varying(50),
    longitude_2 character varying(50),
    id character varying(256) NOT NULL,
    site_notes character varying,
    georef_notes character varying,
    area_type character varying(50)
);


ALTER TABLE public.site OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 19601)
-- Name: species; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.species (
    species_1 character varying(50) NOT NULL,
    ss_sl character varying(20),
    assi boolean,
    species_2 character varying(50),
    id_method_1 character varying(250),
    id_method_2 character varying(250),
    id character varying(256) NOT NULL,
    assi_notes character varying,
    id_method_3 character varying(250)
);


ALTER TABLE public.species OWNER TO postgres;

--
-- TOC entry 4206 (class 2604 OID 19608)
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- TOC entry 4368 (class 2606 OID 19772)
-- Name: reference PK_01bacbbdd90839b7dce352e4250; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reference
    ADD CONSTRAINT "PK_01bacbbdd90839b7dce352e4250" PRIMARY KEY (id);


--
-- TOC entry 4350 (class 2606 OID 19782)
-- Name: biting_activity PK_04ea47e075b41736e42d402a46b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biting_activity
    ADD CONSTRAINT "PK_04ea47e075b41736e42d402a46b" PRIMARY KEY (id);


--
-- TOC entry 4372 (class 2606 OID 19764)
-- Name: sample PK_1e92238b098b5a4d13f6422cba7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sample
    ADD CONSTRAINT "PK_1e92238b098b5a4d13f6422cba7" PRIMARY KEY (id);


--
-- TOC entry 4332 (class 2606 OID 19774)
-- Name: biology PK_267213d4d955958ec6ecb053f7a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biology
    ADD CONSTRAINT "PK_267213d4d955958ec6ecb053f7a" PRIMARY KEY (id);


--
-- TOC entry 4356 (class 2606 OID 19784)
-- Name: endo_exophily PK_4abfe8867c98bde6fa0d7457c0a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endo_exophily
    ADD CONSTRAINT "PK_4abfe8867c98bde6fa0d7457c0a" PRIMARY KEY (id);


--
-- TOC entry 4374 (class 2606 OID 19766)
-- Name: site PK_635c0eeabda8862d5b0237b42b4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site
    ADD CONSTRAINT "PK_635c0eeabda8862d5b0237b42b4" PRIMARY KEY (id);


--
-- TOC entry 4352 (class 2606 OID 19778)
-- Name: biting_rate PK_75651183f2c5e29fd8191426cd0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.biting_rate
    ADD CONSTRAINT "PK_75651183f2c5e29fd8191426cd0" PRIMARY KEY (id);


--
-- TOC entry 4362 (class 2606 OID 19624)
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- TOC entry 4330 (class 2606 OID 19802)
-- Name: anthropo_zoophagic PK_91219d23a7713d84209a2c9d2e7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anthropo_zoophagic
    ADD CONSTRAINT "PK_91219d23a7713d84209a2c9d2e7" PRIMARY KEY (id);


--
-- TOC entry 4358 (class 2606 OID 19628)
-- Name: geo_data PK_92625c9e39474c07ec99bd80114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_data
    ADD CONSTRAINT "PK_92625c9e39474c07ec99bd80114" PRIMARY KEY (id);


--
-- TOC entry 4360 (class 2606 OID 19776)
-- Name: infection PK_96f53885cb8e561f8898e3e641b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.infection
    ADD CONSTRAINT "PK_96f53885cb8e561f8898e3e641b" PRIMARY KEY (id);


--
-- TOC entry 4334 (class 2606 OID 19786)
-- Name: bionomics PK_97c382a3550af8e528406eb732b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "PK_97c382a3550af8e528406eb732b" PRIMARY KEY (id);


--
-- TOC entry 4354 (class 2606 OID 19780)
-- Name: endo_exophagic PK_a10eb8c471145fbf6738b359edf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endo_exophagic
    ADD CONSTRAINT "PK_a10eb8c471145fbf6738b359edf" PRIMARY KEY (id);


--
-- TOC entry 4376 (class 2606 OID 19768)
-- Name: species PK_ae6a87f2423ba6c25dc43c32770; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.species
    ADD CONSTRAINT "PK_ae6a87f2423ba6c25dc43c32770" PRIMARY KEY (id);


--
-- TOC entry 4364 (class 2606 OID 19770)
-- Name: occurrence PK_db678abc0d87805e345ee35279a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.occurrence
    ADD CONSTRAINT "PK_db678abc0d87805e345ee35279a" PRIMARY KEY (id);


--
-- TOC entry 4336 (class 2606 OID 19792)
-- Name: bionomics UQ_45afe190a7c60150ad333cdcfa1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "UQ_45afe190a7c60150ad333cdcfa1" UNIQUE ("bitingRateId");


--
-- TOC entry 4338 (class 2606 OID 19796)
-- Name: bionomics UQ_6580eea7f5d8cbce7c40bada2a4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "UQ_6580eea7f5d8cbce7c40bada2a4" UNIQUE ("endoExophagicId");


--
-- TOC entry 4370 (class 2606 OID 19874)
-- Name: reference UQ_6da2fc126c3f67ce0fdcecbc5f8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reference
    ADD CONSTRAINT "UQ_6da2fc126c3f67ce0fdcecbc5f8" UNIQUE (author, article_title, journal_title, year, citations);


--
-- TOC entry 4340 (class 2606 OID 19794)
-- Name: bionomics UQ_be07c46beb3c24f41a3a3715596; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "UQ_be07c46beb3c24f41a3a3715596" UNIQUE ("anthropoZoophagicId");


--
-- TOC entry 4366 (class 2606 OID 27919)
-- Name: occurrence UQ_c77d571e529448a04a283924c17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.occurrence
    ADD CONSTRAINT "UQ_c77d571e529448a04a283924c17" UNIQUE ("sampleId");


--
-- TOC entry 4342 (class 2606 OID 19798)
-- Name: bionomics UQ_da63932571ddc6bda157bd3d8cc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "UQ_da63932571ddc6bda157bd3d8cc" UNIQUE ("bitingActivityId");


--
-- TOC entry 4344 (class 2606 OID 19800)
-- Name: bionomics UQ_de7b58582f44473a538d91a61ed; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "UQ_de7b58582f44473a538d91a61ed" UNIQUE ("endoExophilyId");


--
-- TOC entry 4346 (class 2606 OID 19790)
-- Name: bionomics UQ_ef1c9d91807c836c714ce6fd589; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "UQ_ef1c9d91807c836c714ce6fd589" UNIQUE ("infectionId");


--
-- TOC entry 4348 (class 2606 OID 19788)
-- Name: bionomics UQ_f5707b7206f9b94b0e53476909d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "UQ_f5707b7206f9b94b0e53476909d" UNIQUE ("biologyId");


--
-- TOC entry 4384 (class 2606 OID 19880)
-- Name: bionomics FK_4440983ad72e1de4e830e586d77; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_4440983ad72e1de4e830e586d77" FOREIGN KEY ("siteId") REFERENCES public.site(id);


--
-- TOC entry 4378 (class 2606 OID 19848)
-- Name: bionomics FK_45afe190a7c60150ad333cdcfa1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_45afe190a7c60150ad333cdcfa1" FOREIGN KEY ("bitingRateId") REFERENCES public.biting_rate(id);


--
-- TOC entry 4388 (class 2606 OID 19813)
-- Name: occurrence FK_4823840f77c01c8be609169e940; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.occurrence
    ADD CONSTRAINT "FK_4823840f77c01c8be609169e940" FOREIGN KEY ("speciesId") REFERENCES public.species(id);


--
-- TOC entry 4385 (class 2606 OID 19885)
-- Name: bionomics FK_630b8ed50a5ca7876fd7a321dad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_630b8ed50a5ca7876fd7a321dad" FOREIGN KEY ("speciesId") REFERENCES public.species(id);


--
-- TOC entry 4380 (class 2606 OID 19858)
-- Name: bionomics FK_6580eea7f5d8cbce7c40bada2a4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_6580eea7f5d8cbce7c40bada2a4" FOREIGN KEY ("endoExophagicId") REFERENCES public.endo_exophagic(id);


--
-- TOC entry 4390 (class 2606 OID 19803)
-- Name: occurrence FK_69457bf7344e306225f91c5bb76; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.occurrence
    ADD CONSTRAINT "FK_69457bf7344e306225f91c5bb76" FOREIGN KEY ("referenceId") REFERENCES public.reference(id);


--
-- TOC entry 4379 (class 2606 OID 19853)
-- Name: bionomics FK_be07c46beb3c24f41a3a3715596; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_be07c46beb3c24f41a3a3715596" FOREIGN KEY ("anthropoZoophagicId") REFERENCES public.anthropo_zoophagic(id);


--
-- TOC entry 4383 (class 2606 OID 19875)
-- Name: bionomics FK_c16633f8b002bd154c433959095; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_c16633f8b002bd154c433959095" FOREIGN KEY ("referenceId") REFERENCES public.reference(id);


--
-- TOC entry 4387 (class 2606 OID 36107)
-- Name: occurrence FK_c77d571e529448a04a283924c17; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.occurrence
    ADD CONSTRAINT "FK_c77d571e529448a04a283924c17" FOREIGN KEY ("sampleId") REFERENCES public.sample(id);


--
-- TOC entry 4389 (class 2606 OID 19808)
-- Name: occurrence FK_c8affe6c11913c6e36211174267; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.occurrence
    ADD CONSTRAINT "FK_c8affe6c11913c6e36211174267" FOREIGN KEY ("siteId") REFERENCES public.site(id);


--
-- TOC entry 4381 (class 2606 OID 19863)
-- Name: bionomics FK_da63932571ddc6bda157bd3d8cc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_da63932571ddc6bda157bd3d8cc" FOREIGN KEY ("bitingActivityId") REFERENCES public.biting_activity(id);


--
-- TOC entry 4382 (class 2606 OID 19868)
-- Name: bionomics FK_de7b58582f44473a538d91a61ed; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_de7b58582f44473a538d91a61ed" FOREIGN KEY ("endoExophilyId") REFERENCES public.endo_exophily(id);


--
-- TOC entry 4377 (class 2606 OID 19843)
-- Name: bionomics FK_ef1c9d91807c836c714ce6fd589; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_ef1c9d91807c836c714ce6fd589" FOREIGN KEY ("infectionId") REFERENCES public.infection(id);


--
-- TOC entry 4386 (class 2606 OID 19895)
-- Name: bionomics FK_f5707b7206f9b94b0e53476909d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bionomics
    ADD CONSTRAINT "FK_f5707b7206f9b94b0e53476909d" FOREIGN KEY ("biologyId") REFERENCES public.biology(id);


-- Completed on 2022-09-06 14:10:07

--
-- PostgreSQL database dump complete
--

