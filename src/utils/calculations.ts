import {
  Player,
  RoundResult,
  PointRule,
  Category,
  CalculatedScore,
  PlayerStanding,
  TeamStanding,
  Team,
  Round,
  TiebreakCriterion
} from '../types/tournament';

export function calculateHandicap(hci: number, useHci80: boolean): number {
  if (useHci80) {
    return Math.round(hci * 0.8);
  }
  return Math.round(hci * 10) / 10;
}

export function calculateRoundScores(
  roundId: string,
  category: Category,
  players: Player[],
  results: RoundResult[],
  pointsRules: PointRule[],
  useHci80: boolean,
  tiebreak: TiebreakCriterion = 'putts',
  ctpBonusPoints: number = 0
): CalculatedScore[] {
  const catPlayers = players.filter((p) => p.category === category);
  const playerMap = new Map(catPlayers.map((p) => [p.id, p]));

  const roundResults = results.filter(
    (r) => r.roundId === roundId && playerMap.has(r.playerId) && r.gross > 0
  );

  const calculated: Omit<CalculatedScore, 'place' | 'points'>[] = roundResults.map((r) => {
    const player = playerMap.get(r.playerId)!;
    const hciToUse = r.hciSnapshot !== undefined ? r.hciSnapshot : player.hci;
    const hcApplied = calculateHandicap(hciToUse, useHci80);
    const net = r.gross - hcApplied;

    return {
      player,
      gross: r.gross,
      putts: r.putts || 0,
      hcApplied,
      net,
      ctp: Boolean(r.ctp)
    };
  });

  // Sort by net ascending; tiebreak by chosen criterion
  calculated.sort((a, b) => {
    if (a.net !== b.net) {
      return a.net - b.net;
    }
    if (tiebreak === 'putts') {
      return a.putts - b.putts;
    }
    if (tiebreak === 'gross') {
      return a.gross - b.gross;
    }
    return a.player.hci - b.player.hci;
  });

  // Assign places & points
  const pointsMap = new Map(pointsRules.map((rule) => [rule.place, rule.points]));
  const defaultMinPoints = pointsRules.length > 0 ? pointsRules[pointsRules.length - 1].points : 1;

  return calculated.map((item, index) => {
    const place = index + 1;
    const basePoints = pointsMap.has(place) ? pointsMap.get(place)! : defaultMinPoints;
    const extraCtp = item.ctp ? ctpBonusPoints : 0;

    return {
      ...item,
      place,
      points: basePoints + extraCtp
    };
  });
}

export function calculateAllStandings(
  category: Category,
  players: Player[],
  teams: Team[],
  rounds: Round[],
  results: RoundResult[],
  pointsRules: PointRule[],
  useHci80: boolean,
  tiebreak: TiebreakCriterion = 'putts',
  ctpBonusPoints: number = 0
): PlayerStanding[] {
  const catPlayers = players.filter((p) => p.category === category);
  const teamMap = new Map(teams.map((t) => [t.id, t]));

  // Calculate scores for each round
  const scoresByRound = new Map<string, Map<string, CalculatedScore>>();

  rounds.forEach((round) => {
    const roundScores = calculateRoundScores(
      round.id,
      category,
      catPlayers,
      results,
      pointsRules,
      useHci80,
      tiebreak,
      ctpBonusPoints
    );
    const scoreMap = new Map(roundScores.map((s) => [s.player.id, s]));
    scoresByRound.set(round.id, scoreMap);
  });

  const standings: PlayerStanding[] = catPlayers.map((player) => {
    const pointsByRound: Record<string, number> = {};
    const netByRound: Record<string, number> = {};
    const grossByRound: Record<string, number> = {};
    const puttsByRound: Record<string, number> = {};

    let totalPoints = 0;
    let totalGross = 0;
    let totalNet = 0;
    let totalPutts = 0;
    let roundsPlayed = 0;
    let bestNet: number | null = null;
    let ctpCount = 0;

    rounds.forEach((round) => {
      const scoreMap = scoresByRound.get(round.id);
      const score = scoreMap?.get(player.id);

      if (score) {
        roundsPlayed++;
        pointsByRound[round.id] = score.points;
        netByRound[round.id] = score.net;
        grossByRound[round.id] = score.gross;
        puttsByRound[round.id] = score.putts;

        totalPoints += score.points;
        totalGross += score.gross;
        totalNet += score.net;
        totalPutts += score.putts;

        if (bestNet === null || score.net < bestNet) {
          bestNet = score.net;
        }
        if (score.ctp) {
          ctpCount++;
        }
      }
    });

    const avgGross = roundsPlayed > 0 ? Math.round((totalGross / roundsPlayed) * 10) / 10 : 0;
    const avgNet = roundsPlayed > 0 ? Math.round((totalNet / roundsPlayed) * 10) / 10 : 0;
    const avgPutts = roundsPlayed > 0 ? Math.round((totalPutts / roundsPlayed) * 10) / 10 : 0;

    return {
      player,
      team: player.teamId ? teamMap.get(player.teamId) || null : null,
      roundsPlayed,
      pointsByRound,
      netByRound,
      grossByRound,
      puttsByRound,
      totalPoints,
      totalGross,
      totalNet,
      totalPutts,
      avgGross,
      avgNet,
      avgPutts,
      bestNet,
      ctpCount
    };
  });

  // Sort by totalPoints descending; tiebreak by bestNet ascending
  standings.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    const aBest = a.bestNet ?? 999;
    const bBest = b.bestNet ?? 999;
    if (aBest !== bBest) {
      return aBest - bBest;
    }
    return a.avgPutts - b.avgPutts;
  });

  return standings;
}

export function calculateTeamStandings(
  teams: Team[],
  players: Player[],
  rounds: Round[],
  results: RoundResult[],
  pointsRules: PointRule[],
  useHci80: boolean,
  tiebreak: TiebreakCriterion = 'putts',
  ctpBonusPoints: number = 0
): TeamStanding[] {
  const categories: Category[] = ['Premiere', 'Elite', 'Advanced'];
  const allStandings: PlayerStanding[] = [];

  categories.forEach((cat) => {
    const stds = calculateAllStandings(
      cat,
      players,
      teams,
      rounds,
      results,
      pointsRules,
      useHci80,
      tiebreak,
      ctpBonusPoints
    );
    allStandings.push(...stds);
  });

  const playerStandingMap = new Map(allStandings.map((s) => [s.player.id, s]));

  return teams
    .map((team) => {
      const teamPlayers = players.filter((p) => p.teamId === team.id);
      let totalPoints = 0;
      let totalGrossStrokes = 0;
      const pointsByRound: Record<string, number> = {};

      rounds.forEach((r) => {
        pointsByRound[r.id] = 0;
      });

      teamPlayers.forEach((p) => {
        const standing = playerStandingMap.get(p.id);
        if (standing) {
          totalPoints += standing.totalPoints;
          totalGrossStrokes += standing.totalGross;
          rounds.forEach((r) => {
            if (standing.pointsByRound[r.id]) {
              pointsByRound[r.id] += standing.pointsByRound[r.id];
            }
          });
        }
      });

      return {
        team,
        playersCount: teamPlayers.length,
        totalPoints,
        totalGrossStrokes,
        pointsByRound,
        players: teamPlayers
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints || a.totalGrossStrokes - b.totalGrossStrokes);
}

export function calculateMrPuttStandings(
  players: Player[],
  teams: Team[],
  rounds: Round[],
  results: RoundResult[],
  pointsRules: PointRule[],
  useHci80: boolean
): PlayerStanding[] {
  const categories: Category[] = ['Premiere', 'Elite', 'Advanced'];
  const allStandings: PlayerStanding[] = [];

  categories.forEach((cat) => {
    const stds = calculateAllStandings(
      cat,
      players,
      teams,
      rounds,
      results,
      pointsRules,
      useHci80
    );
    allStandings.push(...stds);
  });

  // Filter only players who have played at least 1 round with putts > 0
  return allStandings
    .filter((s) => s.roundsPlayed > 0 && s.avgPutts > 0)
    .sort((a, b) => a.avgPutts - b.avgPutts || b.roundsPlayed - a.roundsPlayed);
}
