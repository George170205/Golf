import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import {
  Sliders,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { TiebreakCriterion } from '../../types/tournament';

export const RulesView: React.FC = () => {
  const {
    pointsRules,
    settings,
    updatePointsRule,
    toggleHci80,
    setTiebreak,
    updateSettings
  } = useTournament();

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h2>Reglamento & Puntuación del Torneo</h2>
          <p>
            Configuración dinámica de las reglas de handicap, puntos por posición y criterios oficiales de desempate.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Card 1: Modalidad de Handicap */}
        <section className="card">
          <h3 className="card-title">Modalidad de Handicap Aplicado</h3>
          <p className="card-subtitle">
            Define la fórmula con la que se descuentan los golpes al score bruto (Gross - Handicap).
          </p>

          <div
            style={{
              padding: '16px',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <b style={{ display: 'block', fontSize: '15px' }}>
                Handicap Index al 80% (HCI × 0.8)
              </b>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {settings.useHci80
                  ? 'Actualmente activo: un jugador con HCI 15 juega con HC 12.'
                  : 'Desactivado: se utiliza el HCI completo del jugador (100%).'}
              </span>
            </div>

            <label className="switch-label">
              <div
                className={`switch-toggle ${settings.useHci80 ? 'on' : ''}`}
                onClick={() => toggleHci80(!settings.useHci80)}
              />
            </label>
          </div>

          <div
            style={{
              padding: '16px',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginTop: '14px'
            }}
          >
            <label htmlFor="tiebreak-select" style={{ display: 'block', fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>
              Criterio Oficial de Desempate en Jornadas
            </label>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              En caso de empate en golpes netos, ¿cómo se resuelve la posición?
            </p>
            <select
              id="tiebreak-select"
              value={settings.tiebreak}
              onChange={(e) => setTiebreak(e.target.value as TiebreakCriterion)}
              style={{
                width: '100%',
                minHeight: '40px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)'
              }}
            >
              <option value="putts">Menos Putts (Criterio oficial Los Santos)</option>
              <option value="gross">Menor número de golpes Gross</option>
              <option value="hc">Menor Handicap base</option>
            </select>
          </div>

          <div
            style={{
              padding: '16px',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginTop: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <b style={{ display: 'block', fontSize: '14px' }}>Puntos Extra por Closest To Pin (CTP)</b>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Puntos añadidos al total del jugador por ganar tiro más cercano a bandera.
              </span>
            </div>

            <input
              type="number"
              min="0"
              max="10"
              value={settings.ctpBonusPoints}
              onChange={(e) => updateSettings({ ctpBonusPoints: Number(e.target.value) || 0 })}
              style={{
                width: '70px',
                minHeight: '36px',
                textAlign: 'center',
                fontFamily: 'var(--font-num)',
                fontSize: '18px',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)'
              }}
            />
          </div>
        </section>

        {/* Card 2: Tabla de Puntos por Lugar */}
        <section className="card">
          <h3 className="card-title">Tabla de Puntos por Posición</h3>
          <p className="card-subtitle">
            Basada en la pestaña REGLA_PUNTOS de la hoja de cálculo. Edita los puntos asignados a cada lugar.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '12px',
              marginTop: '16px',
              maxHeight: '400px',
              overflowY: 'auto',
              paddingRight: '6px'
            }}
          >
            {pointsRules.map((rule) => (
              <div
                key={rule.place}
                style={{
                  padding: '10px 12px',
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                    Lugar {rule.place}
                  </span>
                  <span style={{ fontFamily: 'var(--font-num)', fontSize: '13px', fontWeight: 700, color: 'var(--brass)' }}>
                    Pos. {rule.place}º
                  </span>
                </div>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={rule.points}
                  onChange={(e) => updatePointsRule(rule.place, Number(e.target.value) || 0)}
                  style={{
                    width: '56px',
                    minHeight: '34px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-num)',
                    fontSize: '17px',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface)'
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
