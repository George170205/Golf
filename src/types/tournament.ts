export type Category = 'Premiere' | 'Elite' | 'Advanced';

export type RoundStatus = 'completed' | 'in_progress' | 'scheduled';

export type TiebreakCriterion = 'putts' | 'gross' | 'hc';

export interface Tournament {
  id: string;
  name: string;
  season: string;
  club: string;
  description: string;
  useHci80: boolean;
  tiebreak: TiebreakCriterion;
  status: 'active' | 'in_progress' | 'archived';
  createdAt: string;
}

export interface Player {
  id: string;
  name: string;
  ghin: string;
  hci: number;
  category: Category;
  teamId: string | null;
  slot: number | null;
  active?: boolean;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  captainId?: string | null;
}

export interface Round {
  id: string;
  number: number;
  name: string;
  course: string;
  shortCourse: string;
  date: string;
  status: RoundStatus;
  par?: number;
}

export interface RoundResult {
  id: string;
  roundId: string;
  playerId: string;
  gross: number;
  net?: number;
  putts: number;
  points?: number;
  ctp?: boolean;
  hciSnapshot?: number;
}

export interface PointRule {
  place: number;
  points: number;
}

export interface AppSettings {
  activeTournamentId: string;
  useHci80: boolean;
  tiebreak: TiebreakCriterion;
  ctpBonusPoints: number;
  theme: 'dark' | 'light';
}

export interface CalculatedScore {
  player: Player;
  gross: number;
  putts: number;
  hcApplied: number;
  net: number;
  place: number;
  points: number;
  ctp: boolean;
}

export interface PlayerStanding {
  player: Player;
  team: Team | null;
  roundsPlayed: number;
  pointsByRound: Record<string, number>;
  netByRound: Record<string, number>;
  grossByRound: Record<string, number>;
  puttsByRound: Record<string, number>;
  totalPoints: number;
  totalGross: number;
  totalNet: number;
  totalPutts: number;
  avgGross: number;
  avgNet: number;
  avgPutts: number;
  bestNet: number | null;
  ctpCount: number;
}

export interface TeamStanding {
  team: Team;
  playersCount: number;
  totalPoints: number;
  totalGrossStrokes: number;
  pointsByRound: Record<string, number>;
  players: Player[];
}
