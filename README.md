# Sistema de Gestión · Torneo Los Santos Golf 2026/27

Plataforma ejecutiva de alto nivel para la administración integral de torneos de golf, jugadores, escuadras de la Copa LIV, captura de scores en vivo con cálculo automático de handicaps, desempates y puntos, además de analítica visual interactiva.

---

## Características Principales

1. **Gestión Multitorneo**:
   - Crear y alternar entre distintos torneos oficiales o temporadas.
   - Configuración independiente de modalidad de handicap (100% vs 80%) y criterios de desempate.

2. **Roster Completo de Jugadores**:
   - CRUD completo con búsqueda instantánea por nombre o número GHIN.
   - Categorización automática: **Premiere**, **Elite** y **Advanced**.
   - Handicap Index (HCI) con cálculo automático de HCI al 80%.
   - Expediente histórico con desglose de rondas jugadas, promedios y tarjetas individuales.

3. **Copa LIV por Equipos**:
   - Equipos multidisciplinarios (*Beerdie Guys*, *Slicing Ninjas*, *Chapter 11*, *Little Balls*).
   - Acumulado de puntos por jornada y conteo total de golpes gross.
   - Asignación y transferencia dinámica de jugadores.

4. **Calendario de Jornadas**:
   - Registro de fechas y campos sede (*Baja Country Club*, *Real del Mar*, *Club Campestre Tijuana*, *Bajamar Ocean Front*).
   - Seguimiento de estado (*Con resultados*, *En captura*, *Programada*).

5. **Captura de Scores en Tiempo Real**:
   - Matriz de captura rápida de golpes y putts por jugador.
   - Marcador de **Closest to the Pin (CTP)** con bonificación configurable.
   - **Cálculo automático e instantáneo**:
     - Handicap aplicado
     - Golpes Netos (`Gross - Handicap`)
     - Lugar en la categoría con resolución de desempates
     - Puntos asignados según la tabla oficial
   - Bloque interactivo de **Ganadores de la Jornada** (Podium de 1.º, 2.º y 3.er lugar por categoría).

6. **Analítica Visual & Gráficas Interactivas**:
   - **Evolución de Puntos**: Gráfica de líneas con nodos SVG por jugador y jornada.
   - **Comparativa Copa LIV**: Gráfica de barras horizontales con paleta de equipo.
   - **Trofeo Mr. Putt**: Ranking de mejores jugadores en green por menor promedio de putts.
   - **Distribución de Rendimiento**: Comparativa de golpes Netos vs Gross.
   - Métricas de promedios generales del torneo.

7. **Reglamento Configurable**:
   - Tabla interactiva de puntos por posición (Lugar 1 al 18+).
   - Modalidad de handicap (HCI al 80% vs HCI completo).
   - Selector de criterios de desempate (*Menos putts*, *Menor gross*, *Menor handicap*).

8. **Exportación & Respaldos**:
   - Exportación de clasificaciones individuales a archivo CSV compatible con Excel.
   - Exportación de la Copa LIV a CSV.
   - Descarga y restauración de copias de seguridad en formato JSON.
   - Botón de restablecimiento directo a los datos oficiales de la hoja Los Santos 2026/27.

9. **Estética y Experiencia de Usuario**:
   - Diseño estilo *Clubhouse de Campeonato* con paleta Fairway Green y acentos en Oro/Latón noble.
   - Tipografía *Fraunces* y *Barlow*.
   - Modo Oscuro y Modo Claro.
   - **100% libre de emojis**: todos los elementos utilizan iconos vectoriales SVG de alta precisión.

---

## Requisitos Previos

- **Node.js** v18 o superior.
- **npm** v9 o superior.

---

## Ejecución Local

Para iniciar el servidor de desarrollo:

```bash
npm install
npm run dev
```

Abre tu navegador en `http://localhost:5173/`.

---

## Compilación para Producción

Para generar los archivos estáticos listos para desplegar:

```bash
npm run build
```

Los archivos optimizados y minificados se generarán en la carpeta `dist/`.

---

## Despliegue

### 1. Vercel / Netlify / Render
Simplemente conecta el repositorio a tu plataforma preferida con los siguientes parámetros:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2. Docker
El proyecto incluye `Dockerfile`, `nginx.conf` y `docker-compose.yml`:

```bash
docker compose up -d --build
```

La aplicación estará disponible en `http://localhost:8080/`.
