import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { UserRole } from '../../types';

export const StaffLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const [selectedRole, setSelectedRole] = useState<'instructor' | 'admin' | 'superadmin'>('instructor');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = login(identifier, password, selectedRole);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Authentication failed.');
      return;
    }

    // Redirect to the designated isolated workspace
    if (selectedRole === 'instructor') {
      navigate('/instructor/dashboard', { replace: true });
    } else if (selectedRole === 'admin') {
      navigate('/admin', { replace: true });
    } else if (selectedRole === 'superadmin') {
      navigate('/superadmin', { replace: true });
    }
  };

  const handleFillStaffCredentials = (role: 'instructor' | 'admin' | 'superadmin') => {
    setSelectedRole(role);
    setError('');
    if (role === 'instructor') {
      setIdentifier('marcus.vance@obsidian.edu');
      setPassword('InstructorPass@2026!');
    } else if (role === 'admin') {
      setIdentifier('elena.rostova@obsidian.edu');
      setPassword('AdminPass@2026!');
    } else if (role === 'superadmin') {
      setIdentifier('viktor.kane@obsidian.edu');
      setPassword('SuperAdmin@2026!');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-surface-card border border-border-standard rounded-2xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Ambient red security indicator */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-status-danger/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-border-standard flex items-center justify-center text-primary-container mx-auto">
            <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
          </div>
          <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest text-primary-bright bg-primary-container/20 border border-primary-container/40 font-bold">
            Restricted Access
          </div>
          <h1 className="text-xl font-bold text-text-contrast tracking-tight">
            Staff & Faculty Operations Gateway
          </h1>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            Authorized personnel only. Enter valid security credentials corresponding to your assigned administrative tier.
          </p>
        </div>

        {/* Target Authority Selector */}
        <div className="p-1 rounded-xl bg-surface-secondary border border-border-subtle grid grid-cols-3 gap-1 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('instructor');
              setError('');
            }}
            className={`py-2 px-1 rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${
              selectedRole === 'instructor'
                ? 'bg-surface-elevated text-primary shadow-sm border border-border-standard'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-base">co_present</span>
            <span>Faculty</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('admin');
              setError('');
            }}
            className={`py-2 px-1 rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${
              selectedRole === 'admin'
                ? 'bg-surface-elevated text-primary shadow-sm border border-border-standard'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-base">manage_accounts</span>
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole('superadmin');
              setError('');
            }}
            className={`py-2 px-1 rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${
              selectedRole === 'superadmin'
                ? 'bg-surface-elevated text-primary-bright shadow-sm border border-primary-container/40 ring-1 ring-primary-container/20'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-base">shield_with_house</span>
            <span>SuperAdmin</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base shrink-0">gpp_bad</span>
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-text-secondary font-medium">Username or Staff Email</label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={
                selectedRole === 'instructor'
                  ? 'marcus.vance@obsidian.edu'
                  : selectedRole === 'admin'
                  ? 'elena.rostova@obsidian.edu'
                  : 'viktor.kane@obsidian.edu'
              }
              className="w-full bg-surface-secondary border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container font-mono"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-text-secondary font-medium">Security Password</label>
              <span className="text-[11px] text-text-muted font-mono">Case-sensitive</span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-surface-secondary border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-primary-container hover:brightness-110 active:scale-[0.98] text-white font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
          >
            <span>{loading ? 'Verifying Authorization...' : `Authenticate as ${selectedRole.toUpperCase()}`}</span>
            <span className="material-symbols-outlined text-sm">lock_open</span>
          </button>
        </form>

        {/* Pre-configured Authorized Personnel Credentials Helper */}
        <div className="p-3.5 rounded-xl bg-surface-secondary/40 border border-border-subtle space-y-2">
          <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider text-center">
            Authorized Personnel Directory (Quick Fill for Verification)
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <button
              type="button"
              onClick={() => handleFillStaffCredentials('instructor')}
              className="p-2 rounded bg-surface-card hover:bg-surface-elevated border border-border-standard text-left transition-colors"
            >
              <div className="font-bold text-text-contrast">Instructor</div>
              <div className="text-text-muted font-mono truncate">marcus.vance</div>
            </button>
            <button
              type="button"
              onClick={() => handleFillStaffCredentials('admin')}
              className="p-2 rounded bg-surface-card hover:bg-surface-elevated border border-border-standard text-left transition-colors"
            >
              <div className="font-bold text-text-contrast">Admin</div>
              <div className="text-text-muted font-mono truncate">elena.rostova</div>
            </button>
            <button
              type="button"
              onClick={() => handleFillStaffCredentials('superadmin')}
              className="p-2 rounded bg-surface-card hover:bg-surface-elevated border border-primary-container/30 text-left transition-colors"
            >
              <div className="font-bold text-primary">SuperAdmin</div>
              <div className="text-text-muted font-mono truncate">viktor.kane</div>
            </button>
          </div>
        </div>

        {/* Return to Student Portal */}
        <div className="pt-2 border-t border-border-subtle text-center text-xs text-text-muted">
          <span>Are you a student? </span>
          <Link to="/auth/login" className="text-primary hover:underline font-semibold">
            Go to Student Portal Sign In →
          </Link>
        </div>
      </div>
    </div>
  );
};
