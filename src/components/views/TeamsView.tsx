import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Users,
  Award,
  UserPlus,
  Check
} from 'lucide-react';
import { Team, Player } from '../../types/tournament';
import { Modal } from '../common/Modal';
import { calculateTeamStandings } from '../../utils/calculations';

export const TeamsView: React.FC = () => {
  const {
    teams,
    players,
    rounds,
    results,
    pointsRules,
    settings,
    createTeam,
    updateTeam,
    deleteTeam,
    assignPlayerToTeam
  } = useTournament();

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [teamForm, setTeamForm] = useState({ name: '', color: '#1F5A3A' });

  const [managingMembersTeam, setManagingMembersTeam] = useState<Team | null>(null);

  const teamStandings = calculateTeamStandings(
    teams,
    players,
    rounds,
    results,
    pointsRules,
    settings.useHci80,
    settings.tiebreak,
    settings.ctpBonusPoints
  );

  const handleOpenCreateModal = () => {
    setEditingTeam(null);
    setTeamForm({ name: '', color: '#1F5A3A' });
    setIsTeamModalOpen(true);
  };

  const handleOpenEditModal = (team: Team) => {
    setEditingTeam(team);
    setTeamForm({ name: team.name, color: team.color || '#1F5A3A' });
    setIsTeamModalOpen(true);
  };

  const handleSubmitTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name.trim()) return;

    if (editingTeam) {
      updateTeam(editingTeam.id, {
        name: teamForm.name.trim(),
        color: teamForm.color
      });
    } else {
      createTeam({
        name: teamForm.name.trim(),
        color: teamForm.color
      });
    }
    setIsTeamModalOpen(false);
  };

  const handleDeleteTeam = (team: Team) => {
    if (
      window.confirm(
        `¿Eliminar el equipo LIV "${team.name}"? Los jugadores asignados quedarán sin equipo pero no serán borrados.`
      )
    ) {
      deleteTeam(team.id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h2>Equipos · Copa LIV Golf</h2>
          <p>
            Equipos multidisciplinarios que integran jugadores Premiere, Elite y Advanced.
          </p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn btn-gold">
          <Plus size={16} />
          <span>Nuevo Equipo</span>
        </button>
      </div>

      {/* Grid de Equipos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}
      >
        {teams.map((team) => {
          const members = players.filter((p) => p.teamId === team.id);
          const standing = teamStandings.find((s) => s.team.id === team.id);
          const rank = teamStandings.findIndex((s) => s.team.id === team.id) + 1;
          const isLeader = rank === 1 && (standing?.totalPoints || 0) > 0;

          return (
            <div
              key={team.id}
              className="card"
              style={{
                borderTop: `4px solid ${team.color || 'var(--brass)'}`,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Header de Tarjeta */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '20px' }}>{team.name}</h3>
                    {isLeader && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: 'var(--brass-soft)',
                          color: 'var(--brass-ink)'
                        }}
                      >
                        Líder LIV
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    {members.length} integrantes registrados
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleOpenEditModal(team)}
                    className="icon-btn"
                    title="Editar nombre y color"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(team)}
                    className="icon-btn danger"
                    title="Eliminar equipo"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Stats Bar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  padding: '10px',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Posición</span>
                  <div style={{ fontFamily: 'var(--font-num)', fontSize: '20px', fontWeight: 700, color: 'var(--brass)' }}>
                    #{rank}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Puntos</span>
                  <div style={{ fontFamily: 'var(--font-num)', fontSize: '20px', fontWeight: 700 }}>
                    {standing ? standing.totalPoints : 0}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Golpes</span>
                  <div style={{ fontFamily: 'var(--font-num)', fontSize: '20px', fontWeight: 700 }}>
                    {standing ? standing.totalGrossStrokes : 0}
                  </div>
                </div>
              </div>

              {/* Members List */}
              <div style={{ flex: 1, marginBottom: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Alineación del Equipo
                  </span>
                  <button
                    onClick={() => setManagingMembersTeam(team)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                  >
                    <UserPlus size={12} />
                    <span>Gestionar</span>
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    paddingRight: '4px'
                  }}
                >
                  {members.length > 0 ? (
                    members.map((m) => (
                      <div
                        key={m.id}
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
                        <span style={{ fontWeight: 600 }}>{m.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>HCI {m.hci}</span>
                          <span className={`badge badge-${m.category}`} style={{ fontSize: '10px', padding: '1px 6px' }}>
                            {m.category}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                      Sin jugadores asignados. Haz clic en "Gestionar" para agregar integrantes.
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Crear / Editar Equipo */}
      <Modal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        title={editingTeam ? 'Editar Equipo LIV' : 'Nuevo Equipo LIV'}
        subtitle="Nombre del equipo y color distintivo de escuadra."
      >
        <form onSubmit={handleSubmitTeam}>
          <div className="form-group">
            <label htmlFor="t-name">Nombre del Equipo *</label>
            <input
              id="t-name"
              type="text"
              required
              value={teamForm.name}
              onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
              placeholder="Ej. Beerdie Guys"
            />
          </div>

          <div className="form-group">
            <label htmlFor="t-color">Color Distintivo de Escuadra</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                id="t-color"
                type="color"
                value={teamForm.color}
                onChange={(e) => setTeamForm({ ...teamForm, color: e.target.value })}
                style={{ width: '48px', height: '42px', padding: '2px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Código Hex: <b>{teamForm.color}</b>
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setIsTeamModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-gold">
              {editingTeam ? 'Actualizar Equipo' : 'Crear Equipo'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Gestionar Integrantes del Equipo */}
      {managingMembersTeam && (
        <Modal
          isOpen={Boolean(managingMembersTeam)}
          onClose={() => setManagingMembersTeam(null)}
          title={`Gestionar Integrantes · ${managingMembersTeam.name}`}
          subtitle="Marca o desmarca los jugadores para asignarlos o transferirlos a este equipo."
          maxWidth="680px"
        >
          <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '6px' }}>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Jugador</th>
                    <th>Categoría</th>
                    <th>Equipo Actual</th>
                    <th style={{ textAlign: 'center' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((p) => {
                    const isMember = p.teamId === managingMembersTeam.id;
                    const currentTeam = teams.find((t) => t.id === p.teamId);

                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>HCI {p.hci}</div>
                        </td>
                        <td>
                          <span className={`badge badge-${p.category}`}>{p.category}</span>
                        </td>
                        <td>
                          {currentTeam ? (
                            <span style={{ fontSize: '12px', fontWeight: currentTeam.id === managingMembersTeam.id ? 700 : 400 }}>
                              {currentTeam.name}
                            </span>
                          ) : (
                            <span style={{ fontSize: '12px', color: 'var(--text-faint)' }}>Sin equipo</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {isMember ? (
                            <button
                              onClick={() => assignPlayerToTeam(p.id, null)}
                              className="btn btn-danger btn-sm"
                            >
                              Remover
                            </button>
                          ) : (
                            <button
                              onClick={() => assignPlayerToTeam(p.id, managingMembersTeam.id)}
                              className="btn btn-secondary btn-sm"
                            >
                              {currentTeam ? 'Transferir' : 'Asignar'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button onClick={() => setManagingMembersTeam(null)} className="btn btn-gold">
              Listo
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
