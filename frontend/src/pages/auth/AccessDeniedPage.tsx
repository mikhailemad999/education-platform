import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { UserRole } from '../../types';

interface AccessDeniedPageProps {
  requiredRoles?: UserRole[];
  currentRole?: UserRole | null;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  requiredRoles = [],
  currentRole
}) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const getAuthorizedHome = () => {
    if (currentRole === 'superadmin') return '/superadmin';
    if (currentRole === 'admin') return '/admin';
    if (currentRole === 'instructor') return '/instructor/dashboard';
    return '/my-courses';
  };

  const handleSwitchAccount = () => {
    logout();
    navigate('/portal/login');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-surface-card border border-status-danger/40 rounded-2xl p-8 text-center shadow-2xl space-y-6 relative overflow-hidden">
        {/* Subtle red ambient glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-14 h-14 rounded-2xl bg-status-danger/10 border border-status-danger/30 flex items-center justify-center text-status-danger mx-auto">
          <span className="material-symbols-outlined text-3xl">gpp_maybe</span>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-status-danger font-bold bg-status-danger/10 px-2.5 py-0.5 rounded border border-status-danger/20">
            HTTP 403 · Access Forbidden
          </span>
          <h1 className="text-2xl font-bold text-text-contrast tracking-tight pt-2">
            Restricted Security Tier
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Your current account role <code className="text-primary font-mono font-bold bg-surface-secondary px-1.5 py-0.5 rounded">[{currentRole || 'guest'}]</code> does not have authorization to view this perimeter.
          </p>
        </div>

        {requiredRoles.length > 0 && (
          <div className="p-3 rounded-lg bg-surface-secondary/70 border border-border-subtle text-left text-xs space-y-1">
            <div className="text-[10px] font-mono uppercase text-text-muted">Required Authority:</div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {requiredRoles.map((role) => (
                <span
                  key={role}
                  className="px-2 py-0.5 rounded bg-primary-container/20 text-primary font-mono text-[11px] border border-primary-container/40"
                >
                  {role.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col gap-2.5">
          <button
            onClick={() => navigate(getAuthorizedHome())}
            className="w-full h-10 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-contrast font-medium text-xs border border-border-standard transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            <span>Return to Your Authorized Workspace</span>
          </button>

          <button
            onClick={handleSwitchAccount}
            className="w-full h-10 rounded-lg bg-primary-container hover:brightness-110 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">login</span>
            <span>Sign In with Different Credentials</span>
          </button>
        </div>
      </div>
    </div>
  );
};
