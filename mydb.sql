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
    ,kana_id INTEGER NOT NULL 
);