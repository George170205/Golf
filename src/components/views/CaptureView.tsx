import React, { useState, useEffect, useMemo } from 'react';
import { useTournament } from '../../context/TournamentContext';
import {
  Edit3,
  Save,
  CheckCircle2,
  Trophy,
  Filter,
  Calendar,
  RotateCcw,
  Sparkles,
  Award
} from 'lucide-react';
import { Category, RoundResult } from '../../types/tournament';
import { calculateRoundScores, calculateHandicap } from '../../utils/calculations';

interface CaptureViewProps {
  initialRoundId?: string;
}

export const CaptureView: React.FC<CaptureViewProps> = ({ initialRoundId }) => {
  const {
    rounds,
    players,
    teams,
    results,
    pointsRules,
    settings,
    saveBulkResults
  } = useTournament();

  const [selectedRoundId, setSelectedRoundId] = useState<string>(
    initialRoundId || rounds[0]?.id || ''
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  // Local draft state for scores: map of playerId -> { gross, putts, ctp }
  const [draftScores, setDraftScores] = useState<
    Record<string, { gross: string; putts: string; ctp: boolean }>
  >({});

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const categories: Category[] = ['Premiere', 'Elite', 'Advanced'];

  // Initialize draft scores from stored results whenever selected round changes
  useEffect(() => {
    if (!selectedRoundId) return;

    const roundResults = results.filter((r) => r.roundId === selectedRoundId);
    const scoreMap: Record<string, { gross: string; putts: string; ctp: boolean }> = {};

    players.forEach((p) => {
      const existing = roundResults.find((r) => r.playerId === p.id);
      scoreMap[p.id] = {
        gross: existing && existing.gross > 0 ? String(existing.gross) : '',
        putts: existing && existing.putts > 0 ? String(existing.putts) : '',
        ctp: existing ? Boolean(existing.ctp) : false
      };
    });

    setDraftScores(scoreMap);
    setHasUnsavedChanges(false);
  }, [selectedRoundId, results, players]);

  const currentRound = rounds.find((r) => r.id === selectedRoundId);

  // Convert draft scores to temporary RoundResult objects for live auto-calculation
  const liveRoundResults: RoundResult[] = useMemo(() => {
    return Object.entries(draftScores)
      .filter(([_, s]) => Number(s.gross) > 0)
      .map(([playerId, s]) => {
        const player = players.find((p) => p.id === playerId);
        return {
          id: `draft_${playerId}`,
          roundId: selectedRoundId,
          playerId,
          gross: Number(s.gross),
          putts: Number(s.putts) || 0,
          ctp: s.ctp,
          hciSnapshot: player ? player.hci : 15.0
        };
      });
  }, [draftScores, selectedRoundId, players]);

  // Calculate live rankings and points for each category
  const liveScoresByCategory = useMemo(() => {
    const map = new Map<Category, ReturnType<typeof calculateRoundScores>>();
    categories.forEach((cat) => {
      const scores = calculateRoundScores(
        selectedRoundId,
        cat,
        players,
        liveRoundResults,
        pointsRules,
        settings.useHci80,
        settings.tiebreak,
        settings.ctpBonusPoints
      );
      map.set(cat, scores);
    });
    return map;
  }, [selectedRoundId, players, liveRoundResults, pointsRules, settings]);

  // Handle score change in matrix
  const handleScoreChange = (playerId: string, field: 'gross' | 'putts', value: string) => {
    setDraftScores((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleCtpToggle = (playerId: string) => {
    setDraftScores((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        ctp: !prev[playerId]?.ctp
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveAll = () => {
    const scoresToSave = Object.entries(draftScores).map(([playerId, s]) => ({
      playerId,
      gross: Number(s.gross) || 0,
      putts: Number(s.putts) || 0,
      ctp: s.ctp
    }));

    saveBulkResults(selectedRoundId, scoresToSave);
    setHasUnsavedChanges(false);
  };

  const handleClearRoundScores = () => {
    if (
      window.confirm(
        '¿Deseas limpiar todos los scores capturados para esta jornada? Esta acción no se puede deshacer.'
      )
    ) {
      saveBulkResults(selectedRoundId, []);
      setHasUnsavedChanges(false);
    }
  };

  // Filter players for matrix table
  const displayedPlayers = useMemo(() => {
    return players
      .filter((p) => selectedCategory === 'all' || p.category === selectedCategory)
      .sort((a, b) => {
        if (a.category !== b.category) {
          return categories.indexOf(a.category) - categories.indexOf(b.category);
        }
        return a.name.localeCompare(b.name);
      });
  }, [players, selectedCategory]);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h2>Captura de Resultados en Vivo</h2>
          <p>
            Ingresa golpes totales y putts. El handicap aplicado, golpes netos, ranking de categoría y puntos se calculan automáticamente.
          </p>
        </div>

        <div className="header-actions">
          {hasUnsavedChanges && (
            <span
              style={{
                fontSize: '13px',
                color: 'var(--brass)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Cambios pendientes
            </span>
          )}

          <button onClick={handleSaveAll} className="btn btn-gold">
            <Save size={16} />
            <span>Guardar Resultados</span>
          </button>
        </div>
      </div>

      {/* Selectors Toolbar */}
      <div
        className="card"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Round Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--brass)" />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Jornada:</span>
            <select
              value={selectedRoundId}
              onChange={(e) => setSelectedRoundId(e.target.value)}
              style={{
                minHeight: '38px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
                fontWeight: 600
              }}
            >
              {rounds.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} · {r.course} ({r.date})
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <div className="tab-group" style={{ margin: 0 }}>
              <button
                onClick={() => setSelectedCategory('all')}
                className={`tab-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                style={{ minHeight: '32px', padding: '4px 12px', fontSize: '12px' }}
              >
                Todas las Categorías
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`tab-btn ${selectedCategory === c ? 'active' : ''}`}
                  style={{ minHeight: '32px', padding: '4px 12px', fontSize: '12px' }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleClearRoundScores}
          className="btn btn-secondary btn-sm"
          title="Borrar scores capturados para esta jornada"
        >
          <RotateCcw size={14} />
          <span>Limpiar Jornada</span>
        </button>
      </div>

      {/* Podium Ganadores de la Jornada (Excel Block 'GANADORES') */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}
        >
          {categories.map((cat) => {
            const catWinners = liveScoresByCategory.get(cat)?.slice(0, 3) || [];
            return (
              <div
                key={cat}
                className="card"
                style={{
                  padding: '16px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Trophy size={16} color="var(--brass)" />
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>Podium {cat}</span>
                  </div>
                  <span className={`badge badge-${cat}`} style={{ fontSize: '11px', padding: '1px 6px' }}>
                    {cat}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {catWinners.length > 0 ? (
                    catWinners.map((w, wIdx) => (
                      <div
                        key={w.player.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          background: 'var(--bg-surface-elevated)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '13px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            className={`rank-circle rank-${wIdx + 1}`}
                            style={{ width: '22px', height: '22px', fontSize: '12px' }}
                          >
                            {wIdx + 1}
                          </span>
                          <span style={{ fontWeight: 600 }}>{w.player.name}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ color: 'var(--brass)', fontWeight: 700 }}>
                            Neto {w.net}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            ({w.gross} golpes)
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-num)',
                              fontSize: '15px',
                              fontWeight: 700,
                              color: 'var(--text-main)'
                            }}
                          >
                            +{w.points} pts
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                      Sin scores registrados aún.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Scorecard Matrix */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Jugador & Equipo</th>
                <th>Categoría</th>
                <th className="num">HCI Aplicado</th>
                <th style={{ textAlign: 'center', width: '130px' }}>Golpes Totales</th>
                <th style={{ textAlign: 'center', width: '110px' }}>Putts</th>
                <th style={{ textAlign: 'center', width: '90px' }}>CTP Pin</th>
                <th className="num">Golpes Netos</th>
                <th className="num">Posición</th>
                <th className="num" style={{ color: 'var(--brass)' }}>
                  Puntos
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedPlayers.map((player) => {
                const team = teams.find((t) => t.id === player.teamId);
                const draft = draftScores[player.id] || { gross: '', putts: '', ctp: false };

                // Get live calculated score for this player
                const catScores = liveScoresByCategory.get(player.category) || [];
                const liveCalc = catScores.find((s) => s.player.id === player.id);
                const hcApplied = calculateHandicap(player.hci, settings.useHci80);

                return (
                  <tr key={player.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{player.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {team ? team.name : 'Sin equipo'}
                        {player.ghin ? ` · GHIN ${player.ghin}` : ''}
                      </div>
                    </td>

                    <td>
                      <span className={`badge badge-${player.category}`}>{player.category}</span>
                    </td>

                    <td className="num" style={{ fontSize: '15px' }}>
                      {hcApplied}
                      <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>
                        (base {player.hci})
                      </span>
                    </td>

                    {/* Gross Strokes Input */}
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        min="40"
                        max="180"
                        placeholder="–"
                        value={draft.gross}
                        onChange={(e) => handleScoreChange(player.id, 'gross', e.target.value)}
                        style={{
                          width: '84px',
                          minHeight: '36px',
                          textAlign: 'center',
                          fontFamily: 'var(--font-num)',
                          fontSize: '18px',
                          fontWeight: 700,
                          borderRadius: 'var(--radius-sm)',
                          border: '1.5px solid var(--border-subtle)',
                          background: draft.gross ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                          color: draft.gross ? 'var(--text-main)' : 'var(--text-muted)'
                        }}
                      />
                    </td>

                    {/* Putts Input */}
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="number"
                        min="10"
                        max="70"
                        placeholder="–"
                        value={draft.putts}
                        onChange={(e) => handleScoreChange(player.id, 'putts', e.target.value)}
                        style={{
                          width: '74px',
                          minHeight: '36px',
                          textAlign: 'center',
                          fontFamily: 'var(--font-num)',
                          fontSize: '18px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1.5px solid var(--border-subtle)',
                          background: draft.putts ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)'
                        }}
                      />
                    </td>

                    {/* CTP Toggle */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleCtpToggle(player.id)}
                        className={`btn btn-sm ${draft.ctp ? 'btn-gold' : 'btn-secondary'}`}
                        style={{ padding: '4px 10px', fontSize: '11px', minHeight: '32px' }}
                        title="Marcar si ganó Closest To Pin"
                      >
                        {draft.ctp ? 'CTP Ganado' : '–'}
                      </button>
                    </td>

                    {/* Net Calculation */}
                    <td className="num">
                      {liveCalc ? (
                        <b style={{ color: 'var(--brass)', fontSize: '18px' }}>{liveCalc.net}</b>
                      ) : (
                        <span style={{ color: 'var(--text-faint)' }}>–</span>
                      )}
                    </td>

                    {/* Place in Category */}
                    <td className="num">
                      {liveCalc ? (
                        <span
                          className={`rank-circle ${liveCalc.place <= 3 ? `rank-${liveCalc.place}` : ''}`}
                          style={{ width: '28px', height: '28px', fontSize: '14px' }}
                        >
                          {liveCalc.place}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-faint)' }}>–</span>
                      )}
                    </td>

                    {/* Points Assigned */}
                    <td className="num">
                      {liveCalc ? (
                        <b style={{ color: 'var(--fairway-500)', fontSize: '19px' }}>
                          +{liveCalc.points}
                        </b>
                      ) : (
                        <span style={{ color: 'var(--text-faint)' }}>–</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
