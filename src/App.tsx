import React, { useState } from 'react';
import { TournamentProvider } from './context/TournamentContext';
import { Sidebar, NavigationTab } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { NewTournamentModal } from './components/common/NewTournamentModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { PlayersView } from './components/views/PlayersView';
import { TeamsView } from './components/views/TeamsView';
import { RoundsView } from './components/views/RoundsView';
import { CaptureView } from './components/views/CaptureView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { RulesView } from './components/views/RulesView';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [captureRoundId, setCaptureRoundId] = useState<string | undefined>(undefined);
  const [isNewTournamentModalOpen, setIsNewTournamentModalOpen] = useState(false);

  const handleNavigateToCapture = (roundId?: string) => {
    if (roundId) setCaptureRoundId(roundId);
    setCurrentTab('capture');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToAnalytics = () => {
    setCurrentTab('analytics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar onOpenNewTournamentModal={() => setIsNewTournamentModalOpen(true)} />

        <main className="content-body">
          {currentTab === 'dashboard' && (
            <DashboardView
              onNavigateToCapture={handleNavigateToCapture}
              onNavigateToAnalytics={handleNavigateToAnalytics}
            />
          )}

          {currentTab === 'players' && <PlayersView />}

          {currentTab === 'teams' && <TeamsView />}

          {currentTab === 'rounds' && (
            <RoundsView onNavigateToCapture={handleNavigateToCapture} />
          )}

          {currentTab === 'capture' && (
            <CaptureView initialRoundId={captureRoundId} />
          )}

          {currentTab === 'analytics' && <AnalyticsView />}

          {currentTab === 'rules' && <RulesView />}
        </main>
      </div>

      {/* Modal para Crear Nuevo Torneo */}
      <NewTournamentModal
        isOpen={isNewTournamentModalOpen}
        onClose={() => setIsNewTournamentModalOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TournamentProvider>
      <AppContent />
    </TournamentProvider>
  );
};

export default App;
