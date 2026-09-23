import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store';

export const AuthGatewayPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const registerStudent = useAuthStore((state) => state.registerStudent);

  // Check if routed with /auth/register
  const isRegisterInitial = location.pathname.includes('register');
  const [mode, setMode] = useState<'login' | 'register'>(isRegisterInitial ? 'register' : 'login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect path if arrived from a protected student page
  const from = (location.state as any)?.from?.pathname || '/my-courses';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'register') {
      const res = registerStudent(name, email, password);
      setLoading(false);
      if (!res.success) {
        setError(res.error || 'Failed to register account.');
        return;
      }
      navigate(from, { replace: true });
    } else {
      const res = login(email, password, 'student');
      setLoading(false);
      if (!res.success) {
        setError(res.error || 'Invalid student email or password.');
        return;
      }
      navigate(from, { replace: true });
    }
  };

  const handleFillDemoStudent = () => {
    setEmail('alex.rivera@engineer.io');
    setPassword('StudentPass@2026!');
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface-card border border-border-standard rounded-2xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Ambient background accent */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-border-standard flex items-center justify-center text-primary-container mx-auto">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <h1 className="text-xl font-bold text-text-contrast tracking-tight">
            {mode === 'login' ? 'Student Learning Portal' : 'Create Student Account'}
          </h1>
          <p className="text-xs text-text-muted">
            {mode === 'login'
              ? 'Sign in to access your enrolled courses, syllabus progress, and certificates.'
              : 'Join elite engineering masterclasses and sovereign architecture courses.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="p-1 rounded-xl bg-surface-secondary border border-border-subtle grid grid-cols-2 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-surface-elevated text-text-contrast shadow-sm border border-border-standard'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-surface-elevated text-text-contrast shadow-sm border border-border-standard'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <span>Create Account</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="text-text-secondary font-medium">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maya Chen"
                className="w-full bg-surface-secondary border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-text-secondary font-medium">Username or Email</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@engineer.io"
              className="w-full bg-surface-secondary border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-text-secondary font-medium">Password</label>
              <span className="text-[11px] text-text-muted">Min. 6 chars</span>
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
            <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In as Student' : 'Create Student Account'}</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </form>

        {/* Demo Student Fast Credentials */}
        <div className="p-3 rounded-lg bg-surface-secondary/40 border border-border-subtle flex items-center justify-between text-[11px]">
          <div className="text-text-muted">
            Test Student: <code className="text-text-primary font-mono">alex.rivera@engineer.io</code>
          </div>
          <button
            type="button"
            onClick={handleFillDemoStudent}
            className="text-primary hover:underline font-semibold"
          >
            Auto-fill
          </button>
        </div>

        {/* Link to Staff Portal */}
        <div className="pt-4 border-t border-border-subtle text-center text-xs text-text-muted">
          <span>Are you Faculty or Platform Staff? </span>
          <Link to="/portal/login" className="text-primary hover:underline font-semibold">
            Staff Operations Portal →
          </Link>
        </div>
      </div>
    </div>
  );
};
