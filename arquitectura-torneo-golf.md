# Sistema de gestión · Torneo Los Santos 2026/27

Documento de diseño técnico: lógica de negocio, modelo de datos, API y stack propuesto.
Base: la hoja de Drive *"Copy of LOS SANTOS_2026_27 TOURNAMENT"*.

> **Supuestos a confirmar con el organizador.** Leí la estructura de la hoja (pestañas, columnas, ejemplos), pero no pude ver completas las fórmulas ni la pestaña `REGLA_PUNTOS`. Todo lo marcado con ⚠️ es un supuesto razonable que debe validarse antes de programar.

---

## 1. Qué contiene la hoja hoy (y a qué se convierte)

| Pestaña de la hoja | Qué es | Pasa a ser en el sistema |
|---|---|---|
| `BD_PRINCIPAL` | Jugador, GHIN, HCI, HCI al 80%, categoría | Tabla `players` |
| `LIV 2026-27` | 4 equipos con jugadores numerados y su categoría | Tablas `teams` + `team_members` |
| `Premiere`, `Elite`, `Advanced` | Tabla por categoría: golpes, putts, puntos, CTP y desglose por jornada | **Vista calculada** (no se captura, se deriva) |
| `J1_BCC_16_AGO`, `J2_RDM_20_SEP`, `J3_COR_18_OCT` | Captura de una jornada: total, HC, neto, putts, categoría, puntos, LIV, ganadores | Tablas `rounds` + `round_results` |
| `RESULTADOS GLOBALES` / `B_RESULTADOS GLOBALES` | Acumulado general | **Vista calculada** (`standings`) |
| `REGLA_PUNTOS` | Tabla de puntos por lugar | Tabla `points_rules` (editable desde la UI) |
| `MR PUTT 2026-27` | Premio de mejor putter por jornada | Vista calculada sobre `putts` ⚠️ |

**Idea clave:** hoy la hoja mezcla *datos capturados* y *datos calculados*. El sistema captura solo lo primero (golpes, putts, CTP) y calcula todo lo demás. Así desaparecen los errores por fórmulas rotas o copiadas a mano.

---

## 2. Reglas de negocio

### 2.1 Handicap y neto
- `HCI al 80%` = `round(HCI × 0.8)` (ejemplo de la hoja: 15 → 12).
- `Neto` = `Golpes totales − Handicap aplicado`.
- ⚠️ En la jornada 2 de la hoja aparece HC 15 con neto 75 sobre 90 golpes, o sea **HCI completo**. La columna "HCI al 80%" probablemente se usa en otra modalidad (¿LIV?). Por eso el sistema tiene un interruptor configurable en vez de fijarlo en código.

### 2.2 Puntos por jornada
1. Se agrupa por **categoría** (Premiere, Elite, Advanced).
2. Se ordena por **neto ascendente**; desempate por **menos putts** ⚠️.
3. Los puntos salen de `points_rules` según el lugar (1.º, 2.º, …).
4. Si la hoja da puntos extra por CTP (Closest To Pin), se suman aparte ⚠️.

### 2.3 Clasificación general
- `Total = Σ puntos de todas las jornadas` por jugador y categoría.
- Desempate: mejor neto individual del torneo ⚠️.

### 2.4 Copa LIV (equipos)
- `Puntos de equipo = Σ puntos de sus integrantes` ⚠️ (la hoja tiene columna LIV en cada jornada, hay que confirmar si cuentan todos o los mejores N).

### 2.5 Reglas que deben ser configurables (no hardcodear)
Puntos por lugar · handicap aplicado (100% / 80%) · criterio de desempate · número de jornadas que cuentan · puntos de CTP.

---

## 3. Modelo de datos (PostgreSQL)

```sql
CREATE TYPE category AS ENUM ('Premiere','Elite','Advanced');
CREATE TYPE user_role AS ENUM ('admin','capturista','lector');

CREATE TABLE tournaments (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,                 -- 'Los Santos 2026/27'
  use_hci80   BOOLEAN NOT NULL DEFAULT FALSE,
  tiebreak    TEXT NOT NULL DEFAULT 'putts'
);

CREATE TABLE players (
  id            SERIAL PRIMARY KEY,
  tournament_id INT REFERENCES tournaments(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  ghin          TEXT,
  hci           NUMERIC(4,1) NOT NULL CHECK (hci BETWEEN 0 AND 54),
  category      category NOT NULL,
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (tournament_id, ghin)
);

CREATE TABLE teams (
  id            SERIAL PRIMARY KEY,
  tournament_id INT REFERENCES tournaments(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  UNIQUE (tournament_id, name)
);

CREATE TABLE team_members (
  team_id   INT REFERENCES teams(id) ON DELETE CASCADE,
  player_id INT REFERENCES players(id) ON DELETE CASCADE,
  slot      SMALLINT,                        -- columna "#" de la hoja
  PRIMARY KEY (team_id, player_id)
);

CREATE TABLE rounds (
  id            SERIAL PRIMARY KEY,
  tournament_id INT REFERENCES tournaments(id) ON DELETE CASCADE,
  number        SMALLINT NOT NULL,           -- Jornada 1, 2, 3…
  course        TEXT NOT NULL,               -- BCC, RDM, COR
  played_on     DATE NOT NULL,
  UNIQUE (tournament_id, number)
);

CREATE TABLE round_results (
  id         SERIAL PRIMARY KEY,
  round_id   INT REFERENCES rounds(id) ON DELETE CASCADE,
  player_id  INT REFERENCES players(id) ON DELETE CASCADE,
  gross      SMALLINT CHECK (gross BETWEEN 40 AND 200),
  putts      SMALLINT CHECK (putts BETWEEN 10 AND 80),
  hci_snapshot NUMERIC(4,1) NOT NULL,        -- HCI vigente ese día
  ctp        BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by INT, updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (round_id, player_id)
);

CREATE TABLE points_rules (
  tournament_id INT REFERENCES tournaments(id) ON DELETE CASCADE,
  place         SMALLINT,
  points        SMALLINT NOT NULL,
  PRIMARY KEY (tournament_id, place)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, role user_role NOT NULL DEFAULT 'lector'
);

CREATE TABLE audit_log (               -- quién cambió qué y cuándo
  id BIGSERIAL PRIMARY KEY, user_id INT, entity TEXT, entity_id INT,
  action TEXT, diff JSONB, at TIMESTAMPTZ DEFAULT now()
);
```

**Decisiones importantes**
- `hci_snapshot`: el handicap cambia durante la temporada. Guardar el HCI usado en cada jornada evita que un cambio posterior reescriba resultados viejos.
- **Puntos y neto no se guardan**: se calculan (vista SQL o servicio). Si cambian las reglas, todo se recalcula solo.
- `audit_log`: en un torneo con premios, saber quién modificó un score es importante.

### Cálculo en SQL (vista)

```sql
CREATE VIEW v_round_ranking AS
SELECT rr.round_id, p.id AS player_id, p.category,
       rr.gross - CASE WHEN t.use_hci80 THEN ROUND(rr.hci_snapshot*0.8)
                       ELSE rr.hci_snapshot END AS net,
       rr.putts,
       RANK() OVER (
         PARTITION BY rr.round_id, p.category
         ORDER BY (rr.gross - CASE WHEN t.use_hci80 THEN ROUND(rr.hci_snapshot*0.8)
                                   ELSE rr.hci_snapshot END), rr.putts
       ) AS place
FROM round_results rr
JOIN players p ON p.id = rr.player_id
JOIN rounds r  ON r.id = rr.round_id
JOIN tournaments t ON t.id = r.tournament_id
WHERE rr.gross IS NOT NULL;
-- puntos = JOIN points_rules ON place; total = SUM(points) GROUP BY player_id
```

---

## 4. Stack propuesto

### Recomendación principal (equilibrio entre moderno y mantenible)

| Capa | Tecnología | Por qué |
|---|---|---|
| **Frontend** | React + Vite + TypeScript | Estándar, muchísima documentación, rápido de iterar |
| UI | Tailwind CSS + shadcn/ui | Componentes accesibles (diálogos, tablas, formularios) sin diseñar desde cero |
| Datos en cliente | TanStack Query + TanStack Table | Caché, recarga automática, tablas ordenables/filtrables |
| Formularios | React Hook Form + Zod | Validación idéntica en front y back |
| Gráficas | Recharts | Barras/líneas de evolución por jornada |
| **Backend** | Node.js + **Fastify** (o NestJS si prefieres estructura estricta) + TypeScript | Mismo lenguaje que el front, tipos compartidos |
| ORM | **Prisma** (o Drizzle) | Migraciones y tipos automáticos |
| **Base de datos** | **PostgreSQL** | Relacional, window functions (`RANK`) ideales para clasificaciones |
| Auth | JWT en cookie httpOnly + roles (`admin`, `capturista`, `lector`) | Capturar solo para quien debe; consulta pública opcional |
| Validación | Zod compartido | Una sola fuente de verdad |
| Pruebas | Vitest (lógica de puntos) + Playwright (flujo de captura) | El cálculo de puntos es lo crítico: debe tener pruebas |

### Alternativa más simple (si quieres menos piezas)
**Next.js (full-stack) + Prisma + PostgreSQL**: un solo proyecto, sin API separada. Menos configuración, ideal para un torneo de una sola liga.

### Alternativa "sin servidor" (para salir rápido)
**Supabase** (Postgres + Auth + API automática) + el mismo frontend React. Pierdes control fino, ganas velocidad.

### Despliegue
- **Docker Compose** (`web`, `api`, `postgres`) → corre igual en tu homelab o en un VPS.
- Hosting gestionado: Vercel/Netlify (front) + Render/Fly.io (API) + Neon/Supabase (BD).
- Respaldo diario de Postgres (`pg_dump` a un bucket o a Drive).
- HTTPS obligatorio; contraseñas con Argon2/bcrypt.

---

## 5. API (REST)

```
POST   /auth/login                 GET  /auth/me
GET    /players        POST /players        PATCH /players/:id     DELETE /players/:id
GET    /teams          POST /teams          PATCH /teams/:id       DELETE /teams/:id
PUT    /teams/:id/members          (asignar jugadores)
GET    /rounds         POST /rounds         PATCH /rounds/:id      DELETE /rounds/:id
GET    /rounds/:id/results         PUT  /rounds/:id/results/:playerId   (captura)
GET    /standings?category=Elite   (clasificación individual)
GET    /standings/teams            (Copa LIV)
GET    /rounds/:id/ranking         (neto, lugar y puntos de la jornada)
GET    /rules          PUT  /rules (puntos, handicap, desempate)
POST   /import/sheet               (carga inicial desde Google Sheets / CSV)
GET    /export/standings.csv
```

Permisos: `lector` solo GET · `capturista` puede `PUT results` · `admin` todo.

---

## 6. Pantallas (ya prototipadas en el HTML)

1. **Resumen** – KPIs, clasificación por categoría, Copa LIV, exportar CSV.
2. **Jugadores** – CRUD con búsqueda y filtro; HCI al 80% automático.
3. **Equipos LIV** – CRUD y vista de integrantes.
4. **Jornadas** – calendario con estado (Próxima / Con resultados / Sin capturar).
5. **Captura** – tabla editable; neto, lugar y puntos al instante.
6. **Reglas** – tabla de puntos y modo de handicap.

Mejoras para la versión real: vista pública de solo lectura para los jugadores (proyectable en el club), modo oscuro, historial de cambios por score, vista de ganadores por jornada (la hoja ya tiene el bloque "GANADORES").

---

## 7. Diseño visual

- **Concepto:** campo de golf de club. Verde *fairway* profundo, papel crema y detalles latón/dorado (trofeos, primeros lugares).
- **Paleta**

| Token | Hex | Uso |
|---|---|---|
| `fairway-900` | `#0F2A1D` | Barra lateral, texto de énfasis |
| `fairway-700` | `#1F5A3A` | Botón primario |
| `brass` | `#B8893B` | Acento, 1.er lugar, CTA secundario |
| `paper` | `#F6F3EA` | Fondo |
| `ink` | `#14201A` | Texto |
| Premiere / Elite / Advanced | dorado / verde / azul + **texto en la etiqueta** | Categorías (nunca solo por color) |

- **Tipografía:** *Fraunces* (títulos, carácter de club) + *Barlow* (interfaz) + *Barlow Condensed* (números y puntos, cifras tabulares).
- **Accesibilidad:** contraste ≥ 4.5:1, foco visible, objetivos táctiles ≥ 44 px, `prefers-reduced-motion`, etiquetas en todos los campos, navegación inferior en móvil.

---

## 8. Plan por fases

| Fase | Entregable | Tiempo orientativo |
|---|---|---|
| 0 | Confirmar reglas ⚠️ (puntos, desempate, LIV, CTP, MR Putt) | 1–2 días |
| 1 | BD + importación de la hoja + CRUD jugadores/equipos/jornadas | 1 semana |
| 2 | Captura de resultados + cálculo de puntos con pruebas | 1 semana |
| 3 | Clasificaciones, Copa LIV, exportación | 3–4 días |
| 4 | Auth y roles, auditoría, vista pública | 3–4 días |
| 5 | Despliegue, respaldos, capacitación al organizador | 2–3 días |

**Riesgo principal:** que las reglas reales (puntos, desempates, LIV) difieran de lo supuesto. Por eso se configuran en BD y se prueban con los resultados reales de las jornadas 1 y 2: el sistema debe reproducir exactamente los totales que hoy da la hoja.

---

## 9. Migración desde la hoja

1. Exportar `BD_PRINCIPAL`, `LIV 2026-27` y las jornadas a CSV.
2. Script de importación (Node o Python) con validación y reporte de filas rechazadas.
3. Cargar jornadas 1 y 2 y **comparar totales** contra `RESULTADOS GLOBALES`.
4. Solo cuando coincidan, dejar de capturar en la hoja.
