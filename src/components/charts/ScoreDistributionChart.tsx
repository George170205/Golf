import React from 'react';
import { PlayerStanding } from '../../types/tournament';

interface ScoreDistributionChartProps {
  standings: PlayerStanding[];
}

export const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({ standings }) => {
  const activePlayers = standings.filter((s) => s.roundsPlayed > 0).slice(0, 8);

  if (activePlayers.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No hay datos de golpes capturados para graficar la distribución.
      </div>
    );
  }

  const maxVal = Math.max(120, ...activePlayers.map((p) => p.avgGross));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', background: 'var(--fairway-700)', borderRadius: '2px' }} />
          <span>Golpes Netos (Net)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '2px' }} />
          <span>Golpes Totales (Gross)</span>
        </div>
      </div>

      {activePlayers.map((p) => {
        const netPct = Math.round((p.avgNet / maxVal) * 100);
        const grossPct = Math.round((p.avgGross / maxVal) * 100);
        const hcDiff = Math.round((p.avgGross - p.avgNet) * 10) / 10;

        return (
          <div key={p.player.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 60px', alignItems: 'center', gap: '12px' }}>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{p.player.name}</span>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)' }}>
                HC: {p.player.hci} (-{hcDiff})
              </span>
            </div>

            <div style={{ position: 'relative', height: '20px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
              {/* Gross Bar (Full width background) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${grossPct}%`,
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '4px'
                }}
              />
              {/* Net Bar (Colored overlay) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${netPct}%`,
                  background: 'linear-gradient(90deg, var(--fairway-600), var(--fairway-500))',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ textAlign: 'right', fontFamily: 'var(--font-num)', fontSize: '16px', fontWeight: 700 }}>
              <span style={{ color: 'var(--brass)' }}>{p.avgNet}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}> / {p.avgGross}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
