import { PlayerStanding, TeamStanding, Round, Category } from '../types/tournament';

function downloadFile(content: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportStandingsCsv(
  category: Category,
  standings: PlayerStanding[],
  rounds: Round[]
) {
  const headers = [
    'Posición',
    'Jugador',
    'GHIN',
    'Categoría',
    'Equipo LIV',
    'HCI Base',
    'Rondas Jugadas',
    ...rounds.map((r) => `Pts ${r.shortCourse || r.name}`),
    ...rounds.map((r) => `Neto ${r.shortCourse || r.name}`),
    'Total Puntos',
    'Promedio Neto',
    'Promedio Putts',
    'Mejor Neto'
  ];

  const rows = standings.map((s, index) => [
    index + 1,
    `"${s.player.name.replace(/"/g, '""')}"`,
    s.player.ghin,
    s.player.category,
    s.team ? `"${s.team.name.replace(/"/g, '""')}"` : 'Sin equipo',
    s.player.hci,
    s.roundsPlayed,
    ...rounds.map((r) => s.pointsByRound[r.id] ?? 0),
    ...rounds.map((r) => s.netByRound[r.id] ?? '-'),
    s.totalPoints,
    s.avgNet,
    s.avgPutts,
    s.bestNet ?? '-'
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadFile(csvContent, `clasificacion_${category.toLowerCase()}_torneo.csv`);
}

export function exportLivCsv(teamStandings: TeamStanding[]) {
  const headers = ['Posición', 'Equipo LIV', 'Jugadores', 'Puntos Totales', 'Total Golpes Gross'];

  const rows = teamStandings.map((t, index) => [
    index + 1,
    `"${t.team.name.replace(/"/g, '""')}"`,
    t.playersCount,
    t.totalPoints,
    t.totalGrossStrokes
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadFile(csvContent, 'copa_liv_equipos.csv');
}

export function exportBackupJson(data: unknown, filename: string = 'respaldo_torneo_golf.json') {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}
