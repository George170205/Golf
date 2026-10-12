import React, { useState } from 'react';
import { PlayerStanding, Round } from '../../types/tournament';

interface PointsEvolutionChartProps {
  standings: PlayerStanding[];
  rounds: Round[];
}

const PLAYER_COLORS = [
  '#B8893B', // Oro de campeonato
  '#3E9B66', // Fairway esmeralda
  '#38BDF8', // Cyan
  '#A855F7', // Púrpura
  '#F97316', // Naranja
  '#EC4899', // Rosa
  '#EAB308', // Amarillo
  '#06B6D4'  // Turquesa
];

export const PointsEvolutionChart: React.FC<PointsEvolutionChartProps> = ({ standings, rounds }) => {
  const [hoveredPlayerId, setHoveredPlayerId] = useState<string | null>(null);

  // Take top 6 players
  const topPlayers = standings.slice(0, 6);

  if (topPlayers.length === 0 || rounds.length === 0) {
    return (
      <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No hay suficientes datos de jornadas para graficar la evolución.
      </div>
    );
  }

  // Calculate cumulative points for each round
  const data = topPlayers.map((s, idx) => {
    let runningTotal = 0;
    const pointsProgression = rounds.map((r) => {
      const pts = s.pointsByRound[r.id] || 0;
      runningTotal += pts;
      return {
        roundId: r.id,
        roundName: r.shortCourse || r.name,
        roundPoints: pts,
        cumulative: runningTotal
      };
    });

    return {
      playerId: s.player.id,
      name: s.player.name,
      color: PLAYER_COLORS[idx % PLAYER_COLORS.length],
      progression: pointsProgression,
      total: runningTotal
    };
  });

  const maxPoints = Math.max(25, ...data.map((d) => d.total));
  const height = 260;
  const width = 640;
  const paddingLeft = 50;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (roundIndex: number) => {
    if (rounds.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (roundIndex / (rounds.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    return paddingTop + chartHeight - (val / maxPoints) * chartHeight;
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
          alignItems: 'center'
        }}
      >
        {data.map((d) => {
          const isHovered = hoveredPlayerId === d.playerId;
          return (
            <button
              key={d.playerId}
              onMouseEnter={() => setHoveredPlayerId(d.playerId)}
              onMouseLeave={() => setHoveredPlayerId(null)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: isHovered ? 'var(--bg-surface-hover)' : 'transparent',
                border: `1px solid ${isHovered ? d.color : 'transparent'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: d.color,
                  display: 'inline-block'
                }}
              />
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: isHovered ? 'var(--text-main)' : 'var(--text-muted)'
                }}
              >
                {d.name} ({d.total} pts)
              </span>
            </button>
          );
        })}
      </div>

      {/* SVG Container */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', minWidth: '480px', height: 'auto', overflow: 'visible' }}
        >
          {/* Horizontal Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const val = Math.round(maxPoints * ratio);
            const y = getY(val);
            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="var(--text-muted)"
                  fontFamily="var(--font-num)"
                  fontWeight="600"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* X Axis labels */}
          {rounds.map((r, rIdx) => {
            const x = getX(rIdx);
            return (
              <g key={r.id}>
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={height - paddingBottom}
                  stroke="var(--border-subtle)"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={height - paddingBottom + 18}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="var(--text-muted)"
                  fontFamily="var(--font-num)"
                >
                  {r.shortCourse || r.name}
                </text>
              </g>
            );
          })}

          {/* Lines and Nodes */}
          {data.map((d) => {
            const pointsStr = d.progression
              .map((p, idx) => `${getX(idx)},${getY(p.cumulative)}`)
              .join(' ');

            const isDimmed = hoveredPlayerId !== null && hoveredPlayerId !== d.playerId;
            const isHighlighted = hoveredPlayerId === d.playerId;

            return (
              <g
                key={d.playerId}
                opacity={isDimmed ? 0.25 : 1}
                style={{ transition: 'opacity 0.2s ease' }}
              >
                {/* Polyline */}
                <polyline
                  fill="none"
                  stroke={d.color}
                  strokeWidth={isHighlighted ? 3.5 : 2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={pointsStr}
                />

                {/* Nodes */}
                {d.progression.map((p, pIdx) => {
                  const cx = getX(pIdx);
                  const cy = getY(p.cumulative);
                  return (
                    <g key={pIdx}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHighlighted ? 6 : 4}
                        fill={d.color}
                        stroke="var(--bg-surface)"
                        strokeWidth={2}
                      />
                      {/* Points label if highlighted or at end */}
                      {(isHighlighted || pIdx === rounds.length - 1) && (
                        <text
                          x={cx}
                          y={cy - 10}
                          textAnchor="middle"
                          fontSize="11"
                          fontWeight="700"
                          fill={d.color}
                          fontFamily="var(--font-num)"
                        >
                          {p.cumulative}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
