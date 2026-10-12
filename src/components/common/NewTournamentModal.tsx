import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Modal } from './Modal';
import { TiebreakCriterion } from '../../types/tournament';

interface NewTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTournamentModal: React.FC<NewTournamentModalProps> = ({ isOpen, onClose }) => {
  const { createTournament } = useTournament();

  const [formData, setFormData] = useState({
    name: '',
    season: '2026-2027',
    club: 'Los Santos Golf Club',
    description: '',
    useHci80: true,
    tiebreak: 'putts' as TiebreakCriterion,
    status: 'active' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    createTournament({
      name: formData.name.trim(),
      season: formData.season.trim(),
      club: formData.club.trim(),
      description: formData.description.trim(),
      useHci80: formData.useHci80,
      tiebreak: formData.tiebreak,
      status: 'active'
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nuevo Torneo"
      subtitle="Configura un nuevo campeonato independiente con sus propias reglas y fechas."
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="t-name">Nombre Oficial del Torneo *</label>
          <input
            id="t-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej. Torneo Los Santos 2026/27"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="t-season">Temporada *</label>
            <input
              id="t-season"
              type="text"
              required
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              placeholder="Ej. 2026-2027"
            />
          </div>

          <div className="form-group">
            <label htmlFor="t-club">Club Sede</label>
            <input
              id="t-club"
              type="text"
              value={formData.club}
              onChange={(e) => setFormData({ ...formData, club: e.target.value })}
              placeholder="Ej. Los Santos Golf Club"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="t-desc">Descripción o Notas</label>
          <textarea
            id="t-desc"
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Modalidad individual por categorías y Copa LIV por equipos."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="t-hc">Modalidad de Handicap</label>
            <select
              id="t-hc"
              value={formData.useHci80 ? '80' : '100'}
              onChange={(e) => setFormData({ ...formData, useHci80: e.target.value === '80' })}
            >
              <option value="80">HCI al 80% (HCI × 0.8)</option>
              <option value="100">HCI Completo (100%)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="t-tie">Criterio de Desempate</label>
            <select
              id="t-tie"
              value={formData.tiebreak}
              onChange={(e) => setFormData({ ...formData, tiebreak: e.target.value as TiebreakCriterion })}
            >
              <option value="putts">Menos Putts</option>
              <option value="gross">Menor Gross</option>
              <option value="hc">Menor Handicap</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" className="btn btn-gold">
            Crear Torneo
          </button>
        </div>
      </form>
    </Modal>
  );
};
