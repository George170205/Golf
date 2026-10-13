-- =========================================================
-- SISTEMA DE GESTION · TORNEO LOS SANTOS GOLF 2026/27
-- Script oficial DDL + Semilla de PostgreSQL para Supabase o Postgres local
-- =========================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA TORNEOS
CREATE TABLE IF NOT EXISTS tournaments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    season TEXT NOT NULL DEFAULT '2026-2027',
    club TEXT DEFAULT 'Los Santos Golf Club',
    description TEXT,
    use_hci80 BOOLEAN NOT NULL DEFAULT TRUE,
    tiebreak TEXT NOT NULL DEFAULT 'putts',
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA EQUIPOS LIV
CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    tournament_id TEXT REFERENCES tournaments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#1F5A3A',
    captain_id TEXT
);

-- 3. TABLA JUGADORES
CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    tournament_id TEXT REFERENCES tournaments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    ghin TEXT DEFAULT '',
    hci NUMERIC(4, 1) NOT NULL DEFAULT 15.0,
    category TEXT NOT NULL CHECK (category IN ('Premiere', 'Elite', 'Advanced')),
    team_id TEXT REFERENCES teams(id) ON DELETE SET NULL,
    slot INT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA JORNADAS
CREATE TABLE IF NOT EXISTS rounds (
    id TEXT PRIMARY KEY,
    tournament_id TEXT REFERENCES tournaments(id) ON DELETE CASCADE,
    number INT NOT NULL,
    name TEXT NOT NULL,
    course TEXT NOT NULL,
    short_course TEXT NOT NULL DEFAULT '',
    date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    par INT DEFAULT 72
);

-- 5. TABLA RESULTADOS / SCORES
CREATE TABLE IF NOT EXISTS round_results (
    id TEXT PRIMARY KEY,
    round_id TEXT REFERENCES rounds(id) ON DELETE CASCADE,
    player_id TEXT REFERENCES players(id) ON DELETE CASCADE,
    gross INT NOT NULL CHECK (gross BETWEEN 40 AND 200),
    putts INT NOT NULL DEFAULT 0,
    ctp BOOLEAN NOT NULL DEFAULT FALSE,
    hci_snapshot NUMERIC(4, 1) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(round_id, player_id)
);

-- 6. TABLA REGLAS DE PUNTOS
CREATE TABLE IF NOT EXISTS points_rules (
    place INT NOT NULL,
    points INT NOT NULL,
    tournament_id TEXT REFERENCES tournaments(id) ON DELETE CASCADE,
    PRIMARY KEY(tournament_id, place)
);

-- 7. TABLA AJUSTES GENERALES
CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar permisos de lectura y escritura para clientes anonimos en Supabase (o RLS permisivo)
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE round_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todo a anonimos en tournaments" ON tournaments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anonimos en teams" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anonimos en players" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anonimos en rounds" ON rounds FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anonimos en round_results" ON round_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anonimos en points_rules" ON points_rules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anonimos en app_settings" ON app_settings FOR ALL USING (true) WITH CHECK (true);

-- =========================================================
-- CARGA DE DATOS REALES DEL ARCHIVO EXCEL
-- =========================================================

INSERT INTO tournaments (id, name, season, club, description, use_hci80, tiebreak, status)
VALUES ('tour_1', 'Torneo Los Santos 2026/27', '2026-2027', 'Los Santos Golf Club', 'Campeonato Oficial con clasificación individual por categoría (Premiere, Elite, Advanced) y Copa LIV por Equipos.', TRUE, 'putts', 'in_progress')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, use_hci80 = EXCLUDED.use_hci80;

INSERT INTO teams (id, tournament_id, name, color)
VALUES ('t_1', 'tour_1', 'Beerdie Guys', '#1F5A3A')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

INSERT INTO teams (id, tournament_id, name, color)
VALUES ('t_2', 'tour_1', 'Slicing Ninjas', '#B8893B')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

INSERT INTO teams (id, tournament_id, name, color)
VALUES ('t_3', 'tour_1', 'Chapter 11', '#0F4C75')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

INSERT INTO teams (id, tournament_id, name, color)
VALUES ('t_4', 'tour_1', 'Little Balls', '#7E22CE')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_1', 'tour_1', 'Albert Joel Martínez', '2938261', 15.2, 'Premiere', 't_1', 2)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_2', 'tour_1', 'Alberto Diaz', '116210608', 18.2, 'Premiere', 't_1', 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_3', 'tour_1', 'Cesar Nevarez', '11627740', 18.0, 'Premiere', 't_1', 3)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_4', 'tour_1', 'Daniel Cisneros', '13131917', 17.7, 'Premiere', 't_1', 4)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_5', 'tour_1', 'Daniel Martinez', '12312564', 19.8, 'Premiere', 't_2', 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_6', 'tour_1', 'David Martínez', '11523111', 16.7, 'Premiere', 't_2', 2)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_7', 'tour_1', 'Eddie Rodríguez', '11999868', 10.2, 'Premiere', 't_2', 3)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_8', 'tour_1', 'Joe Hernández', '', 8.4, 'Premiere', 't_2', 4)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_9', 'tour_1', 'Jorge Bache', '11493763', 16.2, 'Premiere', 't_3', 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_10', 'tour_1', 'Jorge Ojeda', '13153034', 15.0, 'Premiere', 't_3', 2)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_11', 'tour_1', 'Jose Luis Vazquez', '252880', 6.6, 'Premiere', 't_3', 3)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_12', 'tour_1', 'Luis Pisano', '12118507', 13.6, 'Premiere', 't_3', 4)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_13', 'tour_1', 'Patricio Orozco Loza', '', 16.0, 'Premiere', 't_4', 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_14', 'tour_1', 'Raul Inzunza', '2932828', 15.0, 'Premiere', 't_4', 2)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_15', 'tour_1', 'Rodolfo Sanchez', '', 19.0, 'Premiere', 't_4', 3)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_16', 'tour_1', 'Yasid Lopez', '126612294', 15.8, 'Premiere', 't_4', 4)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_17', 'tour_1', 'Aldo Acuña', '', 24.0, 'Elite', 't_1', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_18', 'tour_1', 'Alfonso Nogueira', '', 23.3, 'Elite', 't_1', 6)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_19', 'tour_1', 'Antonio Sánchez', '12844586', 24.6, 'Elite', 't_1', 7)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_20', 'tour_1', 'Carlos del Rio Sr', '2890167', 20.3, 'Elite', 't_1', 8)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_21', 'tour_1', 'Carlos Figueroa', '12549844', 21.6, 'Elite', 't_1', 9)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_22', 'tour_1', 'Carlos Valencia', '12659830', 22.1, 'Elite', 't_2', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_23', 'tour_1', 'Erick Rodríguez', '12047391', 23.3, 'Elite', 't_2', 7)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_24', 'tour_1', 'Fernando Diez', '11617410', 20.8, 'Elite', 't_2', 8)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_25', 'tour_1', 'Hassan Ali', '', 26.0, 'Elite', 't_2', 9)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_26', 'tour_1', 'Iván Becerra Serrano', '', 23.0, 'Elite', 't_3', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_27', 'tour_1', 'Jorge Mazas', '12690144', 24.9, 'Elite', 't_3', 6)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_28', 'tour_1', 'Julio Brambila', '', 26.0, 'Elite', 't_3', 7)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_29', 'tour_1', 'Marco Carrillo', '', 21.5, 'Elite', 't_3', 8)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_30', 'tour_1', 'Marco Trujillo', '11228110', 26.1, 'Elite', 't_3', 9)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_31', 'tour_1', 'Miguel Camacho', '12114482', 25.7, 'Elite', 't_4', 6)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_32', 'tour_1', 'Pedro Gonzalez', '13093472', 24.1, 'Elite', 't_4', 7)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_33', 'tour_1', 'Rubén Aguayo', '10947502', 20.3, 'Elite', 't_4', 8)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_34', 'tour_1', 'Temoc Ortiz', '', 24.0, 'Elite', 't_2', 6)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_35', 'tour_1', 'Tomás Sánchez', '11910789', 20.7, 'Elite', 't_4', 9)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_36', 'tour_1', 'Ulises Araiza', '12659216', 26.3, 'Elite', 't_4', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_37', 'tour_1', 'Alonso Lopez', '2993335', 27.8, 'Advanced', 't_1', 10)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_38', 'tour_1', 'Arturo Sanchez', '12551319', 27.2, 'Advanced', 't_1', 11)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_39', 'tour_1', 'Carlos del Río Jr', '', 28.0, 'Advanced', 't_1', 12)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_40', 'tour_1', 'David Lau', '13173023', 28.0, 'Advanced', 't_2', 10)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_41', 'tour_1', 'Enrique Sanchez', '13127671', 30.0, 'Advanced', 't_2', 11)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_42', 'tour_1', 'Esteban Fernández', '12833723', 29.1, 'Advanced', 't_2', 12)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_43', 'tour_1', 'Fabrizio Ghidoni', '12662146', 26.8, 'Advanced', 't_3', 10)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_44', 'tour_1', 'Gabriel Haro', '', 27.2, 'Advanced', 't_3', 11)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_45', 'tour_1', 'Juan Vega', '13040185', 35.0, 'Advanced', 't_3', 12)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_46', 'tour_1', 'Mariano Gutiérrez', '13144680', 35.4, 'Advanced', 't_4', 10)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_47', 'tour_1', 'Rafael Cisneros', '12665998', 27.9, 'Advanced', 't_4', 11)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_48', 'tour_1', 'Xavier Vela', '13012447', 29.3, 'Advanced', 't_4', 12)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_49', 'tour_1', 'Jean Paul Dugay', '', 26.0, 'Elite', NULL, NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_50', 'tour_1', 'Sergio Lopez Techalott', '', 28.0, 'Elite', NULL, NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO players (id, tournament_id, name, ghin, hci, category, team_id, slot)
VALUES ('p_51', 'tour_1', 'Jose Valdovinos', '', 19.0, 'Elite', NULL, NULL)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, hci = EXCLUDED.hci, category = EXCLUDED.category, team_id = EXCLUDED.team_id;

INSERT INTO rounds (id, tournament_id, number, name, course, short_course, date, status, par)
VALUES ('r_1', 'tour_1', 1, 'Jornada 1', 'Baja Country Club', 'BCC', '2026-08-16', 'completed', 72)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, course = EXCLUDED.course, status = EXCLUDED.status;

INSERT INTO rounds (id, tournament_id, number, name, course, short_course, date, status, par)
VALUES ('r_2', 'tour_1', 2, 'Jornada 2', 'Real del Mar', 'RDM', '2026-09-20', 'completed', 72)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, course = EXCLUDED.course, status = EXCLUDED.status;

INSERT INTO rounds (id, tournament_id, number, name, course, short_course, date, status, par)
VALUES ('r_3', 'tour_1', 3, 'Jornada 3', 'Club Campestre Tijuana', 'COR', '2026-10-18', 'scheduled', 72)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, course = EXCLUDED.course, status = EXCLUDED.status;

INSERT INTO rounds (id, tournament_id, number, name, course, short_course, date, status, par)
VALUES ('r_4', 'tour_1', 4, 'Jornada 4', 'Bajamar Ocean Front', 'BAJ', '2026-11-15', 'scheduled', 72)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, course = EXCLUDED.course, status = EXCLUDED.status;

INSERT INTO rounds (id, tournament_id, number, name, course, short_course, date, status, par)
VALUES ('r_5', 'tour_1', 5, 'Jornada 5', 'Club Campestre Tijuana', 'COR', '2026-12-13', 'scheduled', 72)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, course = EXCLUDED.course, status = EXCLUDED.status;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_1', 'r_1', 'p_1', 91, 36, TRUE, 15.2)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_16', 'r_1', 'p_16', 98, 33, FALSE, 15.8)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_14', 'r_1', 'p_14', 96, 35, TRUE, 15.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_2', 'r_1', 'p_2', 88, 31, FALSE, 18.2)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_5', 'r_1', 'p_5', 104, 41, FALSE, 19.8)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_7', 'r_1', 'p_7', 93, 36, FALSE, 10.2)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_8', 'r_1', 'p_8', 94, 33, FALSE, 8.4)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_23', 'r_1', 'p_23', 92, 31, TRUE, 23.3)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_19', 'r_1', 'p_19', 94, 37, FALSE, 24.6)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_35', 'r_1', 'p_35', 98, 35, FALSE, 20.7)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_36', 'r_1', 'p_36', 110, 34, FALSE, 26.3)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_22', 'r_1', 'p_22', 94, 36, TRUE, 22.1)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_29', 'r_1', 'p_29', 107, 36, FALSE, 21.5)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_17', 'r_1', 'p_17', 125, 49, FALSE, 24.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_28', 'r_1', 'p_28', 111, 45, FALSE, 26.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_30', 'r_1', 'p_30', 118, 45, FALSE, 26.1)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_27', 'r_1', 'p_27', 118, 36, FALSE, 24.9)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_48', 'r_1', 'p_48', 103, 45, FALSE, 29.3)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_40', 'r_1', 'p_40', 102, 37, FALSE, 28.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_44', 'r_1', 'p_44', 99, 32, TRUE, 27.2)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_47', 'r_1', 'p_47', 100, 38, FALSE, 27.9)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_42', 'r_1', 'p_42', 112, 43, FALSE, 29.1)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_39', 'r_1', 'p_39', 104, 40, FALSE, 28.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_46', 'r_1', 'p_46', 113, 43, TRUE, 35.4)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_38', 'r_1', 'p_38', 116, 39, FALSE, 27.2)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r1_p_45', 'r_1', 'p_45', 127, 42, FALSE, 35.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_25', 'r_2', 'p_25', 90, 33, FALSE, 15.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_48', 'r_2', 'p_48', 99, 40, FALSE, 23.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_31', 'r_2', 'p_31', 98, 31, FALSE, 21.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_20', 'r_2', 'p_20', 94, 38, FALSE, 16.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_23', 'r_2', 'p_23', 97, 40, FALSE, 19.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_33', 'r_2', 'p_33', 95, 32, FALSE, 16.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_35', 'r_2', 'p_35', 96, 36, FALSE, 17.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_1', 'r_2', 'p_1', 92, 38, FALSE, 11.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_40', 'r_2', 'p_40', 103, 39, FALSE, 22.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_16', 'r_2', 'p_16', 95, 33, FALSE, 13.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_42', 'r_2', 'p_42', 105, 39, FALSE, 23.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_32', 'r_2', 'p_32', 102, 37, FALSE, 19.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_3', 'r_2', 'p_3', 98, 35, FALSE, 14.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_13', 'r_2', 'p_13', 98, 44, FALSE, 13.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_15', 'r_2', 'p_15', 100, 35, FALSE, 15.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_19', 'r_2', 'p_19', 104, 33, FALSE, 19.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_37', 'r_2', 'p_37', 108, 34, FALSE, 22.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_14', 'r_2', 'p_14', 100, 42, FALSE, 12.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_41', 'r_2', 'p_41', 112, 44, FALSE, 24.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_6', 'r_2', 'p_6', 102, 38, FALSE, 13.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_5', 'r_2', 'p_5', 105, 40, FALSE, 16.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_38', 'r_2', 'p_38', 112, 35, FALSE, 23.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_47', 'r_2', 'p_47', 114, 38, FALSE, 22.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_44', 'r_2', 'p_44', 115, 40, FALSE, 22.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_26', 'r_2', 'p_26', 114, 36, FALSE, 18.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_36', 'r_2', 'p_36', 122, 40, FALSE, 21.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_49', 'r_2', 'p_49', 116, 45, FALSE, 26.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_50', 'r_2', 'p_50', 120, 44, FALSE, 28.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_9', 'r_2', 'p_9', 115, 41, FALSE, 13.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_18', 'r_2', 'p_18', 128, 45, FALSE, 19.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_10', 'r_2', 'p_10', 130, 39, FALSE, 14.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_34', 'r_2', 'p_34', 141, 46, FALSE, 18.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_17', 'r_2', 'p_17', 141, 45, FALSE, 15.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO round_results (id, round_id, player_id, gross, putts, ctp, hci_snapshot)
VALUES ('res_r2_p_51', 'r_2', 'p_51', 145, 47, FALSE, 19.0)
ON CONFLICT (round_id, player_id) DO UPDATE SET gross = EXCLUDED.gross, putts = EXCLUDED.putts, ctp = EXCLUDED.ctp;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 1, 15)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 2, 13)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 3, 12)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 4, 10)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 5, 9)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 6, 8)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 7, 7)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 8, 6)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 9, 5)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 10, 4)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 11, 3)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 12, 3)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 13, 3)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 14, 3)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 15, 3)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 16, 3)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 17, 3)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO points_rules (tournament_id, place, points)
VALUES ('tour_1', 18, 3)
ON CONFLICT (tournament_id, place) DO UPDATE SET points = EXCLUDED.points;

INSERT INTO app_settings (key, value)
VALUES ('global_config', '{"useHci80": true, "tiebreak": "putts", "ctpBonusPoints": 1, "theme": "dark"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
