import React from 'react';
import { TeamStanding } from '../../types/tournament';

interface TeamStandingsChartProps {
  standings: TeamStanding[];
}

export const TeamStandingsChart: React.FC<TeamStandingsChartProps> = ({ standings }) => {
  if (standings.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No hay equipos configurados para graficar.
      </div>
    );
  }

  const maxPoints = Math.max(1, ...standings.map((s) => s.totalPoints));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {standings.map((s, idx) => {
        const pct = Math.round((s.totalPoints / maxPoints) * 100);
        const isLeader = idx === 0 && s.totalPoints > 0;

        return (
          <div
            key={s.team.id}
            style={{
              padding: '14px 18px',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              transition: 'border-color 0.2s ease'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isLeader ? 'var(--brass)' : 'var(--border-subtle)',
                    color: isLeader ? '#0E1A13' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-num)'
                  }}
                >
                  {idx + 1}
                </span>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>{s.team.name}</span>
                <span
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-surface)',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {s.playersCount} jugadores
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {s.totalGrossStrokes > 0 ? `${s.totalGrossStrokes} golpes` : ''}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-num)',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: isLeader ? 'var(--brass)' : 'var(--text-main)'
                  }}
                >
                  {s.totalPoints} pts
                </span>
              </div>
            </div>

            {/* Visual Bar */}
            <div
              style={{
                height: '10px',
                background: 'var(--border-subtle)',
                borderRadius: '999px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: isLeader
                    ? 'linear-gradient(90deg, var(--brass), #E2B96C)'
                    : s.team.color || 'var(--fairway-600)',
                  borderRadius: '999px',
                  transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
