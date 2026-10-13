import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Modal } from './Modal';
import { Database, CheckCircle2, AlertCircle, Copy, ExternalLink, RefreshCw } from 'lucide-react';

interface DbConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DbConfigModal: React.FC<DbConfigModalProps> = ({ isOpen, onClose }) => {
  const { isDbConnected, refreshFromDatabase, showToast } = useTournament();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshFromDatabase();
    setIsRefreshing(false);
  };

  const handleCopyFileName = () => {
    navigator.clipboard.writeText('setup_postgresql.sql');
    showToast('Nombre de archivo copiado: setup_postgresql.sql');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Base de Datos Centralizada · PostgreSQL"
      subtitle="Sincronización multiusuario en tiempo real entre múltiples dispositivos."
      maxWidth="620px"
    >
      {/* Status Card */}
      <div
        style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          background: isDbConnected ? 'rgba(22, 163, 74, 0.12)' : 'var(--bg-surface-elevated)',
          border: `1px solid ${isDbConnected ? 'rgba(22, 163, 74, 0.35)' : 'var(--border-subtle)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-sm)',
              background: isDbConnected ? 'var(--success)' : 'var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <Database size={20} />
          </div>

          <div>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>
              {isDbConnected ? 'Conectado a PostgreSQL en la Nube' : 'Modo Local Activo (Sin Nube Conectada)'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {isDbConnected
                ? 'Todos los cambios se guardan y transmiten en vivo a todos los dispositivos.'
                : 'Los datos se guardan en el navegador. Conecta Supabase para sincronizar con otros teléfonos.'}
            </div>
          </div>
        </div>

        {isDbConnected && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn btn-secondary btn-sm"
            title="Recargar datos de la base de datos"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Sincronizar</span>
          </button>
        )}
      </div>

      {/* Guide to connect */}
      {!isDbConnected && (
        <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
          <h4 style={{ fontSize: '16px', marginBottom: '10px' }}>
            Pasos para conectar tu PostgreSQL gratuito en Supabase:
          </h4>

          <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-main)' }}>
            <li>
              Crea tu proyecto gratuito en{' '}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--brass)', textDecoration: 'underline', fontWeight: 600 }}
              >
                supabase.com <ExternalLink size={12} style={{ display: 'inline' }} />
              </a>{' '}
              (incluye PostgreSQL completo sin costo).
            </li>
            <li>
              Ve a la sección <b>SQL Editor</b> en tu panel de Supabase y ejecuta el archivo:
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--bg-surface-elevated)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  marginTop: '6px',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'monospace',
                  fontSize: '13px'
                }}
              >
                <span>setup_postgresql.sql</span>
                <button
                  type="button"
                  onClick={handleCopyFileName}
                  className="icon-btn"
                  style={{ width: '28px', height: '28px', marginLeft: 'auto' }}
                  title="Copiar nombre"
                >
                  <Copy size={13} />
                </button>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                (Este archivo ya contiene las tablas, reglas y todos los 51 jugadores del Excel listos).
              </span>
            </li>
            <li>
              En Vercel (o en tu archivo <code>.env</code> local), agrega estas dos variables de entorno de tu proyecto:
              <div
                style={{
                  background: 'var(--bg-surface-elevated)',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  marginTop: '6px',
                  border: '1px solid var(--border-subtle)',
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}
              >
                <div>VITE_SUPABASE_URL=https://tu-id.supabase.co</div>
                <div>VITE_SUPABASE_ANON_KEY=tu_clave_anonima_publica</div>
              </div>
            </li>
          </ol>
        </div>
      )}

      {isDbConnected && (
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          La base de datos centralizada PostgreSQL está activa y respondiendo en tiempo real. Cualquier jugador o capturista que ingrese al enlace verá las tablas y puntuaciones sincronizadas al instante.
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button onClick={onClose} className="btn btn-gold">
          Entendido
        </button>
      </div>
    </Modal>
  );
};
