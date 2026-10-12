import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Edit3,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Round, RoundStatus } from '../../types/tournament';
import { Modal } from '../common/Modal';

interface RoundsViewProps {
  onNavigateToCapture: (roundId: string) => void;
}

export const RoundsView: React.FC<RoundsViewProps> = ({ onNavigateToCapture }) => {
  const { rounds, players, results, createRound, updateRound, deleteRound } = useTournament();

  const [isRoundModalOpen, setIsRoundModalOpen] = useState(false);
  const [editingRound, setEditingRound] = useState<Round | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    course: '',
    shortCourse: '',
    date: new Date().toISOString().slice(0, 10),
    status: 'scheduled' as RoundStatus,
    par: 72
  });

  const handleOpenCreateModal = () => {
    setEditingRound(null);
    const nextNumber = rounds.length + 1;
    setFormData({
      name: `Jornada ${nextNumber}`,
      course: '',
      shortCourse: '',
      date: new Date().toISOString().slice(0, 10),
      status: 'scheduled',
      par: 72
    });
    setIsRoundModalOpen(true);
  };

  const handleOpenEditModal = (round: Round) => {
    setEditingRound(round);
    setFormData({
      name: round.name,
      course: round.course,
      shortCourse: round.shortCourse || '',
      date: round.date,
      status: round.status,
      par: round.par || 72
    });
    setIsRoundModalOpen(true);
  };

  const handleSubmitRound = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.course.trim()) return;

    const short = formData.shortCourse.trim() || formData.course.slice(0, 3).toUpperCase();

    if (editingRound) {
      updateRound(editingRound.id, {
        name: formData.name.trim(),
        course: formData.course.trim(),
        shortCourse: short,
        date: formData.date,
        status: formData.status,
        par: Number(formData.par)
      });
    } else {
      createRound({
        number: rounds.length + 1,
        name: formData.name.trim(),
        course: formData.course.trim(),
        shortCourse: short,
        date: formData.date,
        status: formData.status,
        par: Number(formData.par)
      });
    }
    setIsRoundModalOpen(false);
  };

  const handleDeleteRound = (round: Round) => {
    if (
      window.confirm(
        `¿Eliminar la jornada "${round.name}"? Se borrarán todos los scores registrados para esta fecha.`
      )
    ) {
      deleteRound(round.id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h2>Calendario de Jornadas Oficiales</h2>
          <p>
            Campos sede, fechas oficiales de juego y estado de captura de scores del torneo.
          </p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn btn-gold">
          <Plus size={16} />
          <span>Nueva Jornada</span>
        </button>
      </div>

      {/* Lista de Jornadas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {rounds.map((round) => {
          const roundResults = results.filter((r) => r.roundId === round.id && r.gross > 0);
          const isDone = round.status === 'completed' || roundResults.length > 0;

          // Parse date
          const dateObj = new Date(round.date + 'T12:00:00');
          const day = dateObj.getDate();
          const month = dateObj.toLocaleDateString('es-MX', { month: 'short' }).toUpperCase().replace('.', '');
          const year = dateObj.getFullYear();

          return (
            <div
              key={round.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                gap: '20px',
                flexWrap: 'wrap'
              }}
            >
              {/* Date Box */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '240px' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: 'var(--radius-md)',
                    background: isDone ? 'var(--fairway-700)' : 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      color: isDone ? '#A3D9B5' : 'var(--text-muted)'
                    }}
                  >
                    {month}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-num)',
                      fontSize: '28px',
                      fontWeight: 700,
                      lineHeight: 1,
                      color: isDone ? '#FFFFFF' : 'var(--text-main)'
                    }}
                  >
                    {day}
                  </span>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <h3 style={{ fontSize: '19px' }}>{round.name}</h3>
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-num)',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'var(--bg-surface-elevated)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      {round.shortCourse || 'S/C'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    <MapPin size={14} />
                    <span>{round.course}</span>
                    <span>· Año {year}</span>
                  </div>
                </div>
              </div>

              {/* Status and Scores Progress */}
              <div style={{ minWidth: '180px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className={`badge ${isDone ? 'badge-success' : 'badge-warning'}`}>
                    {isDone ? 'Resultados Oficiales' : 'Programada'}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  <b>{roundResults.length}</b> de {players.length} jugadores con score capturado
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => onNavigateToCapture(round.id)}
                  className="btn btn-gold btn-sm"
                >
                  <Edit3 size={14} />
                  <span>Capturar Scores</span>
                </button>

                <button
                  onClick={() => handleOpenEditModal(round)}
                  className="icon-btn"
                  title="Editar fecha o campo"
                >
                  <Edit2 size={15} />
                </button>

                <button
                  onClick={() => handleDeleteRound(round)}
                  className="icon-btn danger"
                  title="Eliminar jornada"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Crear / Editar Jornada */}
      <Modal
        isOpen={isRoundModalOpen}
        onClose={() => setIsRoundModalOpen(false)}
        title={editingRound ? 'Editar Jornada' : 'Nueva Jornada del Torneo'}
        subtitle="Configura el campo sede, código abreviado y fecha del evento."
      >
        <form onSubmit={handleSubmitRound}>
          <div className="form-group">
            <label htmlFor="r-name">Nombre de la Jornada *</label>
            <input
              id="r-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. Jornada 1"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="r-course">Campo de Golf *</label>
              <input
                id="r-course"
                type="text"
                required
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                placeholder="Ej. Baja Country Club"
              />
            </div>

            <div className="form-group">
              <label htmlFor="r-short">Código Abreviado (3 letras)</label>
              <input
                id="r-short"
                type="text"
                maxLength={4}
                value={formData.shortCourse}
                onChange={(e) => setFormData({ ...formData, shortCourse: e.target.value.toUpperCase() })}
                placeholder="Ej. BCC"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="r-date">Fecha Oficial *</label>
              <input
                id="r-date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="r-status">Estado de la Jornada</label>
              <select
                id="r-status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as RoundStatus })}
              >
                <option value="scheduled">Programada / Próxima</option>
                <option value="in_progress">En captura</option>
                <option value="completed">Finalizada / Con resultados</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setIsRoundModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-gold">
              {editingRound ? 'Actualizar Jornada' : 'Guardar Jornada'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
