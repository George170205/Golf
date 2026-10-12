import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import {
  Trophy,
  Users,
  Shield,
  Calendar,
  Download,
  Edit3,
  Award,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Category } from '../../types/tournament';
import {
  calculateAllStandings,
  calculateTeamStandings
} from '../../utils/calculations';
import { exportStandingsCsv, exportLivCsv } from '../../utils/exportCsv';
import { TeamStandingsChart } from '../charts/TeamStandingsChart';

interface DashboardViewProps {
  onNavigateToCapture: (roundId?: string) => void;
  onNavigateToAnalytics: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToCapture,
  onNavigateToAnalytics
}) => {
  const {
    activeTournament,
    players,
    teams,
    rounds,
    results,
    pointsRules,
    settings
  } = useTournament();

  const [activeCategory, setActiveCategory] = useState<Category>('Premiere');

  const categories: Category[] = ['Premiere', 'Elite', 'Advanced'];

  // Calculate standings
  const categoryStandings = calculateAllStandings(
    activeCategory,
    players,
    teams,
    rounds,
    results,
    pointsRules,
    settings.useHci80,
    settings.tiebreak,
    settings.ctpBonusPoints
  );

  const livStandings = calculateTeamStandings(
    teams,
    players,
    rounds,
    results,
    pointsRules,
    settings.useHci80,
    settings.tiebreak,
    settings.ctpBonusPoints
  );

  const completedRounds = rounds.filter((r) =>
    results.some((res) => res.roundId === r.id && res.gross > 0)
  );

  const nextRound = rounds.find((r) => r.status !== 'completed') || rounds[0];
  const leaderPlayer = categoryStandings[0]?.totalPoints > 0 ? categoryStandings[0] : null;
  const livLeader = livStandings[0]?.totalPoints > 0 ? livStandings[0] : null;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h2>Panel de Control · {activeTournament.name}</h2>
          <p>
            Clasificación general en vivo, desglose por categoría, Copa LIV y promedios oficiales.
          </p>
        </div>

        <div className="header-actions">
          <button
            onClick={() => exportStandingsCsv(activeCategory, categoryStandings, rounds)}
            className="btn btn-secondary"
          >
            <Download size={16} />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => onNavigateToCapture(nextRound?.id)}
            className="btn btn-gold"
          >
            <Edit3 size={16} />
            <span>Capturar Resultados</span>
          </button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ '--kpi-color': 'var(--brass)' } as any}>
          <div className="kpi-top">
            <span className="kpi-label">Jugadores Totales</span>
            <div className="kpi-icon">
              <Users size={17} />
            </div>
          </div>
          <div className="kpi-value">{players.length}</div>
          <div className="kpi-sub">
            {categories.map((c) => `${players.filter((p) => p.category === c).length} ${c}`).join(' · ')}
          </div>
        </div>

        <div className="kpi-card" style={{ '--kpi-color': '#3E9B66' } as any}>
          <div className="kpi-top">
            <span className="kpi-label">Copa LIV Equipos</span>
            <div className="kpi-icon">
              <Shield size={17} />
            </div>
          </div>
          <div className="kpi-value">{teams.length}</div>
          <div className="kpi-sub">
            Líder: <b style={{ color: 'var(--brass)' }}>{livLeader ? livLeader.team.name : '—'}</b>{' '}
            {livLeader ? `(${livLeader.totalPoints} pts)` : ''}
          </div>
        </div>

        <div className="kpi-card" style={{ '--kpi-color': '#38BDF8' } as any}>
          <div className="kpi-top">
            <span className="kpi-label">Jornadas Oficiales</span>
            <div className="kpi-icon">
              <Calendar size={17} />
            </div>
          </div>
          <div className="kpi-value">
            {completedRounds.length}
            <span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>/{rounds.length}</span>
          </div>
          <div className="kpi-sub">
            {nextRound ? `Próxima: ${nextRound.course} (${nextRound.date})` : 'Temporada concluida'}
          </div>
        </div>

        <div className="kpi-card" style={{ '--kpi-color': 'var(--brass)' } as any}>
          <div className="kpi-top">
            <span className="kpi-label">Líder {activeCategory}</span>
            <div className="kpi-icon">
              <Trophy size={17} />
            </div>
          </div>
          <div className="kpi-value" style={{ fontSize: '28px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {leaderPlayer ? leaderPlayer.player.name : 'Por definir'}
          </div>
          <div className="kpi-sub">
            {leaderPlayer ? `${leaderPlayer.totalPoints} pts · Mejor Neto: ${leaderPlayer.bestNet}` : 'Sin scores capturados'}
          </div>
        </div>
      </div>

      {/* Main Grid: Standings + LIV Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Category Leaderboard */}
        <section className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Award size={20} color="var(--brass)" />
                <span>Clasificación Individual</span>
              </h3>
              <p className="card-subtitle">
                Puntos acumulados por jornada. Criterio de desempate:{' '}
                <b>{settings.tiebreak === 'putts' ? 'Menos Putts' : 'Mejor Neto'}</b>.
              </p>
            </div>

            <button onClick={onNavigateToAnalytics} className="btn btn-secondary btn-sm">
              <TrendingUp size={14} />
              <span>Ver Gráficas</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="tab-group" role="tablist" aria-label="Seleccionar categoría de golf">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`tab-btn ${c === activeCategory ? 'active' : ''}`}
                role="tab"
                aria-selected={c === activeCategory}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background:
                      c === 'Premiere'
                        ? 'var(--brass)'
                        : c === 'Elite'
                        ? 'var(--fairway-500)'
                        : 'var(--adv)'
                  }}
                />
                <span>Categoría {c}</span>
                <span style={{ fontSize: '11px', opacity: 0.8 }}>
                  ({players.filter((p) => p.category === c).length})
                </span>
              </button>
            ))}
          </div>

          {/* Leaderboard Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '48px', textAlign: 'center' }}>#</th>
                  <th>Jugador & Equipo</th>
                  <th className="num">HCI</th>
                  {rounds.map((r) => (
                    <th key={r.id} className="num" title={`${r.name} - ${r.course}`}>
                      {r.shortCourse || r.name}
                    </th>
                  ))}
                  <th className="num" style={{ color: 'var(--brass)' }}>
                    Total Pts
                  </th>
                  <th className="num">Prom. Neto</th>
                </tr>
              </thead>
              <tbody>
                {categoryStandings.length > 0 ? (
                  categoryStandings.map((s, index) => {
                    const isPodium = index < 3 && s.totalPoints > 0;
                    return (
                      <tr key={s.player.id}>
                        <td style={{ textAlign: 'center' }}>
                          <span
                            className={`rank-circle ${
                              isPodium ? `rank-${index + 1}` : ''
                            }`}
                          >
                            {index + 1}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                            {s.player.name}
                            {s.ctpCount > 0 && (
                              <span
                                title={`${s.ctpCount} Closest To Pin ganados`}
                                style={{
                                  marginLeft: '6px',
                                  fontSize: '11px',
                                  padding: '1px 5px',
                                  borderRadius: '4px',
                                  background: 'var(--brass-soft)',
                                  color: 'var(--brass-ink)',
                                  fontWeight: 700
                                }}
                              >
                                CTP ({s.ctpCount})
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {s.team ? s.team.name : 'Sin equipo'}
                            {s.player.ghin ? ` · GHIN: ${s.player.ghin}` : ''}
                          </div>
                        </td>
                        <td className="num" style={{ fontSize: '15px' }}>
                          {s.player.hci}
                        </td>

                        {rounds.map((r) => {
                          const pts = s.pointsByRound[r.id];
                          const net = s.netByRound[r.id];
                          return (
                            <td key={r.id} className="num">
                              {pts !== undefined ? (
                                <div>
                                  <span style={{ fontWeight: 700 }}>{pts}</span>
                                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                                    (neto {net})
                                  </span>
                                </div>
                              ) : (
                                <span style={{ color: 'var(--text-faint)' }}>–</span>
                              )}
                            </td>
                          );
                        })}

                        <td className="num">
                          <b style={{ color: 'var(--brass)', fontSize: '20px' }}>
                            {s.totalPoints}
                          </b>
                        </td>

                        <td className="num" style={{ color: 'var(--text-muted)' }}>
                          {s.roundsPlayed > 0 ? s.avgNet : '–'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5 + rounds.length} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No hay jugadores registrados en la categoría {activeCategory}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Column: LIV Cup Standing Widget & Upcoming Round */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Copa LIV Widget */}
          <section className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Shield size={20} color="var(--fairway-500)" />
                  <span>Copa LIV por Equipos</span>
                </h3>
                <p className="card-subtitle">Suma acumulada de puntos de cada escuadra.</p>
              </div>

              <button onClick={() => exportLivCsv(livStandings)} className="icon-btn" title="Exportar Copa LIV">
                <Download size={16} />
              </button>
            </div>

            <TeamStandingsChart standings={livStandings} />
          </section>

          {/* Calendario de Jornadas Widget */}
          <section className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">
                  <Calendar size={20} color="var(--brass)" />
                  <span>Jornadas del Campeonato</span>
                </h3>
                <p className="card-subtitle">Seguimiento de campos y fechas oficiales.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {rounds.map((round) => {
                const resultsCount = results.filter((r) => r.roundId === round.id && r.gross > 0).length;
                const isDone = round.status === 'completed';

                return (
                  <div
                    key={round.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: 'var(--bg-surface-elevated)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>
                        {round.name} · {round.course}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Fecha: {round.date} · {resultsCount} de {players.length} scores capturados
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${isDone ? 'badge-success' : 'badge-warning'}`}>
                        {isDone ? 'Con resultados' : 'Próxima'}
                      </span>
                      <button
                        onClick={() => onNavigateToCapture(round.id)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px' }}
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
