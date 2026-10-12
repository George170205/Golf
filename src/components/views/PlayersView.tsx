import React, { useState, useMemo } from 'react';
import { useTournament } from '../../context/TournamentContext';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Award,
  Shield,
  Activity,
  Check
} from 'lucide-react';
import { Player, Category } from '../../types/tournament';
import { Modal } from '../common/Modal';
import { calculateHandicap } from '../../utils/calculations';

export const PlayersView: React.FC = () => {
  const {
    players,
    teams,
    rounds,
    results,
    settings,
    createPlayer,
    updatePlayer,
    deletePlayer
  } = useTournament();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [viewingPlayer, setViewingPlayer] = useState<Player | null>(null);

  // Form fields state
  const [formData, setFormData] = useState({
    name: '',
    ghin: '',
    hci: 15.0,
    category: 'Premiere' as Category,
    teamId: '',
    slot: 1
  });

  const categories: Category[] = ['Premiere', 'Elite', 'Advanced'];

  // Filtered players
  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ghin.includes(searchQuery);
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;
      const matchesTeam =
        selectedTeam === 'all' ||
        (selectedTeam === 'none' ? !p.teamId : p.teamId === selectedTeam);

      return matchesSearch && matchesCategory && matchesTeam;
    });
  }, [players, searchQuery, selectedCategory, selectedTeam]);

  const handleOpenCreateModal = () => {
    setEditingPlayer(null);
    setFormData({
      name: '',
      ghin: '',
      hci: 15.0,
      category: 'Premiere',
      teamId: '',
      slot: 1
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      ghin: player.ghin,
      hci: player.hci,
      category: player.category,
      teamId: player.teamId || '',
      slot: player.slot || 1
    });
    setIsFormModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingPlayer) {
      updatePlayer(editingPlayer.id, {
        name: formData.name.trim(),
        ghin: formData.ghin.trim(),
        hci: Number(formData.hci),
        category: formData.category,
        teamId: formData.teamId ? formData.teamId : null,
        slot: Number(formData.slot)
      });
    } else {
      createPlayer({
        name: formData.name.trim(),
        ghin: formData.ghin.trim(),
        hci: Number(formData.hci),
        category: formData.category,
        teamId: formData.teamId ? formData.teamId : null,
        slot: Number(formData.slot)
      });
    }
    setIsFormModalOpen(false);
  };

  const handleDeletePlayer = (player: Player) => {
    if (
      window.confirm(
        `¿Eliminar definitivamente a ${player.name}? Se borrarán también sus scores registrados.`
      )
    ) {
      deletePlayer(player.id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h2>Roster Oficial de Jugadores</h2>
          <p>
            Administración de golfistas, handicap índice (HCI), categoría y asignación a escuadras LIV.
          </p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn btn-gold">
          <Plus size={16} />
          <span>Nuevo Jugador</span>
        </button>
      </div>

      {/* Toolbar: Search & Filters */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '220px', maxWidth: '360px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o número GHIN..."
            style={{
              paddingLeft: '36px',
              width: '100%',
              minHeight: '40px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)'
            }}
          />
        </div>

        {/* Filter Category */}
        <div style={{ minWidth: '170px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              minHeight: '40px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              padding: '0 12px'
            }}
          >
            <option value="all">Todas las Categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                Categoría {c}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Team */}
        <div style={{ minWidth: '170px' }}>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            style={{
              width: '100%',
              minHeight: '40px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              padding: '0 12px'
            }}
          >
            <option value="all">Todos los Equipos LIV</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
            <option value="none">Sin Equipo</option>
          </select>
        </div>

        <div style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-muted)' }}>
          Mostrando <b>{filteredPlayers.length}</b> de {players.length} jugadores
        </div>
      </div>

      {/* Players Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Jugador</th>
                <th>Número GHIN</th>
                <th className="num">HCI Base</th>
                <th className="num" style={{ color: 'var(--brass)' }}>
                  HCI al 80%
                </th>
                <th>Categoría</th>
                <th>Equipo LIV</th>
                <th style={{ textAlign: 'center' }}>Rondas</th>
                <th style={{ textAlign: 'right', paddingRight: '20px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((p) => {
                  const team = teams.find((t) => t.id === p.teamId);
                  const hci80 = calculateHandicap(p.hci, true);
                  const roundsCount = results.filter((r) => r.playerId === p.id && r.gross > 0).length;

                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-num)', fontSize: '15px' }}>
                        {p.ghin || '—'}
                      </td>
                      <td className="num">{p.hci}</td>
                      <td className="num" style={{ color: 'var(--brass)', fontWeight: 700 }}>
                        {hci80}
                      </td>
                      <td>
                        <span className={`badge badge-${p.category}`}>{p.category}</span>
                      </td>
                      <td>
                        {team ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: team.color || 'var(--fairway-600)'
                              }}
                            />
                            <span style={{ fontSize: '13px' }}>{team.name}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-faint)', fontSize: '12px' }}>Sin equipo</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge badge-muted">{roundsCount} jugadas</span>
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap', paddingRight: '20px' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => setViewingPlayer(p)}
                            className="icon-btn"
                            title="Ver tarjeta histórica y promedios"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="icon-btn"
                            title="Editar jugador"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeletePlayer(p)}
                            className="icon-btn danger"
                            title="Eliminar jugador"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No se encontraron jugadores que coincidan con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Formulario Crear / Editar Jugador */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingPlayer ? 'Editar Jugador' : 'Nuevo Jugador'}
        subtitle="Ingresa la información oficial de GHIN y handicap para el torneo."
      >
        <form onSubmit={handleSubmitForm}>
          <div className="form-group">
            <label htmlFor="p-name">Nombre Completo del Jugador *</label>
            <input
              id="p-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. Alberto Martínez"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="p-ghin">Número GHIN</label>
              <input
                id="p-ghin"
                type="text"
                value={formData.ghin}
                onChange={(e) => setFormData({ ...formData, ghin: e.target.value })}
                placeholder="Ej. 2938261"
              />
            </div>

            <div className="form-group">
              <label htmlFor="p-hci">Handicap Index (HCI) *</label>
              <input
                id="p-hci"
                type="number"
                step="0.1"
                min="0"
                max="54"
                required
                value={formData.hci}
                onChange={(e) => setFormData({ ...formData, hci: parseFloat(e.target.value) || 0 })}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                HCI al 80% estimado: <b>{calculateHandicap(formData.hci, true)}</b>
              </span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="p-cat">Categoría *</label>
              <select
                id="p-cat"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="p-team">Equipo LIV</label>
              <select
                id="p-team"
                value={formData.teamId}
                onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
              >
                <option value="">Sin equipo asignado</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-gold">
              {editingPlayer ? 'Actualizar Jugador' : 'Guardar Jugador'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Vista de Tarjeta Histórica del Jugador */}
      {viewingPlayer && (
        <Modal
          isOpen={Boolean(viewingPlayer)}
          onClose={() => setViewingPlayer(null)}
          title={`Expediente: ${viewingPlayer.name}`}
          subtitle={`Categoría ${viewingPlayer.category} · HCI Base: ${viewingPlayer.hci}`}
          maxWidth="640px"
        >
          {(() => {
            const playerScores = results.filter((r) => r.playerId === viewingPlayer.id && r.gross > 0);
            const team = teams.find((t) => t.id === viewingPlayer.teamId);

            const totalGross = playerScores.reduce((acc, s) => acc + s.gross, 0);
            const totalPutts = playerScores.reduce((acc, s) => acc + s.putts, 0);
            const avgGross = playerScores.length > 0 ? Math.round((totalGross / playerScores.length) * 10) / 10 : 0;
            const avgPutts = playerScores.length > 0 ? Math.round((totalPutts / playerScores.length) * 10) / 10 : 0;

            return (
              <div>
                {/* Stats Header */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ padding: '10px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>HCI 80%</span>
                    <div style={{ fontFamily: 'var(--font-num)', fontSize: '24px', fontWeight: 700, color: 'var(--brass)' }}>
                      {calculateHandicap(viewingPlayer.hci, true)}
                    </div>
                  </div>

                  <div style={{ padding: '10px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Jornadas</span>
                    <div style={{ fontFamily: 'var(--font-num)', fontSize: '24px', fontWeight: 700 }}>
                      {playerScores.length}
                    </div>
                  </div>

                  <div style={{ padding: '10px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Prom. Gross</span>
                    <div style={{ fontFamily: 'var(--font-num)', fontSize: '24px', fontWeight: 700 }}>
                      {avgGross || '—'}
                    </div>
                  </div>

                  <div style={{ padding: '10px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Prom. Putts</span>
                    <div style={{ fontFamily: 'var(--font-num)', fontSize: '24px', fontWeight: 700, color: '#10B981' }}>
                      {avgPutts || '—'}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  Equipo LIV: <b style={{ color: 'var(--text-main)' }}>{team ? team.name : 'Sin equipo'}</b> · GHIN: <b style={{ color: 'var(--text-main)' }}>{viewingPlayer.ghin || 'No asignado'}</b>
                </div>

                {/* Scorecards Table */}
                <h4 style={{ fontSize: '15px', marginBottom: '8px' }}>Historial de Jornadas Disputadas</h4>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Jornada / Campo</th>
                        <th className="num">Golpes Gross</th>
                        <th className="num">HC Aplicado</th>
                        <th className="num">Golpes Netos</th>
                        <th className="num">Putts</th>
                        <th className="num">CTP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {playerScores.length > 0 ? (
                        playerScores.map((s) => {
                          const round = rounds.find((r) => r.id === s.roundId);
                          const hcApp = calculateHandicap(s.hciSnapshot ?? viewingPlayer.hci, settings.useHci80);
                          const net = s.gross - hcApp;

                          return (
                            <tr key={s.id}>
                              <td>
                                <div style={{ fontWeight: 600 }}>{round ? round.name : s.roundId}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{round?.course}</div>
                              </td>
                              <td className="num">{s.gross}</td>
                              <td className="num">{hcApp}</td>
                              <td className="num">
                                <b style={{ color: 'var(--brass)' }}>{net}</b>
                              </td>
                              <td className="num">{s.putts}</td>
                              <td className="num">{s.ctp ? 'Ganado' : '–'}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                            Este jugador aún no tiene tarjetas de score registradas.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button onClick={() => setViewingPlayer(null)} className="btn btn-secondary">
                    Cerrar
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
};
