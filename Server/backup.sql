--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: dashboard
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO dashboard;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: dashboard
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    student_id integer NOT NULL,
    room_id integer NOT NULL,
    start_date timestamp without time zone,
    end_date timestamp without time zone NOT NULL,
    status character varying(50)
);


ALTER TABLE public.bookings OWNER TO dashboard;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: dashboard
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO dashboard;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dashboard
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: hostels; Type: TABLE; Schema: public; Owner: dashboard
--

CREATE TABLE public.hostels (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    location character varying(100) NOT NULL,
    capacity integer NOT NULL
);


ALTER TABLE public.hostels OWNER TO dashboard;

--
-- Name: hostels_id_seq; Type: SEQUENCE; Schema: public; Owner: dashboard
--

CREATE SEQUENCE public.hostels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hostels_id_seq OWNER TO dashboard;

--
-- Name: hostels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dashboard
--

ALTER SEQUENCE public.hostels_id_seq OWNED BY public.hostels.id;


--
-- Name: rooms; Type: TABLE; Schema: public; Owner: dashboard
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    room_number character varying(50) NOT NULL,
    hostel_id integer NOT NULL,
    capacity integer NOT NULL,
    current_occupancy integer
);


ALTER TABLE public.rooms OWNER TO dashboard;

--
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: dashboard
--

CREATE SEQUENCE public.rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rooms_id_seq OWNER TO dashboard;

--
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dashboard
--

ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: dashboard
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: hostels id; Type: DEFAULT; Schema: public; Owner: dashboard
--

ALTER TABLE ONLY public.hostels ALTER COLUMN id SET DEFAULT nextval('public.hostels_id_seq'::regclass);


--
-- Name: rooms id; Type: DEFAULT; Schema: public; Owner: dashboard
--

ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: dashboard
--

COPY public.alembic_version (version_num) FROM stdin;
8c2094d33106
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: dashboard
--

COPY public.bookings (id, student_id, room_id, start_date, end_date, status) FROM stdin;
81	9	1127	2025-05-01 20:58:32.028912	2025-07-30 20:58:32.028915	approved
82	4	1186	2025-05-01 20:58:32.040388	2025-07-30 20:58:32.040421	rejected
83	35	1142	2025-05-01 20:58:32.048795	2025-07-30 20:58:32.048798	approved
84	24	1001	2025-05-01 20:58:32.05405	2025-07-30 20:58:32.054052	rejected
85	40	1196	2025-05-01 20:58:32.058872	2025-07-30 20:58:32.058874	rejected
86	40	1002	2025-05-01 20:58:32.063558	2025-07-30 20:58:32.06356	rejected
87	32	1146	2025-05-01 20:58:32.068164	2025-07-30 20:58:32.068166	pending
88	38	947	2025-05-01 20:58:32.073247	2025-07-30 20:58:32.07325	rejected
89	24	1173	2025-05-01 20:58:32.077843	2025-07-30 20:58:32.077845	rejected
90	11	1099	2025-05-01 20:58:32.082621	2025-07-30 20:58:32.082623	pending
91	19	985	2025-05-01 20:58:32.087749	2025-07-30 20:58:32.087751	pending
92	21	1015	2025-05-01 20:58:32.092714	2025-07-30 20:58:32.092716	rejected
93	41	1212	2025-05-01 20:58:32.097089	2025-07-30 20:58:32.097091	pending
94	50	973	2025-05-01 20:58:32.101299	2025-07-30 20:58:32.101301	approved
95	45	971	2025-05-01 20:58:32.105491	2025-07-30 20:58:32.105493	pending
96	3	1011	2025-05-01 20:58:32.110662	2025-07-30 20:58:32.110665	rejected
97	50	1228	2025-05-01 20:58:32.114934	2025-07-30 20:58:32.114937	approved
98	5	1162	2025-05-01 20:58:32.119136	2025-07-30 20:58:32.119138	rejected
99	29	1172	2025-05-01 20:58:32.123348	2025-07-30 20:58:32.12335	rejected
100	13	1010	2025-05-01 20:58:32.127533	2025-07-30 20:58:32.127535	pending
\.


--
-- Data for Name: hostels; Type: TABLE DATA; Schema: public; Owner: dashboard
--

COPY public.hostels (id, name, location, capacity) FROM stdin;
49	Nyayo 4 Hostel	North Wing	100
50	Beta Hostel	South Wing	80
51	Gamma Hostel	East Wing	120
52	Delta Hostel	West Wing	90
53	Kilimanjaro Hostel	Central Block	110
54	Zeta Hostel	Annex Block	70
55	Eta Hostel	Garden Block	60
56	Nyayo 3 Hostel	Roof Block	50
57	Nyayo 2	Basement Block	40
58	Nyayo 12	Main Block	130
59	Nyayo 5	Upper Block	150
60	Nyandarua Hostel	Lower Block	160
61	Ruenzori Hostel	Side Block	170
62	Abadare Hostel	Back Block	180
63	Aberdare Hostel	Front Block	190
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: dashboard
--

COPY public.rooms (id, room_number, hostel_id, capacity, current_occupancy) FROM stdin;
1187	R-17	61	2	0
1188	R-18	61	3	0
1189	R-19	61	2	0
1190	R-20	61	2	0
1191	A-1	62	2	0
1192	A-2	62	4	0
1193	A-3	62	3	0
1194	A-4	62	3	0
1195	A-5	62	2	0
1197	A-7	62	3	0
1198	A-8	62	4	0
1199	A-9	62	3	0
1200	A-10	62	3	0
1201	A-11	62	4	0
1202	A-12	62	4	0
1203	A-13	62	3	0
1204	A-14	62	2	0
1205	A-15	62	2	0
1206	A-16	62	3	0
1207	A-17	62	4	0
1208	A-18	62	4	0
1209	A-19	62	2	0
1210	A-20	62	2	0
1211	A-1	63	3	0
1213	A-3	63	2	0
1214	A-4	63	4	0
1215	A-5	63	4	0
1216	A-6	63	2	0
1217	A-7	63	3	0
1218	A-8	63	3	0
1219	A-9	63	2	0
1196	A-6	62	2	1
1220	A-10	63	2	0
1221	A-11	63	2	0
1212	A-2	63	4	1
1222	A-12	63	2	0
1228	A-18	63	2	1
1223	A-13	63	3	0
1224	A-14	63	3	0
1225	A-15	63	2	0
1226	A-16	63	4	0
1227	A-17	63	2	0
931	N-1	49	2	0
932	N-2	49	2	0
933	N-3	49	4	0
934	N-4	49	2	0
935	N-5	49	2	0
936	N-6	49	2	0
937	N-7	49	2	0
938	N-8	49	4	0
939	N-9	49	3	0
940	N-10	49	3	0
941	N-11	49	2	0
942	N-12	49	2	0
943	N-13	49	2	0
944	N-14	49	2	0
945	N-15	49	4	0
946	N-16	49	3	0
948	N-18	49	2	0
949	N-19	49	2	0
950	N-20	49	4	0
951	B-1	50	3	0
952	B-2	50	2	0
953	B-3	50	4	0
954	B-4	50	3	0
955	B-5	50	3	0
956	B-6	50	2	0
957	B-7	50	2	0
958	B-8	50	4	0
959	B-9	50	2	0
960	B-10	50	3	0
961	B-11	50	3	0
962	B-12	50	4	0
963	B-13	50	4	0
964	B-14	50	4	0
965	B-15	50	3	0
966	B-16	50	4	0
967	B-17	50	4	0
968	B-18	50	4	0
969	B-19	50	3	0
970	B-20	50	4	0
972	G-2	51	2	0
974	G-4	51	2	0
975	G-5	51	4	0
976	G-6	51	4	0
977	G-7	51	2	0
978	G-8	51	4	0
979	G-9	51	2	0
980	G-10	51	4	0
981	G-11	51	2	0
982	G-12	51	4	0
983	G-13	51	2	0
984	G-14	51	4	0
986	G-16	51	3	0
987	G-17	51	3	0
988	G-18	51	2	0
989	G-19	51	3	0
990	G-20	51	2	0
991	D-1	52	4	0
992	D-2	52	3	0
993	D-3	52	4	0
994	D-4	52	4	0
995	D-5	52	3	0
996	D-6	52	4	0
997	D-7	52	3	0
998	D-8	52	2	0
999	D-9	52	3	0
1000	D-10	52	3	0
1003	D-13	52	2	0
1004	D-14	52	4	0
1005	D-15	52	3	0
1006	D-16	52	4	0
1007	D-17	52	3	0
1008	D-18	52	3	0
1009	D-19	52	3	0
1012	K-2	53	3	0
1013	K-3	53	4	0
1014	K-4	53	4	0
1016	K-6	53	2	0
1017	K-7	53	4	0
1018	K-8	53	3	0
1019	K-9	53	3	0
1020	K-10	53	4	0
1021	K-11	53	2	0
1022	K-12	53	3	0
1023	K-13	53	3	0
1024	K-14	53	2	0
1025	K-15	53	4	0
1026	K-16	53	3	0
1027	K-17	53	2	0
1028	K-18	53	4	0
1029	K-19	53	3	0
1030	K-20	53	4	0
1031	Z-1	54	2	0
1032	Z-2	54	2	0
1033	Z-3	54	2	0
1034	Z-4	54	4	0
1035	Z-5	54	4	0
1036	Z-6	54	3	0
1037	Z-7	54	2	0
1038	Z-8	54	3	0
1039	Z-9	54	4	0
1040	Z-10	54	4	0
1041	Z-11	54	2	0
1042	Z-12	54	3	0
1043	Z-13	54	2	0
1044	Z-14	54	2	0
1045	Z-15	54	2	0
1046	Z-16	54	2	0
1047	Z-17	54	3	0
1048	Z-18	54	4	0
1049	Z-19	54	3	0
1050	Z-20	54	3	0
1051	E-1	55	3	0
1052	E-2	55	4	0
1053	E-3	55	2	0
1054	E-4	55	3	0
1055	E-5	55	4	0
1056	E-6	55	4	0
1057	E-7	55	3	0
1058	E-8	55	2	0
1059	E-9	55	4	0
1060	E-10	55	2	0
1061	E-11	55	4	0
1062	E-12	55	3	0
1063	E-13	55	2	0
1064	E-14	55	4	0
1065	E-15	55	3	0
1066	E-16	55	4	0
1067	E-17	55	3	0
1068	E-18	55	4	0
1069	E-19	55	2	0
1070	E-20	55	3	0
1071	N-1	56	3	0
1072	N-2	56	2	0
1073	N-3	56	4	0
1127	N-17	58	2	1
1074	N-4	56	2	0
1075	N-5	56	4	0
1076	N-6	56	4	0
1077	N-7	56	3	0
1078	N-8	56	3	0
1079	N-9	56	4	0
1080	N-10	56	4	0
1081	N-11	56	2	0
1082	N-12	56	4	0
1083	N-13	56	3	0
1084	N-14	56	2	0
1085	N-15	56	2	0
1086	N-16	56	2	0
1087	N-17	56	4	0
1088	N-18	56	3	0
1089	N-19	56	3	0
1090	N-20	56	3	0
1091	N-1	57	3	0
1092	N-2	57	2	0
1093	N-3	57	3	0
1094	N-4	57	3	0
1095	N-5	57	3	0
1096	N-6	57	2	0
1097	N-7	57	3	0
1098	N-8	57	3	0
1100	N-10	57	4	0
1101	N-11	57	2	0
1102	N-12	57	3	0
1103	N-13	57	4	0
1104	N-14	57	4	0
1105	N-15	57	2	0
1106	N-16	57	2	0
1107	N-17	57	2	0
1108	N-18	57	2	0
1109	N-19	57	4	0
1110	N-20	57	4	0
1111	N-1	58	4	0
1112	N-2	58	4	0
1113	N-3	58	3	0
1114	N-4	58	3	0
1115	N-5	58	4	0
1116	N-6	58	4	0
1117	N-7	58	4	0
1118	N-8	58	3	0
1119	N-9	58	3	0
1120	N-10	58	2	0
1121	N-11	58	4	0
1122	N-12	58	4	0
1123	N-13	58	3	0
1124	N-14	58	3	0
1125	N-15	58	2	0
1126	N-16	58	4	0
1128	N-18	58	4	0
1129	N-19	58	4	0
1130	N-20	58	2	0
1131	N-1	59	4	0
1132	N-2	59	3	0
1133	N-3	59	2	0
1134	N-4	59	2	0
1135	N-5	59	2	0
1136	N-6	59	3	0
1137	N-7	59	4	0
1138	N-8	59	2	0
1139	N-9	59	3	0
1140	N-10	59	4	0
1141	N-11	59	2	0
1143	N-13	59	4	0
1144	N-14	59	2	0
1145	N-15	59	2	0
1147	N-17	59	2	0
1148	N-18	59	3	0
1149	N-19	59	4	0
1150	N-20	59	2	0
1151	N-1	60	2	0
1152	N-2	60	3	0
1153	N-3	60	2	0
1154	N-4	60	4	0
1155	N-5	60	2	0
1156	N-6	60	3	0
1157	N-7	60	4	0
1158	N-8	60	3	0
1159	N-9	60	2	0
1160	N-10	60	2	0
1161	N-11	60	4	0
1163	N-13	60	2	0
1164	N-14	60	2	0
1165	N-15	60	3	0
1166	N-16	60	4	0
1167	N-17	60	4	0
1168	N-18	60	4	0
1169	N-19	60	3	0
1170	N-20	60	2	0
1171	R-1	61	2	0
1174	R-4	61	2	0
1175	R-5	61	4	0
1176	R-6	61	3	0
1177	R-7	61	3	0
1178	R-8	61	3	0
1179	R-9	61	3	0
1180	R-10	61	4	0
1181	R-11	61	3	0
1182	R-12	61	2	0
1183	R-13	61	4	0
1184	R-14	61	2	0
1185	R-15	61	4	0
1186	R-16	61	2	1
1142	N-12	59	2	1
1146	N-16	59	4	1
1173	R-3	61	3	1
1099	N-9	57	4	1
1162	N-12	60	4	1
1172	R-2	61	4	1
1229	A-19	63	3	0
1230	A-20	63	3	0
1001	D-11	52	3	1
1002	D-12	52	4	1
947	N-17	49	3	1
985	G-15	51	4	1
1015	K-5	53	4	1
973	G-3	51	4	1
971	G-1	51	2	1
1011	K-1	53	2	1
1010	D-20	52	3	1
\.


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dashboard
--

SELECT pg_catalog.setval('public.bookings_id_seq', 100, true);


--
-- Name: hostels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dashboard
--

SELECT pg_catalog.setval('public.hostels_id_seq', 63, true);


--
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dashboard
--

SELECT pg_catalog.setval('public.rooms_id_seq', 1230, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: dashboard
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: dashboard
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: hostels hostels_pkey; Type: CONSTRAINT; Schema: public; Owner: dashboard
--

ALTER TABLE ONLY public.hostels
    ADD CONSTRAINT hostels_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: dashboard
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dashboard
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id);


--
-- Name: rooms rooms_hostel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dashboard
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_hostel_id_fkey FOREIGN KEY (hostel_id) REFERENCES public.hostels(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO dashboard;


--
-- PostgreSQL database dump complete
--

