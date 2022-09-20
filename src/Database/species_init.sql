--
-- PostgreSQL database dump
--

-- Dumped from database version 10.22
-- Dumped by pg_dump version 14.4

-- Started on 2022-09-20 14:33:51

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
-- TOC entry 4203 (class 0 OID 19583)
-- Dependencies: 278
-- Data for Name: reference; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reference (author, article_title, journal_title, year, published, report_type, v_data, id, citation) FROM stdin;
Irish et al.	Updated list of Anopheles (Diptera: Culicidae) species by country in the Afrotropical Region and associated islands	\N	2019	t	\N	\N	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Updated list of Anopheles (Diptera: Culicidae) species by country in the Afrotropical Region and associated islands
\.

--
-- TOC entry 4202 (class 0 OID 19601)
-- Dependencies: 281
-- Data for Name: species; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.species (id, subgenus, series, section, complex, species, year, "referenceId", species_author) FROM stdin;
9ad77af4-cd5a-4a41-a661-6221988b37e2	Cellia	Pyretophorus	\N	gambiae	amharicus	2013	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Hunt, Wilkerson & Coetzee
3a8572cb-70db-404e-8a62-4d958d123b3c	Cellia	Pyretophorus	\N	gambiae	arabiensis	1905	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Patton
5789c5c2-5f82-464f-9bc1-15922e36b928	Cellia	Neomyzomyia	Ardensis	\N	ardensis	1905	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Theobald)
ec99831d-7f78-4517-b8b5-302ccf92444d	Cellia	Cellia	\N	\N	argenteolobatus	1910	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Gough)
65d9e4b4-2be4-4419-8913-b01ac6b74ca4	Cellia	Myzomyia	Funestus	funestus	aruni	1968	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Sobti
90d465b5-c114-4a6c-bd1e-a81ed5756c7a	Cellia	Myzomyia	Marshallii-hancocki	\N	austenii	1905	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Theobald)
9bbbf779-585b-4530-b8be-76a6c2890960	Cellia	Myzomyia	\N	\N	azaniae	1960	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Bailly-Choumara
f540e2ce-7ed8-48f2-ae35-33df095e054a	Cellia	Paramyzomyia	\N	\N	azevedoi	1969	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Ribeiro
ea71334f-0b02-4c01-8c40-42d6fdeec3fa	Cellia	Myzomyia	\N	\N	barberellus	1932	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Evans
6884d9ab-4bfb-442d-bce9-6cda81cbd0a5	Cellia	Myzomyia	Marshallii-hancocki	\N	berghei	1949	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Vincke & Leleup
6c0b1c1e-a91b-4077-b5e5-537eb82d63e9	Cellia	Myzomyia	\N	\N	bervoetsi	1961	b44ae8d8-55dc-43bb-9235-1632f60c38e6	D'Haenens
d863bfa8-adf6-422e-8463-1f8f8ccdb198	Cellia	Myzomyia	Marshallii-hancocki	\N	brohieri	1929	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Edwards
96e9d3e6-2256-474d-aaee-1a463ba0afa7	Cellia	Myzomyia	Funestus	rivulorum	brucei	1960	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Service
48efc569-024c-4e3a-a4b5-975c43d1a0e5	Cellia	Cellia	\N	\N	brumpti	1955	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Hamon & Rickenbach
aa5c2f60-9109-4a6e-b39a-900e12e45602	Cellia	Myzomyia	\N	\N	brunnipes	1910	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Theobald)
8e0812de-11be-4a2c-8448-a6f9f805ac67	Cellia	Neomyzomyia	Ardensis	\N	buxtoni	1958	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Service
5f3568f9-4985-45e4-a383-4240b0bf8a93	Cellia	Pyretophorus	\N	gambiae	bwambae	1985	b44ae8d8-55dc-43bb-9235-1632f60c38e6	White
ca15efdf-7e2a-4f74-91f7-cbd1f69f8453	Anopheles	Myzorhynchus	\N	coustani	caliginosus	1943	b44ae8d8-55dc-43bb-9235-1632f60c38e6	De Meillon
aff41382-7262-444d-b2c5-c17cc2ee319a	Cellia	Neomyzomyia	Rhodesiensis	\N	cameroni	1935	b44ae8d8-55dc-43bb-9235-1632f60c38e6	de Meillon & Evans
58b4a27f-24dc-4086-b85a-7f32bd0f93a4	Cellia	Neomyzomyia	Ardensis	nili	carnevalei	1999	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Brunhes, le Goff & Geoffroy
ebed9d96-29c0-4e78-bd23-b5b720d9a7ef	Cellia	Neomyzomyia	Smithii	\N	caroni	1961	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Adam
fd0f0c0f-adeb-4b53-839a-0133f036ed8d	Cellia	Myzomyia	Demeilloni	\N	carteri	1933	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Evans & De Meillon
4c4ec165-c057-45bc-83cf-9aa63e1b5c0b	Cellia	Pyretophorus	\N	\N	christyi	1911	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Newstead & Carter)
5683e8c2-e52a-4414-b740-35ef56f53255	Cellia	Neomyzomyia	Ardensis	\N	cinctus	1910	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Newstead & Carter)
a9dec281-a754-4f6d-9d44-6b60e3ce68a0	Cellia	Paramyzomyia	\N	\N	cinereus	1901	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Theobald
c54413f4-4181-46a6-be53-db582474d3ca	Cellia	Pyretophorus	\N	gambiae	coluzzii	2013	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Coetzee & Wilkerson
f053bea7-ea17-49c0-ac90-691a2e185e23	Cellia	Pyretophorus	\N	\N	comorensis	1997	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Brunhes, le Goff & Geoffroy
e3b04659-ae94-46a9-90e1-350c115adb91	Anopheles	Anopheles	\N	\N	concolor	1938	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Edwards
d0ae2f60-f2ed-4fb6-be94-21cef3c5c20a	Cellia	Myzomyia	Funestus	\N	confusus	1935	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Evans & Leeson
42afc21f-76ce-40a0-9387-ee7ed8a1adbf	Anopheles	Myzorhynchus	\N	coustani	coustani	1900	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Laveran
87eeea6c-c601-46d9-bde8-310201298243	Cellia	Cellia	\N	\N	cristipalpis	1977	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Service
01f2d089-c3f7-426c-b1cd-ec0a43612570	Anopheles	Myzorhynchus	\N	coustani	crypticus	1994	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Coetzee
127ef97a-574d-4892-bac5-04ef1c205cb2	Cellia	Myzomyia	Funestus	culicifacies	culicifacies	1901	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Giles
e9db9f94-1c8c-40d4-a41e-1ae2078963a3	Cellia	Cellia	\N	\N	cydippis	1931	b44ae8d8-55dc-43bb-9235-1632f60c38e6	de Meillon
02259b89-694c-488f-8b2e-7215efe8b9ce	Cellia	Neocellia	\N	\N	dancalicus	1939	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Corradetti
a7ab244d-8098-4abd-9a77-0de54a0dfbd4	Cellia	Pyretophorus	\N	\N	daudi	1958	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Coluzzi
21b8e170-dbe3-4e64-8a7d-b90372c74eba	Cellia	Neomyzomyia	Ardensis	\N	deemingi	1970	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Service
125dfad6-08f8-4bfc-a46f-18af7da27f29	Cellia	Myzomyia	Demeilloni	\N	demeilloni	1933	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Evans
e854d7f3-c88b-4088-9087-514965bd4c8f	Cellia	Myzomyia	Wellcomei	\N	distinctus	1911	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Newstead & Carter)
9cff9925-3838-4fd7-834a-09c9c7e6d6d1	Cellia	Myzomyia	\N	\N	domicola	1916	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Edwards
f1d224ab-fe45-456f-8a40-6fcb769d9f01	Cellia	Myzomyia	\N	\N	dthali	1905	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Patton
9d791d9f-9cd1-4c19-afec-92b52d4cd4eb	Cellia	Neomyzomyia	Ardensis	\N	dualaensis	1999	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Brunhes, le Goff & Geoffroy
184cba0f-71f8-4cdf-8f37-699edc6a32ed	Cellia	Neomyzomyia	Ardensis	\N	dureni	1938	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Edwards
5613e44c-969b-4907-a8ba-ad2490a0d103	Cellia	Neomyzomyia	Ardensis	\N	eouzani	2003	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Brunhes, le Goff & Geoffroy
a0925ad2-7f94-47e1-bdf9-b6d1d3314c85	Cellia	Myzomyia	Wellcomei	\N	erepens	1958	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Gillies
b6a423a1-b277-4fc6-b7d2-2e89e229d942	Cellia	Myzomyia	\N	\N	erythraeus	1939	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Corradetti
19c0731e-4c5d-43f9-918f-4cc24db6901e	Cellia	Myzomyia	\N	\N	ethiopicus	1987	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Gillies & Coetzee
d881b4db-0c31-458c-a882-f518958130ea	Cellia	Neomyzomyia	Smithii	\N	faini	1952	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Leleup
3cd5a7e7-c6b6-4727-b719-fd5ed12c4f11	Cellia	Myzomyia	\N	\N	flavicosta	1911	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Edwards
cc6caf98-043e-490d-af12-788ba002a49a	Cellia	Pyretophorus	\N	gambiae	fontenillei	2019	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Barr�n, Paupy, Rahola, Akone-Ella, Ngangue, Wilson-Bahun, Pombi, Kengne, Costantini, Simard, Gonz�lez & Ayala
4e3a8a98-21aa-4b63-bf93-c3ed2e104528	Cellia	Myzomyia	\N	\N	fontinalis	1968	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Gillies & de Meillon
f6c98c79-5ddf-4811-aaeb-e2db8dbe049b	Cellia	Myzomyia	Demeilloni	\N	freetownensis	1925	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Evans
57b9baac-5b52-4639-b9b1-b2151fad9172	Cellia	Myzomyia	Funestus	funestus	funestus	1900	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Giles
b7451815-ea8e-4439-88d0-f4f8b8b5e723	Cellia	Myzomyia	Funestus	funestus	funestus-like	2009	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Spillings, Brooke, Koekemoer, Chiphwanya, Coetzee & Hunt
54265678-b506-470b-80ae-4a7ce09fee8f	Anopheles	Myzorhynchus	\N	coustani	fuscicolor	1947	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Van Someren
f2be3ec4-c48a-4f7a-8b47-9a60802a7563	Cellia	Myzomyia	Funestus	rivulorum	fuscivenosus	1930	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Leeson
2673a820-237c-4b6d-b60e-1dee24b548a2	Cellia	Myzomyia	\N	\N	gabonensis	2014	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Rahola, Makanga & Paupy
e1852b1b-e6b0-4a3c-afea-03b93815cb7c	Cellia	Pyretophorus	\N	gambiae	gambiae	1902	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Giles
24675f57-7529-4141-a2a6-95e67dd77909	Cellia	Myzomyia	Demeilloni	\N	garnhami	1930	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Edwards
cb8e4c64-d6f3-4fed-8b2f-32d4889a922c	Cellia	Myzomyia	Marshallii-hancocki	\N	gibbinsi	1935	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Evans
1981b16b-0438-4c87-8d26-4166cc0a9c6e	Cellia	Neomyzomyia	Pauliani	\N	grassei	1953	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Grjebine
10bbe861-094b-4ce6-a4ae-c7b11dab19bf	Cellia	Neomyzomyia	Pauliani	\N	grenieri	1964	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Grjebine
b9889a66-9796-459b-bb69-1ed084edc5f8	Cellia	Neomyzomyia	Ranci	\N	griveaudi	1960	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Grjebine
c5411421-a140-44d7-b45d-bd79f31a39ac	Cellia	Neomyzomyia	Smithii	\N	hamoni	1962	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Adam
02e01a77-1d33-46f2-bb76-9e7365fa1e6f	Cellia	Myzomyia	Marshallii-hancocki	\N	hancocki	1929	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Edwards
b89354ef-8111-4bfc-86ff-5a0814e42192	Cellia	Myzomyia	Marshallii-hancocki	\N	hargreavesi	1927	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Evans
ab77c7f6-7b80-45ec-955d-35f35b8fdecf	Cellia	Myzomyia	Marshallii-hancocki	\N	harperi	1936	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Evans
4dd31a76-9b74-47f3-a548-75c0506bda8c	Cellia	Neocellia	\N	\N	hervyi	1999	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Brunhes, le Goff & Geoffroy
66acdd2b-bcd5-49f8-8b42-cb65ed621bc7	Cellia	Myzomyia	Marshallii-hancocki	marshallii	hughi	1982	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Lambert & Coetzee
cd68d879-9027-48f1-a021-431b61b9771e	Christya	\N	\N	\N	implexus	1903	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Theobald)
ccef779f-4ca5-4a3d-835f-15b3557e858f	Cellia	Neomyzomyia	Smithii	\N	jebudensis	1944	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Froud
d0664856-fe71-4b0a-b057-ddcda9743cfe	Cellia	Myzomyia	Demeilloni	\N	keniensis	1931	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Evans
797e8b18-ba1e-4a41-b9fa-ed13507513bf	Cellia	Neomyzomyia	Ardensis	\N	kingi	1923	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Christophers
b82209e6-04a4-4551-b7e6-0873db2caa16	Cellia	Myzomyia	Marshallii-hancocki	marshallii	kosiensis	1987	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Coetzee, Segerman & Hunt
295449b1-93da-4b74-b042-bf4f5bb20f6a	Cellia	Neomyzomyia	Ranci	\N	lacani	1953	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Grjebine
82b9fe5b-3004-446e-9940-d6d8e1d26885	Cellia	Myzomyia	Funestus	\N	leesoni	1931	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Evans
0b26cc0a-4556-4e0d-a474-e21fd7f27f7b	Cellia	Myzomyia	Marshallii-hancocki	marshallii	letabensis	1982	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Lambert & Coetzee
ae191431-0f19-4208-83eb-3a72b894ffe4	Cellia	Paramyzomyia	\N	\N	listeri	1931	b44ae8d8-55dc-43bb-9235-1632f60c38e6	de Meillon
92d92f94-5756-4d45-a31e-79ccda6ef7ff	Cellia	Myzomyia	Demeilloni	\N	lloreti	1935	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Gil Collado
30907898-04f4-4fce-bd6d-11250d797000	Cellia	Myzomyia	\N	\N	longipalpis	1903	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Theobald)
021aeaa2-fa32-4a1f-9640-3bbd179cd990	Cellia	Neomyzomyia	Rhodesiensis	\N	lounibosi	1987	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Gillies & Coetzee
900dae26-afe7-4c0d-a9cc-4527cb44e4c4	Cellia	Neomyzomyia	Smithii	\N	lovettae	1934	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Evans
ca177d41-5e4b-4582-bfa1-692dd4b7f198	Cellia	Neomyzomyia	Ardensis	\N	machardyi	1930	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Edwards
7a377307-c7a0-4b5a-923b-39dea662e68e	Cellia	Neocellia	\N	\N	maculipalpis	1902	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Giles
6e85a81d-f15f-4498-9014-a621773b861e	Cellia	Neomyzomyia	Ardensis	\N	maliensis	1959	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Bailly-Choumara & Adam
936f4e56-070e-43e4-ac04-a94a5c41ee0e	Cellia	Myzomyia	Marshallii-hancocki	marshallii	marshallii	1903	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Theobald)
903b1cbf-1948-4df2-bcbd-ac51fb45c56c	Cellia	Neomyzomyia	\N	\N	mascarensis	1947	b44ae8d8-55dc-43bb-9235-1632f60c38e6	De Meillon
357345f5-1006-49b5-b00b-4dbdca42fbb2	Cellia	Pyretophorus	\N	gambiae	melas	1903	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Theobald
70bcf7b8-8733-41eb-95e2-8914d9ee853b	Cellia	Pyretophorus	\N	gambiae	merus	1902	b44ae8d8-55dc-43bb-9235-1632f60c38e6	D�nitz
9eea8648-d484-4adb-8e40-1f834f56d62c	Cellia	Neomyzomyia	Ardensis	\N	millecampsi	1960	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Lips
be2720fa-fb37-4faa-a8b5-9faf932aff49	Cellia	Neomyzomyia	Pauliani	\N	milloti	1953	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Grjebine & Lacan
a9f5e034-4286-4ac7-859b-3d428615c4bd	Cellia	Myzomyia	Marshallii-hancocki	\N	mortiauxi	1938	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Edwards
e7df139c-32f8-48ff-928e-520ee7ceddf9	Cellia	Myzomyia	\N	\N	moucheti	1925	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Evans
b09ffd56-169e-4ebd-9a64-b2a308d06604	Cellia	Myzomyia	Marshallii-hancocki	\N	mousinhoi	1940	b44ae8d8-55dc-43bb-9235-1632f60c38e6	de Meillon & Pereira
2feb9011-873c-48dc-8419-0653ac034c68	Cellia	Paramyzomyia	\N	\N	multicolor	1902	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Cambouliu
17dd5942-cd99-4763-921f-64c7a1803918	Cellia	Neomyzomyia	Ardensis	\N	multicinctus	1930	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Edwards
8da656e7-9cb3-487d-b78f-77f48466a7ef	Cellia	Cellia	\N	\N	murphyi	1968	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Gillies & de Meillon
773f7875-6954-4540-82d1-7dedc1ab9165	Anopheles	Myzorhynchus	\N	coustani	namibiensis	1984	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Coetzee
83de37b3-7593-4ad1-96ed-29d96ec6c008	Cellia	Neomyzomyia	Ardensis	\N	natalensis	1907	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Hill & Haydon)
5e339aae-9865-414a-ac51-0c92e6f767d1	Cellia	Neomyzomyia	Ardensis	nili	nili	1904	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Theobald)
10a82bb3-0b0f-44f4-b39f-957ac25dd03f	Cellia	Myzomyia	Marshallii-hancocki	\N	njombiensis	1955	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Peters
bb220b7e-12ad-433c-83c7-c7b99668650b	Cellia	Neomyzomyia	Ranci	\N	notleyi	1949	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Van Someren
4a9c3b3d-2e3a-4db4-92bb-fc0a38a59e8a	Anopheles	Myzorhynchus	\N	\N	obscurus	1905	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Gr�nberg)
675e912f-c608-4847-ac96-d0d20e218ee0	Christya	\N	\N	\N	okuensis	1997	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Brunhes, le Goff & Geoffroy
b3756519-f2b5-4ee7-a415-9f6598d3e685	Cellia	Neomyzomyia	Ardensis	nili	ovengensis	2004	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Awono-Ambene, Kengne, Simard, Antonio-Nkonkjio & Fonteneille
09ec77fa-e224-4b70-97f4-49af25deac22	Anopheles	Myzorhynchus	\N	coustani	paludis	1900	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Theobald
a3a5c00d-63a4-4925-b7d9-51a9ff747726	Cellia	Myzomyia	Funestus	funestus	parensis	1962	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Gillies
085c2d06-cd41-4fb0-998c-d0d015a4bef9	Cellia	Neomyzomyia	Pauliani	\N	pauliani	1953	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Grjebine
29e99a89-db22-45e8-8229-37d1d4fb68a4	Cellia	Cellia	\N	\N	pharoensis	1901	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Theobald
2ea919e8-fee3-4344-8cf2-c65ab7479140	Cellia	Neocellia	\N	\N	pretoriensis	1903	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Theobald)
365b34c7-d025-4d20-af9c-67df16103374	Cellia	Pyretophorus	\N	gambiae	quadriannulatus	1911	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Theobald)
1429d27b-3970-41c8-8ed5-3214ef88634f	Cellia	Neomyzomyia	Pauliani	\N	radama	1943	b44ae8d8-55dc-43bb-9235-1632f60c38e6	de Meillon
20d9310e-f867-4064-8cd5-4cfb69865949	Cellia	Neomyzomyia	Smithii	\N	rageaui	1954	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Mattingly & Adam
185c6280-5594-49b4-ae94-af5df75cea52	Cellia	Neomyzomyia	Ranci	\N	ranci	1953	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Grjebine
b45cbf65-d673-48b6-bc85-8866b3923af0	Cellia	Neomyzomyia	Rhodesiensis	\N	rhodesiensis	1901	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Theobald
8bafb393-a05a-46dc-b093-dc214697a846	Cellia	Myzomyia	Funestus	rivulorum	rivulorum	1935	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Leeson
5d4ea723-38ac-4909-a884-d2151a575f78	Cellia	Myzomyia	Funestus	rivulorum	rivulorum-like	2003	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Cohuet, Simard, Toto, Kengne, Coetzee & Fontenille
279d4e84-a2fa-449a-a700-d1354cf88f90	Cellia	Neomyzomyia	Rhodesiensis	\N	rodhaini	1950	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Leleup & Lips
72109057-a262-4ecf-b580-ea4c3e023da6	Cellia	Neomyzomyia	Ranci	\N	roubaudi	1953	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Grjebine
95ffcd34-3eb0-4e8e-90e6-dde9f6fdbe0a	Cellia	Neomyzomyia	Rhodesiensis	\N	ruarinus	1940	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Edwards
35c37a81-8630-40d2-a144-fdb62e949dac	Cellia	Neocellia	\N	\N	rufipes	1910	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Gough)
0e8758c6-e939-41c1-9ec7-20d849d8af1d	Cellia	Neocellia	\N	\N	salbaii	1958	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Maffi & Coluzzi
b37b11e1-f8ee-4de3-895c-36cf22ad8f2e	Cellia	Myzomyia	\N	\N	schwetzi	1934	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Evans
6538b513-cf9c-494d-b1ff-b8607a07aaf9	Cellia	Paramyzomyia	\N	\N	seretsei	1998	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Abdulla-Khan, Coetzee & Hunt
d3dd0ba9-5ea8-4d4b-b9a9-1fa73334af8a	Cellia	Myzomyia	Demeilloni	\N	sergentii	1907	b44ae8d8-55dc-43bb-9235-1632f60c38e6	(Theobald)
043292c8-9cd1-4e8c-9db1-99f48d2bad26	Cellia	Myzomyia	Marshallii-hancocki	\N	seydeli	1929	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Edwards
1dc89f61-a440-4eb6-9324-9533e463bc56	Cellia	Neomyzomyia	Smithii	\N	smithii	1905	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Theobald
0b0dc49c-9705-4890-a81d-cf772b776a45	Cellia	Neomyzomyia	Ardensis	nili	somalicus	1957	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Rivola & Holstein
1d002b76-0861-4b8b-9a6e-901e64005a01	Cellia	Cellia	\N	\N	squamosus	1901	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Theobald
b3bcd372-2c0f-4bb2-b32c-2d0df3a3dc65	Cellia	Neocellia	\N	\N	stephensi	1901	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Liston
1a7b0300-bf40-42b5-aed2-4fdcfac82a2e	Cellia	Cellia	\N	\N	swahilicus	1964	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Gillies
09832a16-9004-4ab8-aee0-385a6f641d2e	Anopheles	Myzorhynchus	\N	coustani	symesi	1928	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Edwards
b5cdd7fa-eb44-4491-8b77-1cbf79c22f2b	Cellia	Myzomyia	\N	\N	tchekedii	1940	b44ae8d8-55dc-43bb-9235-1632f60c38e6	de Meillon & Leeson
bf0e2bd8-02d6-4393-b737-90e9bf9fe70c	Anopheles	Myzorhynchus	\N	coustani	tenebrosus	1902	b44ae8d8-55dc-43bb-9235-1632f60c38e6	D�nitz
a2671cbd-95c6-41d4-9c86-450985e545e2	Cellia	Myzomyia	Wellcomei	\N	theileri	1912	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Edwards
aef1d30a-fe02-46d4-8f42-e8725a85b3f8	Cellia	Paramyzomyia	\N	\N	turkhudi	1901	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Liston
ce1a2495-fb8a-4b2a-bce8-e27b0b330b05	Cellia	Myzomyia	Funestus	funestus	vaneedeni	1987	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Gillies & Coetzee
4b85a3ab-7d48-41e9-b75e-8b8d86e7b54d	Cellia	Neomyzomyia	Smithii	\N	vanhoofi	1945	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Wanson & Lebied
af8a546a-88c5-4c79-853d-9486cd736b4c	Cellia	Neomyzomyia	Ardensis	\N	vernus	1968	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Gillies & de Meillon
b1b4b806-06d4-4f04-b1a2-f7ba3693ed32	Cellia	Neomyzomyia	Ardensis	\N	vinckei	1942	b44ae8d8-55dc-43bb-9235-1632f60c38e6	De Meillon
a95b3c92-3f06-40f0-b66c-e5da548e16a8	Cellia	Myzomyia	\N	\N	walravensi	1930	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Edwards
43ec7f6e-ac6b-43c5-b9b2-8656e01f883d	Cellia	Myzomyia	Wellcomei	\N	wellcomei	1904	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Theobald
28ec3716-8bc2-4791-af55-2c739e2ed790	Cellia	Neomyzomyia	Smithii	\N	wilsoni	1934	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Evans
c3c0941d-1933-42d2-948e-908686110eaf	Anopheles	Myzorhynchus	\N	coustani	ziemanni	1902	b44ae8d8-55dc-43bb-9235-1632f60c38e6	Gr�nberg
\.


-- Completed on 2022-09-20 14:33:52

--
-- PostgreSQL database dump complete
--

