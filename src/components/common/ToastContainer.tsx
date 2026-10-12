import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useTournament();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let iconColor = 'var(--success)';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'var(--danger)';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'var(--brass)';
        }

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <Icon size={18} color={iconColor} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Cerrar notificación"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
