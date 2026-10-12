import React, { useState, useMemo } from 'react';
import { useTournament } from '../../context/TournamentContext';
import {
  BarChart3,
  TrendingUp,
  Shield,
  Award,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { Category } from '../../types/tournament';
import {
  calculateAllStandings,
  calculateTeamStandings,
  calculateMrPuttStandings
} from '../../utils/calculations';
import { PointsEvolutionChart } from '../charts/PointsEvolutionChart';
import { TeamStandingsChart } from '../charts/TeamStandingsChart';
import { MrPuttChart } from '../charts/MrPuttChart';
import { ScoreDistributionChart } from '../charts/ScoreDistributionChart';

export const AnalyticsView: React.FC = () => {
  const {
    players,
    teams,
    rounds,
    results,
    pointsRules,
    settings
  } = useTournament();

  const [selectedCategory, setSelectedCategory] = useState<Category>('Premiere');
  const categories: Category[] = ['Premiere', 'Elite', 'Advanced'];

  const categoryStandings = useMemo(() => {
    return calculateAllStandings(
      selectedCategory,
      players,
      teams,
      rounds,
      results,
      pointsRules,
      settings.useHci80,
      settings.tiebreak,
      settings.ctpBonusPoints
    );
  }, [selectedCategory, players, teams, rounds, results, pointsRules, settings]);

  const teamStandings = useMemo(() => {
    return calculateTeamStandings(
      teams,
      players,
      rounds,
      results,
      pointsRules,
      settings.useHci80,
      settings.tiebreak,
      settings.ctpBonusPoints
    );
  }, [teams, players, rounds, results, pointsRules, settings]);

  const mrPuttStandings = useMemo(() => {
    return calculateMrPuttStandings(
      players,
      teams,
      rounds,
      results,
      pointsRules,
      settings.useHci80
    );
  }, [players, teams, rounds, results, pointsRules, settings]);

  // Overall statistics
  const activeResults = results.filter((r) => r.gross > 0);
  const totalGrossStrokes = activeResults.reduce((acc, r) => acc + r.gross, 0);
  const totalPutts = activeResults.reduce((acc, r) => acc + r.putts, 0);

  const avgGrossOverall =
    activeResults.length > 0 ? Math.round((totalGrossStrokes / activeResults.length) * 10) / 10 : 0;
  const avgPuttsOverall =
    activeResults.length > 0 ? Math.round((totalPutts / activeResults.length) * 10) / 10 : 0;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h2>Gráficas & Métricas Avanzadas</h2>
          <p>
            Análisis visual de evolución de puntos por jornada, rendimiento de putts (Mr. Putt) y balance de la Copa LIV.
          </p>
        </div>
      </div>

      {/* Global Average Metrics Grid */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--brass)' } as any}>
          <div className="kpi-top">
            <span className="kpi-label">Promedio Gross del Torneo</span>
            <div className="kpi-icon">
              <Activity size={17} />
            </div>
          </div>
          <div className="kpi-value">{avgGrossOverall || '—'}</div>
          <div className="kpi-sub">Basado en {activeResults.length} rondas disputadas</div>
        </div>

        <div className="kpi-card" style={{ '--kpi-color': '#10B981' } as any}>
          <div className="kpi-top">
            <span className="kpi-label">Promedio General de Putts</span>
            <div className="kpi-icon">
              <Award size={17} />
            </div>
          </div>
          <div className="kpi-value">{avgPuttsOverall || '—'}</div>
          <div className="kpi-sub">Putts promedio por jugador/jornada</div>
        </div>

        <div className="kpi-card" style={{ '--kpi-color': '#38BDF8' } as any}>
          <div className="kpi-top">
            <span className="kpi-label">Mejor Putter (Mr. Putt)</span>
            <div className="kpi-icon">
              <Sparkles size={17} />
            </div>
          </div>
          <div className="kpi-value" style={{ fontSize: '28px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {mrPuttStandings[0]?.player.name || '—'}
          </div>
          <div className="kpi-sub">
            {mrPuttStandings[0] ? `${mrPuttStandings[0].avgPutts} putts/ronda` : 'Sin datos'}
          </div>
        </div>

        <div className="kpi-card" style={{ '--kpi-color': 'var(--fairway-500)' } as any}>
          <div className="kpi-top">
            <span className="kpi-label">Total de Golpes Computados</span>
            <div className="kpi-icon">
              <Layers size={17} />
            </div>
          </div>
          <div className="kpi-value">{totalGrossStrokes.toLocaleString()}</div>
          <div className="kpi-sub">{totalPutts.toLocaleString()} putts registrados</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
        {/* Chart 1: Evolución de Puntos por Jornada */}
        <section className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <TrendingUp size={20} color="var(--brass)" />
                <span>Evolución de Puntos por Jornada</span>
              </h3>
              <p className="card-subtitle">
                Trayectoria de puntos acumulados para los líderes de la categoría.
              </p>
            </div>

            {/* Category Selector Tabs */}
            <div className="tab-group" style={{ margin: 0 }}>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`tab-btn ${c === selectedCategory ? 'active' : ''}`}
                  style={{ minHeight: '30px', padding: '3px 10px', fontSize: '11px' }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <PointsEvolutionChart
            standings={categoryStandings}
            rounds={rounds}
          />
        </section>

        {/* Chart 2: Copa LIV por Equipos */}
        <section className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Shield size={20} color="var(--fairway-500)" />
                <span>Comparativa de la Copa LIV</span>
              </h3>
              <p className="card-subtitle">
                Balance de puntos y total de golpes por escuadra.
              </p>
            </div>
          </div>

          <TeamStandingsChart standings={teamStandings} />
        </section>

        {/* Chart 3: Trofeo Mr. Putt (Promedio de Putts) */}
        <section className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Award size={20} color="#10B981" />
                <span>Premio Mr. Putt · Rendimiento en Green</span>
              </h3>
              <p className="card-subtitle">
                Jugadores con el menor promedio de putts por ronda jugada.
              </p>
            </div>
          </div>

          <MrPuttChart mrPuttStandings={mrPuttStandings} />
        </section>

        {/* Chart 4: Distribución de Golpes Net vs Gross */}
        <section className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <BarChart3 size={20} color="#38BDF8" />
                <span>Distribución Net vs Gross ({selectedCategory})</span>
              </h3>
              <p className="card-subtitle">
                Comparativa entre golpes brutos y golpes con handicap descontado.
              </p>
            </div>
          </div>

          <ScoreDistributionChart standings={categoryStandings} />
        </section>
      </div>
    </div>
  );
};
