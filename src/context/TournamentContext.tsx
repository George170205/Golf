import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Tournament,
  Player,
  Team,
  Round,
  RoundResult,
  PointRule,
  AppSettings,
  TiebreakCriterion
} from '../types/tournament';
import {
  INITIAL_TOURNAMENTS,
  INITIAL_PLAYERS,
  INITIAL_TEAMS,
  INITIAL_ROUNDS,
  INITIAL_RESULTS,
  INITIAL_POINTS_RULES,
  INITIAL_CTP_RULES,
  INITIAL_LIV_RULES,
  INITIAL_SETTINGS
} from '../data/initialData';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface TournamentContextType {
  tournaments: Tournament[];
  activeTournament: Tournament;
  players: Player[];
  teams: Team[];
  rounds: Round[];
  results: RoundResult[];
  pointsRules: PointRule[];
  ctpRules: PointRule[];
  livRules: PointRule[];
  settings: AppSettings;
  toasts: ToastMessage[];

  // Actions
  showToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  setActiveTournamentId: (id: string) => void;
  createTournament: (data: Omit<Tournament, 'id' | 'createdAt'>) => Tournament;
  updateTournament: (id: string, data: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;

  // Players
  createPlayer: (data: Omit<Player, 'id'>) => Player;
  updatePlayer: (id: string, data: Partial<Player>) => void;
  deletePlayer: (id: string) => void;

  // Teams
  createTeam: (data: Omit<Team, 'id'>) => Team;
  updateTeam: (id: string, data: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  assignPlayerToTeam: (playerId: string, teamId: string | null) => void;

  // Rounds
  createRound: (data: Omit<Round, 'id'>) => Round;
  updateRound: (id: string, data: Partial<Round>) => void;
  deleteRound: (id: string) => void;

  // Results
  saveResult: (data: Omit<RoundResult, 'id'>) => void;
  saveBulkResults: (roundId: string, scores: Array<{ playerId: string; gross: number; putts: number; ctp: boolean }>) => void;
  deleteResult: (resultId: string) => void;

  // Settings & Rules
  updatePointsRule: (place: number, points: number) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleHci80: (enabled: boolean) => void;
  setTiebreak: (tiebreak: TiebreakCriterion) => void;

  // Backup & Reset
  resetToInitialData: () => void;
  importBackup: (backupData: any) => boolean;
}

const STORAGE_KEY = 'torneo_los_santos_golf_state_v1';

const TournamentContext = createContext<TournamentContextType | null>(null);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initialize with Excel seed
  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tournaments`);
    return saved ? JSON.parse(saved) : INITIAL_TOURNAMENTS;
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_players`);
    return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_teams`);
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  const [rounds, setRounds] = useState<Round[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_rounds`);
    return saved ? JSON.parse(saved) : INITIAL_ROUNDS;
  });

  const [results, setResults] = useState<RoundResult[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_results`);
    return saved ? JSON.parse(saved) : INITIAL_RESULTS;
  });

  const [pointsRules, setPointsRules] = useState<PointRule[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_points_rules`);
    return saved ? JSON.parse(saved) : INITIAL_POINTS_RULES;
  });

  const [ctpRules, setCtpRules] = useState<PointRule[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_ctp_rules`);
    return saved ? JSON.parse(saved) : INITIAL_CTP_RULES;
  });

  const [livRules, setLivRules] = useState<PointRule[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_liv_rules`);
    return saved ? JSON.parse(saved) : INITIAL_LIV_RULES;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tournaments`, JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_players`, JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_teams`, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_rounds`, JSON.stringify(rounds));
  }, [rounds]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_results`, JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_points_rules`, JSON.stringify(pointsRules));
  }, [pointsRules]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
    // Apply theme class to document root
    if (settings.theme === 'light') {
      document.documentElement.classList.remove('theme-dark');
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
      document.documentElement.classList.add('theme-dark');
    }
  }, [settings]);

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const activeTournament =
    tournaments.find((t) => t.id === settings.activeTournamentId) ||
    tournaments[0] || {
      id: 'tour_1',
      name: 'Torneo Los Santos 2026/27',
      season: '2026-2027',
      club: 'Los Santos Golf Club',
      description: 'Campeonato Oficial',
      useHci80: settings.useHci80,
      tiebreak: settings.tiebreak,
      status: 'active' as const,
      createdAt: new Date().toISOString()
    };

  const setActiveTournamentId = (id: string) => {
    setSettings((prev) => ({ ...prev, activeTournamentId: id }));
    showToast('Torneo seleccionado cambiado', 'info');
  };

  const createTournament = (data: Omit<Tournament, 'id' | 'createdAt'>): Tournament => {
    const newTournament: Tournament = {
      id: `tour_${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...data
    };
    setTournaments((prev) => [...prev, newTournament]);
    setActiveTournamentId(newTournament.id);
    showToast(`Torneo "${newTournament.name}" creado con éxito`);
    return newTournament;
  };

  const updateTournament = (id: string, data: Partial<Tournament>) => {
    setTournaments((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
    showToast('Torneo actualizado');
  };

  const deleteTournament = (id: string) => {
    if (tournaments.length <= 1) {
      showToast('No puedes eliminar el único torneo activo', 'error');
      return;
    }
    setTournaments((prev) => prev.filter((t) => t.id !== id));
    if (settings.activeTournamentId === id) {
      const remaining = tournaments.filter((t) => t.id !== id);
      setSettings((prev) => ({ ...prev, activeTournamentId: remaining[0].id }));
    }
    showToast('Torneo eliminado', 'info');
  };

  // Players CRUD
  const createPlayer = (data: Omit<Player, 'id'>): Player => {
    const newPlayer: Player = {
      id: `p_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      ...data
    };
    setPlayers((prev) => [...prev, newPlayer]);
    showToast(`Jugador "${newPlayer.name}" añadido al roster`);
    return newPlayer;
  };

  const updatePlayer = (id: string, data: Partial<Player>) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
    showToast('Jugador actualizado');
  };

  const deletePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setResults((prev) => prev.filter((r) => r.playerId !== id));
    showToast('Jugador y sus registros eliminados', 'info');
  };

  // Teams CRUD
  const createTeam = (data: Omit<Team, 'id'>): Team => {
    const newTeam: Team = {
      id: `t_${Date.now()}`,
      ...data
    };
    setTeams((prev) => [...prev, newTeam]);
    showToast(`Equipo LIV "${newTeam.name}" creado`);
    return newTeam;
  };

  const updateTeam = (id: string, data: Partial<Team>) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
    showToast('Equipo actualizado');
  };

  const deleteTeam = (id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
    // Set players of this team to null
    setPlayers((prev) =>
      prev.map((p) => (p.teamId === id ? { ...p, teamId: null, slot: null } : p))
    );
    showToast('Equipo eliminado. Los integrantes ahora no tienen equipo', 'info');
  };

  const assignPlayerToTeam = (playerId: string, teamId: string | null) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, teamId } : p))
    );
    showToast('Equipo de jugador actualizado');
  };

  // Rounds CRUD
  const createRound = (data: Omit<Round, 'id'>): Round => {
    const newRound: Round = {
      id: `r_${Date.now()}`,
      ...data
    };
    setRounds((prev) => [...prev, newRound]);
    showToast(`Jornada "${newRound.name}" añadida al calendario`);
    return newRound;
  };

  const updateRound = (id: string, data: Partial<Round>) => {
    setRounds((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r))
    );
    showToast('Jornada actualizada');
  };

  const deleteRound = (id: string) => {
    setRounds((prev) => prev.filter((r) => r.id !== id));
    setResults((prev) => prev.filter((res) => res.roundId !== id));
    showToast('Jornada y resultados eliminados', 'info');
  };

  // Results Management
  const saveResult = (data: Omit<RoundResult, 'id'>) => {
    setResults((prev) => {
      const existingIndex = prev.findIndex(
        (r) => r.roundId === data.roundId && r.playerId === data.playerId
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...data
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: `res_${data.roundId}_${data.playerId}`,
          ...data
        }
      ];
    });
  };

  const saveBulkResults = (
    roundId: string,
    scores: Array<{ playerId: string; gross: number; putts: number; ctp: boolean }>
  ) => {
    setResults((prev) => {
      const copy = prev.filter((r) => r.roundId !== roundId);
      const newEntries: RoundResult[] = scores
        .filter((s) => s.gross > 0)
        .map((s) => {
          const player = players.find((p) => p.id === s.playerId);
          return {
            id: `res_${roundId}_${s.playerId}`,
            roundId,
            playerId: s.playerId,
            gross: s.gross,
            putts: s.putts,
            ctp: s.ctp,
            hciSnapshot: player ? player.hci : 15.0
          };
        });
      return [...copy, ...newEntries];
    });

    // Mark round status as completed if it had scores
    if (scores.some((s) => s.gross > 0)) {
      setRounds((prev) =>
        prev.map((r) => (r.id === roundId ? { ...r, status: 'completed' } : r))
      );
    }
    showToast('Resultados guardados y calculados correctamente');
  };

  const deleteResult = (resultId: string) => {
    setResults((prev) => prev.filter((r) => r.id !== resultId));
    showToast('Score eliminado');
  };

  // Rules and Settings
  const updatePointsRule = (place: number, points: number) => {
    setPointsRules((prev) => {
      const idx = prev.findIndex((p) => p.place === place);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { place, points };
        return next;
      }
      return [...prev, { place, points }].sort((a, b) => a.place - b.place);
    });
    showToast(`Puntos para lugar ${place} actualizados a ${points}`);
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Configuración actualizada');
  };

  const setTheme = (theme: 'dark' | 'light') => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const toggleHci80 = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, useHci80: enabled }));
    showToast(
      enabled
        ? 'Modalidad activada: Handicap al 80% (HCI × 0.8)'
        : 'Modalidad activada: Handicap al 100% (HCI completo)'
    );
  };

  const setTiebreak = (tiebreak: TiebreakCriterion) => {
    setSettings((prev) => ({ ...prev, tiebreak }));
    showToast(`Criterio de desempate cambiado a: ${tiebreak}`);
  };

  // Backup & Reset
  const resetToInitialData = () => {
    setTournaments(INITIAL_TOURNAMENTS);
    setPlayers(INITIAL_PLAYERS);
    setTeams(INITIAL_TEAMS);
    setRounds(INITIAL_ROUNDS);
    setResults(INITIAL_RESULTS);
    setPointsRules(INITIAL_POINTS_RULES);
    setCtpRules(INITIAL_CTP_RULES);
    setLivRules(INITIAL_LIV_RULES);
    setSettings(INITIAL_SETTINGS);
    showToast('Se restablecieron los datos originales del archivo Excel Los Santos 2026/27', 'info');
  };

  const importBackup = (backupData: any): boolean => {
    try {
      if (!backupData || !backupData.players || !backupData.rounds) {
        showToast('El archivo de respaldo no tiene el formato válido', 'error');
        return false;
      }
      if (backupData.tournaments) setTournaments(backupData.tournaments);
      if (backupData.players) setPlayers(backupData.players);
      if (backupData.teams) setTeams(backupData.teams);
      if (backupData.rounds) setRounds(backupData.rounds);
      if (backupData.results) setResults(backupData.results);
      if (backupData.pointsRules) setPointsRules(backupData.pointsRules);
      if (backupData.settings) setSettings(backupData.settings);
      showToast('Respaldo importado y cargado con éxito');
      return true;
    } catch (e) {
      showToast('Error al importar el archivo', 'error');
      return false;
    }
  };

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        activeTournament,
        players,
        teams,
        rounds,
        results,
        pointsRules,
        ctpRules,
        livRules,
        settings,
        toasts,
        showToast,
        removeToast,
        setActiveTournamentId,
        createTournament,
        updateTournament,
        deleteTournament,
        createPlayer,
        updatePlayer,
        deletePlayer,
        createTeam,
        updateTeam,
        deleteTeam,
        assignPlayerToTeam,
        createRound,
        updateRound,
        deleteRound,
        saveResult,
        saveBulkResults,
        deleteResult,
        updatePointsRule,
        updateSettings,
        setTheme,
        toggleHci80,
        setTiebreak,
        resetToInitialData,
        importBackup
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
