import React from 'react';
import {
  Trophy,
  Users,
  Shield,
  Calendar,
  Edit3,
  BarChart3,
  Sliders,
  Flag
} from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

export type NavigationTab =
  | 'dashboard'
  | 'players'
  | 'teams'
  | 'rounds'
  | 'capture'
  | 'analytics'
  | 'rules';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { players, teams, rounds } = useTournament();

  const NAV_ITEMS: Array<{ id: NavigationTab; label: string; icon: React.FC<{ size?: number; className?: string }> }> = [
    { id: 'dashboard', label: 'Resumen & Tablas', icon: Trophy },
    { id: 'players', label: 'Jugadores', icon: Users },
    { id: 'teams', label: 'Equipos LIV', icon: Shield },
    { id: 'rounds', label: 'Jornadas', icon: Calendar },
    { id: 'capture', label: 'Captura de Scores', icon: Edit3 },
    { id: 'analytics', label: 'Gráficas & Promedios', icon: BarChart3 },
    { id: 'rules', label: 'Reglas de Puntos', icon: Sliders }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="brand-container">
        <div className="brand-icon-box">
          <Flag size={22} strokeWidth={2.2} />
        </div>
        <div className="brand-text">
          <h1>Los Santos</h1>
          <p>Golf Championship</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="nav-menu" aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={19} className="nav-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Roster Quick Stats */}
      <div
        style={{
          marginTop: 'auto',
          padding: '14px',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          fontSize: '12px',
          color: '#8FA699'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Jugadores registrados:</span>
          <b style={{ color: '#FFFFFF' }}>{players.length}</b>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Equipos LIV:</span>
          <b style={{ color: '#FFFFFF' }}>{teams.length}</b>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Jornadas:</span>
          <b style={{ color: '#FFFFFF' }}>{rounds.length}</b>
        </div>
      </div>
    </aside>
  );
};
