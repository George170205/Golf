import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Tournament,
  Player,
  Team,
  Round,
  RoundResult,
  PointRule,
  AppSettings
} from '../types/tournament';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// OPERACIONES DE CARGA CENTRALIZADA
// ==========================================

export async function fetchRemoteTournamentData(): Promise<{
  tournaments: Tournament[];
  players: Player[];
  teams: Team[];
  rounds: Round[];
  results: RoundResult[];
  pointsRules: PointRule[];
  settings: AppSettings | null;
} | null> {
  if (!supabase) return null;

  try {
    const [
      { data: tournaments, error: tErr },
      { data: players, error: pErr },
      { data: teams, error: tmErr },
      { data: rounds, error: rErr },
      { data: results, error: resErr },
      { data: pointsRules, error: prErr },
      { data: settingsRow, error: sErr }
    ] = await Promise.all([
      supabase.from('tournaments').select('*'),
      supabase.from('players').select('*'),
      supabase.from('teams').select('*'),
      supabase.from('rounds').select('*').order('number', { ascending: true }),
      supabase.from('round_results').select('*'),
      supabase.from('points_rules').select('*').order('place', { ascending: true }),
      supabase.from('app_settings').select('*').eq('key', 'global_config').maybeSingle()
    ]);

    if (tErr || pErr || tmErr || rErr || resErr || prErr) {
      console.warn('Error al consultar tablas remotas en PostgreSQL:', {
        tErr,
        pErr,
        tmErr,
        rErr,
        resErr,
        prErr
      });
      return null;
    }

    // Map DB schemas to TS models
    const mappedTournaments: Tournament[] = (tournaments || []).map((t) => ({
      id: t.id,
      name: t.name,
      season: t.season,
      club: t.club,
      description: t.description || '',
      useHci80: Boolean(t.use_hci80),
      tiebreak: t.tiebreak,
      status: t.status,
      createdAt: t.created_at
    }));

    const mappedPlayers: Player[] = (players || []).map((p) => ({
      id: p.id,
      name: p.name,
      ghin: p.ghin || '',
      hci: Number(p.hci),
      category: p.category,
      teamId: p.team_id,
      slot: p.slot,
      active: p.active
    }));

    const mappedTeams: Team[] = (teams || []).map((tm) => ({
      id: tm.id,
      name: tm.name,
      color: tm.color || '#1F5A3A',
      captainId: tm.captain_id
    }));

    const mappedRounds: Round[] = (rounds || []).map((r) => ({
      id: r.id,
      number: r.number,
      name: r.name,
      course: r.course,
      shortCourse: r.short_course || '',
      date: r.date,
      status: r.status,
      par: r.par || 72
    }));

    const mappedResults: RoundResult[] = (results || []).map((res) => ({
      id: res.id,
      roundId: res.round_id,
      playerId: res.player_id,
      gross: res.gross,
      putts: res.putts || 0,
      ctp: Boolean(res.ctp),
      hciSnapshot: Number(res.hci_snapshot)
    }));

    const mappedPointsRules: PointRule[] = (pointsRules || []).map((pr) => ({
      place: pr.place,
      points: pr.points
    }));

    const mappedSettings: AppSettings | null = settingsRow?.value || null;

    return {
      tournaments: mappedTournaments,
      players: mappedPlayers,
      teams: mappedTeams,
      rounds: mappedRounds,
      results: mappedResults,
      pointsRules: mappedPointsRules,
      settings: mappedSettings
    };
  } catch (error) {
    console.error('Fallo de conexión con PostgreSQL:', error);
    return null;
  }
}

// ==========================================
// SINCRONIZACIÓN EN TIEMPO REAL
// ==========================================

export async function remoteUpsertPlayer(player: Player, tournamentId: string = 'tour_1') {
  if (!supabase) return;
  await supabase.from('players').upsert({
    id: player.id,
    tournament_id: tournamentId,
    name: player.name,
    ghin: player.ghin,
    hci: player.hci,
    category: player.category,
    team_id: player.teamId,
    slot: player.slot
  });
}

export async function remoteDeletePlayer(playerId: string) {
  if (!supabase) return;
  await supabase.from('players').delete().eq('id', playerId);
}

export async function remoteUpsertTeam(team: Team, tournamentId: string = 'tour_1') {
  if (!supabase) return;
  await supabase.from('teams').upsert({
    id: team.id,
    tournament_id: tournamentId,
    name: team.name,
    color: team.color
  });
}

export async function remoteDeleteTeam(teamId: string) {
  if (!supabase) return;
  await supabase.from('teams').delete().eq('id', teamId);
}

export async function remoteUpsertRound(round: Round, tournamentId: string = 'tour_1') {
  if (!supabase) return;
  await supabase.from('rounds').upsert({
    id: round.id,
    tournament_id: tournamentId,
    number: round.number,
    name: round.name,
    course: round.course,
    short_course: round.shortCourse,
    date: round.date,
    status: round.status,
    par: round.par || 72
  });
}

export async function remoteDeleteRound(roundId: string) {
  if (!supabase) return;
  await supabase.from('rounds').delete().eq('id', roundId);
}

export async function remoteUpsertBulkResults(
  roundId: string,
  scores: Array<{ playerId: string; gross: number; putts: number; ctp: boolean; hciSnapshot: number }>
) {
  if (!supabase) return;
  const rows = scores
    .filter((s) => s.gross > 0)
    .map((s) => ({
      id: `res_${roundId}_${s.playerId}`,
      round_id: roundId,
      player_id: s.playerId,
      gross: s.gross,
      putts: s.putts,
      ctp: s.ctp,
      hci_snapshot: s.hciSnapshot
    }));

  if (rows.length > 0) {
    await supabase.from('round_results').upsert(rows, { onConflict: 'round_id,player_id' });
  }
}

export async function remoteUpsertPointsRule(place: number, points: number, tournamentId: string = 'tour_1') {
  if (!supabase) return;
  await supabase.from('points_rules').upsert({
    tournament_id: tournamentId,
    place,
    points
  });
}

export async function remoteUpsertSettings(settings: AppSettings) {
  if (!supabase) return;
  await supabase.from('app_settings').upsert({
    key: 'global_config',
    value: settings
  });
}
