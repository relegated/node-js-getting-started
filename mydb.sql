CREATE TABLE user_table (
    id SERIAL PRIMARY KEY NOT NULL
    ,username VARCHAR(255) UNIQUE NOT NULL
    ,password_hash VARCHAR(255)
    ,user_level INTEGER NOT NULL
);

CREATE TABLE sylable_root (
    id SERIAL PRIMARY KEY NOT NULL
    ,sylable_root VARCHAR(4) NOT NULL
    ,level_requirement INTEGER NOT NULL
);

CREATE TABLE symbol_value (
    id SERIAL PRIMARY KEY NOT NULL
    ,sylable_root_id INTEGER REFERENCES sylable_root(id)
    ,romanji VARCHAR(4) NOT NULL
    ,kana_id VARCHAR(10) NOT NULL 
    ,is_katakana BOOL NOT NULL
);

INSERT INTO "public"."sylable_root" ("id", "sylable_root", "level_requirement") VALUES
(1, 'a', 1);
INSERT INTO "public"."sylable_root" ("id", "sylable_root", "level_requirement") VALUES
(2, 'i', 1);
INSERT INTO "public"."sylable_root" ("id", "sylable_root", "level_requirement") VALUES
(3, 'u', 1);
INSERT INTO "public"."sylable_root" ("id", "sylable_root", "level_requirement") VALUES
(4, 'e', 1),
(5, 'o', 1),
(6, 'ka', 2),
(7, 'ki', 2),
(8, 'ku', 2),
(9, 'ke', 2),
(10, 'ko', 2),
(11, 'sa', 3),
(12, 'shi', 3),
(13, 'su', 3),
(14, 'se', 3),
(15, 'so', 3),
(16, 'ta', 4),
(17, 'chi', 4),
(18, 'tsu', 4),
(19, 'te', 4),
(20, 'to', 4),
(21, 'na', 5),
(22, 'ni', 5),
(23, 'nu', 5),
(24, 'ne', 5),
(25, 'no', 5),
(26, 'ha', 6),
(27, 'hi', 6),
(28, 'fu', 6),
(29, 'he', 6),
(30, 'ho', 6),
(31, 'ma', 7),
(32, 'mi', 7),
(33, 'mu', 7),
(34, 'me', 7),
(35, 'mo', 7),
(36, 'ya', 8),
(37, 'yu', 8),
(38, 'yo', 8),
(39, 'wa', 8),
(40, 'wo', 8),
(41, 'n', 8),
(42, 'ra', 9),
(43, 'ri', 9),
(44, 'ru', 9),
(45, 're', 9),
(46, 'ro', 9);

INSERT INTO "public"."symbol_value" ("id", "sylable_root_id", "romanji", "kana_id", "is_katakana") VALUES
(1, 1, 'a', 'a_h.png', 'f');
INSERT INTO "public"."symbol_value" ("id", "sylable_root_id", "romanji", "kana_id", "is_katakana") VALUES
(2, 1, 'a', 'a_k.png', 't');
INSERT INTO "public"."symbol_value" ("id", "sylable_root_id", "romanji", "kana_id", "is_katakana") VALUES
(3, 2, 'i', 'i_h.png', 'f');
INSERT INTO "public"."symbol_value" ("id", "sylable_root_id", "romanji", "kana_id", "is_katakana") VALUES
(4, 2, 'i', 'i_k.png', 't'),
(5, 3, 'u', 'u_h.png', 'f'),
(6, 3, 'u', 'u_k.png', 't'),
(7, 4, 'e', 'e_h.png', 'f'),
(8, 4, 'e', 'e_k.png', 't'),
(9, 5, 'o', 'o_h.png', 'f'),
(10, 5, 'o', 'o_k.png', 't'),
(11, 6, 'ka', 'ka_h.png', 'f'),
(12, 6, 'ka', 'ka_k.png', 't'),
(13, 7, 'ki', 'ki_h.png', 'f'),
(14, 7, 'ki', 'ki_k.png', 't'),
(15, 8, 'ku', 'ku_h.png', 'f'),
(16, 8, 'ku', 'ku_k.png', 't'),
(17, 9, 'ke', 'ke_h.png', 'f'),
(18, 9, 'ke', 'ke_k.png', 't'),
(19, 10, 'ko', 'ko_h.png', 'f'),
(20, 10, 'ko', 'ko_k.png', 't'),
(21, 11, 'sa', 'sa_h.png', 'f'),
(22, 11, 'sa', 'sa_k.png', 't'),
(23, 12, 'shi', 'shi_h.png', 'f'),
(24, 12, 'shi', 'shi_k.png', 't'),
(25, 13, 'su', 'su_h.png', 'f'),
(26, 13, 'su', 'su_k.png', 't'),
(27, 14, 'se', 'se_h.png', 'f'),
(28, 14, 'se', 'se_k.png', 't'),
(29, 15, 'so', 'so_h.png', 'f'),
(30, 15, 'so', 'so_k.png', 't'),
(31, 16, 'ta', 'ta_h.png', 'f'),
(32, 16, 'ta', 'ta_k.png', 't'),
(33, 17, 'chi', 'chi_h.png', 'f'),
(34, 17, 'chi', 'chi_k.png', 't'),
(35, 18, 'tsu', 'tsu_h.png', 'f'),
(36, 18, 'tsu', 'tsu_k.png', 't'),
(37, 19, 'te', 'te_h.png', 'f'),
(38, 19, 'te', 'te_k.png', 't'),
(39, 20, 'to', 'to_h.png', 'f'),
(40, 20, 'to', 'to_k.png', 't'),
(41, 21, 'na', 'na_h.png', 'f'),
(42, 21, 'na', 'na_k.png', 't'),
(43, 22, 'ni', 'ni_h.png', 'f'),
(44, 22, 'ni', 'ni_k.png', 't'),
(45, 23, 'nu', 'nu_h.png', 'f'),
(46, 23, 'nu', 'nu_k.png', 't'),
(47, 24, 'ne', 'ne_h.png', 'f'),
(48, 24, 'ne', 'ne_k.png', 't'),
(49, 25, 'no', 'no_h.png', 'f'),
(50, 25, 'no', 'no_k.png', 't'),
(51, 26, 'ha', 'ha_h.png', 'f'),
(52, 26, 'ha', 'ha_k.png', 't'),
(53, 27, 'hi', 'hi_h.png', 'f'),
(54, 27, 'hi', 'hi_k.png', 't'),
(55, 28, 'fu', 'fu_h.png', 'f'),
(56, 28, 'fu', 'fu_k.png', 't'),
(57, 29, 'he', 'he_h.png', 'f'),
(58, 29, 'he', 'he_k.png', 't'),
(59, 30, 'ho', 'ho_h.png', 'f'),
(60, 30, 'ho', 'ho_k.png', 't'),
(61, 31, 'ma', 'ma_h.png', 'f'),
(62, 31, 'ma', 'ma_k.png', 't'),
(63, 32, 'mi', 'mi_h.png', 'f'),
(64, 32, 'mi', 'mi_k.png', 't'),
(65, 33, 'mu', 'mu_h.png', 'f'),
(66, 33, 'mu', 'mu_k.png', 't'),
(67, 34, 'me', 'me_h.png', 'f'),
(68, 34, 'me', 'me_k.png', 't'),
(69, 35, 'mo', 'mo_h.png', 'f'),
(70, 35, 'mo', 'mo_k.png', 't'),
(71, 36, 'ya', 'ya_h.png', 'f'),
(72, 36, 'ya', 'ya_k.png', 't'),
(73, 37, 'yu', 'yu_h.png', 'f'),
(74, 37, 'yu', 'yu_k.png', 't'),
(75, 38, 'yo', 'yo_h.png', 'f'),
(76, 38, 'yo', 'yo_k.png', 't'),
(77, 39, 'wa', 'wa_h.png', 'f'),
(78, 39, 'wa', 'wa_k.png', 't'),
(79, 40, 'wo', 'wo_h.png', 'f'),
(80, 40, 'wo', 'wo_k.png', 't'),
(81, 41, 'n', 'n_h.png', 'f'),
(82, 41, 'n', 'n_k.png', 't'),
(83, 42, 'ra', 'ra_h.png', 'f'),
(84, 42, 'ra', 'ra_k.png', 't'),
(85, 43, 'ri', 'ri_h.png', 'f'),
(86, 43, 'ri', 'ri_k.png', 't'),
(87, 44, 'ru', 'ru_h.png', 'f'),
(88, 44, 'ru', 'ru_k.png', 't'),
(89, 45, 're', 're_h.png', 'f'),
(90, 45, 're', 're_k.png', 't'),
(91, 46, 'ro', 'ro_h.png', 'f'),
(92, 46, 'ro', 'ro_k.png', 't');