import React from 'react';
import { PlayerStanding } from '../../types/tournament';

interface MrPuttChartProps {
  mrPuttStandings: PlayerStanding[];
}

export const MrPuttChart: React.FC<MrPuttChartProps> = ({ mrPuttStandings }) => {
  const topPutters = mrPuttStandings.slice(0, 8);

  if (topPutters.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Aún no hay registros de putts en las jornadas jugadas.
      </div>
    );
  }

  const bestAverage = topPutters[0]?.avgPutts || 30;
  const maxAverage = Math.max(45, ...topPutters.map((p) => p.avgPutts));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {topPutters.map((p, idx) => {
        const isFirst = idx === 0;
        // In putting, LOWER is better!
        // We calculate bar width such that lower putts get full score
        const widthPct = Math.max(20, Math.min(100, Math.round(((maxAverage - p.avgPutts) / (maxAverage - bestAverage + 5)) * 100)));

        return (
          <div
            key={p.player.id}
            style={{
              padding: '10px 14px',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'grid',
              gridTemplateColumns: '32px 1fr auto',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <span
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: isFirst ? 'var(--brass)' : 'var(--bg-surface)',
                color: isFirst ? '#0E1A13' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-num)',
                fontWeight: 700,
                fontSize: '13px'
              }}
            >
              {idx + 1}
            </span>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{p.player.name}</span>
                <span className={`badge badge-${p.player.category}`} style={{ fontSize: '11px', padding: '1px 6px' }}>
                  {p.player.category}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {p.roundsPlayed} {p.roundsPlayed === 1 ? 'jornada' : 'jornadas'}
                </span>
              </div>

              <div
                style={{
                  height: '6px',
                  background: 'var(--border-subtle)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  width: '100%',
                  maxWidth: '300px'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${widthPct}%`,
                    background: isFirst
                      ? 'linear-gradient(90deg, #10B981, #059669)'
                      : 'var(--fairway-600)',
                    borderRadius: '999px'
                  }}
                />
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontFamily: 'var(--font-num)',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: isFirst ? '#10B981' : 'var(--text-main)'
                }}
              >
                {p.avgPutts}
              </span>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                putts/ronda
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
