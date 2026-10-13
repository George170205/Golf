import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import {
  Trophy,
  Moon,
  Sun,
  Plus,
  Download,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  Database
} from 'lucide-react';
import { exportBackupJson } from '../../utils/exportCsv';

interface NavbarProps {
  onOpenNewTournamentModal: () => void;
  onOpenDbModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewTournamentModal, onOpenDbModal }) => {
  const {
    tournaments,
    activeTournament,
    setActiveTournamentId,
    settings,
    setTheme,
    toggleHci80,
    resetToInitialData,
    players,
    teams,
    rounds,
    results,
    pointsRules,
    showToast,
    isDbConnected
  } = useTournament();

  const [showTournamentDropdown, setShowTournamentDropdown] = useState(false);

  const handleExportFullBackup = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tournaments,
      settings,
      players,
      teams,
      rounds,
      results,
      pointsRules
    };
    exportBackupJson(backup, `respaldo_${activeTournament.name.replace(/\s+/g, '_')}.json`);
    showToast('Respaldo del torneo descargado en JSON');
  };

  const handleResetConfirmation = () => {
    if (
      window.confirm(
        '¿Deseas restablecer todos los datos a la versión original de la hoja Excel Los Santos 2026/27? Los cambios actuales no guardados se reiniciarán.'
      )
    ) {
      resetToInitialData();
    }
  };

  return (
    <header className="top-navbar">
      {/* Selector de Torneo */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowTournamentDropdown(!showTournamentDropdown)}
          className="btn btn-secondary btn-sm"
          style={{ gap: '10px', padding: '8px 14px' }}
        >
          <Trophy size={16} color="var(--brass)" />
          <div style={{ textAlign: 'left' }}>
            <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Torneo Activo
            </span>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>{activeTournament.name}</span>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)', marginLeft: '4px' }} />
        </button>

        {showTournamentDropdown && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              width: '280px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '8px',
              zIndex: 50
            }}
          >
            <div style={{ padding: '6px 10px', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Seleccionar Torneo
            </div>
            {tournaments.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTournamentId(t.id);
                  setShowTournamentDropdown(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: t.id === activeTournament.id ? 'var(--bg-surface-elevated)' : 'transparent',
                  color: t.id === activeTournament.id ? 'var(--brass)' : 'var(--text-main)',
                  fontWeight: t.id === activeTournament.id ? 700 : 500,
                  fontSize: '13px',
                  textAlign: 'left'
                }}
              >
                <span>{t.name}</span>
                {t.id === activeTournament.id && <CheckCircle2 size={14} />}
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '6px 0' }} />
            <button
              onClick={() => {
                setShowTournamentDropdown(false);
                onOpenNewTournamentModal();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--brass)',
                fontWeight: 600,
                fontSize: '13px'
              }}
            >
              <Plus size={14} />
              <span>Añadir Nuevo Torneo</span>
            </button>
          </div>
        )}
      </div>

      {/* Acciones de la barra superior */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Toggle HCI 80% */}
        <button
          onClick={() => toggleHci80(!settings.useHci80)}
          className="btn btn-secondary btn-sm"
          title="Alternar entre HCI al 80% o HCI Completo"
          style={{
            borderColor: settings.useHci80 ? 'var(--brass)' : 'var(--border-subtle)',
            background: settings.useHci80 ? 'var(--bg-surface-elevated)' : 'transparent'
          }}
        >
          <SlidersHorizontal size={14} color={settings.useHci80 ? 'var(--brass)' : 'var(--text-muted)'} />
          <span>{settings.useHci80 ? 'HCI al 80% Activo' : 'HCI 100%'}</span>
        </button>

        {/* Respaldo JSON */}
        <button
          onClick={handleExportFullBackup}
          className="btn btn-secondary btn-sm"
          title="Descargar copia de seguridad en JSON"
        >
          <Download size={14} />
          <span>Respaldo</span>
        </button>

        {/* Restablecer Datos de Excel */}
        <button
          onClick={handleResetConfirmation}
          className="btn btn-secondary btn-sm"
          title="Restablecer a los datos iniciales de la hoja de cálculo"
        >
          <RotateCcw size={14} />
          <span>Reiniciar Datos</span>
        </button>

        {/* Botón de Base de Datos Centralizada */}
        <button
          onClick={onOpenDbModal}
          className="btn btn-secondary btn-sm"
          title={isDbConnected ? 'Base de datos PostgreSQL sincronizada' : 'Conectar PostgreSQL Centralizado'}
          style={{
            borderColor: isDbConnected ? 'rgba(22, 163, 74, 0.4)' : 'var(--border-subtle)',
            background: isDbConnected ? 'rgba(22, 163, 74, 0.12)' : 'transparent',
            color: isDbConnected ? 'var(--success)' : 'var(--text-muted)'
          }}
        >
          <Database size={14} color={isDbConnected ? 'var(--success)' : 'var(--text-muted)'} />
          <span>{isDbConnected ? 'Postgres Conectado' : 'Base de Datos'}</span>
        </button>

        {/* Tema Oscuro / Claro */}
        <button
          onClick={() => setTheme(settings.theme === 'dark' ? 'light' : 'dark')}
          className="icon-btn"
          aria-label="Cambiar tema"
          title={settings.theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {settings.theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
};
