import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useCourseStore } from '../../store';

export const PublicHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const currentRole = useAuthStore((state) => state.currentRole);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const searchQuery = useCourseStore((state) => state.searchQuery);
  const setSearchQuery = useCourseStore((state) => state.setSearchQuery);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-border-standard">
      {/* Top Navbar */}
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-surface-card border border-border-standard flex items-center justify-center text-primary-container group-hover:border-primary-container transition-colors">
            <span className="material-symbols-outlined text-xl">token</span>
          </div>
          <span className="font-title-sm tracking-tight text-text-contrast uppercase font-bold text-sm sm:text-base">
            Obsidian<span className="text-primary-container">.edu</span>
          </span>
        </Link>

        {/* Navigation Links (Public & Student Only) */}
        <nav className="hidden lg:flex items-center gap-6 h-full">
          <Link
            to="/"
            className={`h-full flex items-center text-xs font-semibold tracking-wide transition-colors ${
              isActive('/')
                ? 'text-text-contrast border-b-2 border-primary-container'
                : 'text-text-secondary hover:text-text-contrast'
            }`}
          >
            Courses Catalog
          </Link>
          <Link
            to="/search"
            className={`h-full flex items-center text-xs font-semibold tracking-wide transition-colors ${
              isActive('/search')
                ? 'text-text-contrast border-b-2 border-primary-container'
                : 'text-text-secondary hover:text-text-contrast'
            }`}
          >
            Explore & Filters
          </Link>
          <Link
            to="/pricing"
            className={`h-full flex items-center text-xs font-semibold tracking-wide transition-colors ${
              isActive('/pricing')
                ? 'text-text-contrast border-b-2 border-primary-container'
                : 'text-text-secondary hover:text-text-contrast'
            }`}
          >
            SaaS Subscription
          </Link>
          {isAuthenticated && currentRole === 'student' && (
            <Link
              to="/my-courses"
              className={`h-full flex items-center text-xs font-semibold tracking-wide transition-colors ${
                isActive('/my-courses')
                  ? 'text-text-contrast border-b-2 border-primary-container'
                  : 'text-text-secondary hover:text-text-contrast'
              }`}
            >
              My Learning
            </Link>
          )}
        </nav>

        {/* Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md justify-end">
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center w-full max-w-xs h-9 px-3 bg-surface-card rounded-lg border border-border-control focus-within:border-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-text-muted text-base mr-2">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses, technologies..."
              className="w-full bg-transparent border-none text-text-primary placeholder:text-text-muted text-xs focus:outline-none"
            />
          </form>

          {/* User Controls */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {currentRole === 'student' && (
                  <Link
                    to="/checkout"
                    title="Cart / Checkout"
                    className="p-2 rounded-lg text-text-secondary hover:text-text-contrast hover:bg-surface-interactive transition-colors relative"
                  >
                    <span className="material-symbols-outlined text-lg">shopping_cart</span>
                  </Link>
                )}

                {/* If staff is logged in, show link back to their portal */}
                {currentRole === 'instructor' && (
                  <Link
                    to="/instructor/dashboard"
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-primary px-3 py-1.5 rounded-lg bg-primary-container/10 border border-primary-container/30 hover:bg-primary-container/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">co_present</span>
                    <span>Instructor Studio</span>
                  </Link>
                )}
                {currentRole === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-primary px-3 py-1.5 rounded-lg bg-primary-container/10 border border-primary-container/30 hover:bg-primary-container/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                    <span>Admin Operations</span>
                  </Link>
                )}
                {currentRole === 'superadmin' && (
                  <Link
                    to="/superadmin"
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-primary px-3 py-1.5 rounded-lg bg-primary-container/10 border border-primary-container/30 hover:bg-primary-container/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">shield_with_house</span>
                    <span>SuperAdmin Core</span>
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-border-subtle">
                  <img
                    alt={user.name}
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-border-standard"
                  />
                  <div className="hidden xl:block text-left">
                    <div className="text-xs font-semibold text-text-contrast leading-tight">{user.name}</div>
                    <div className="text-[10px] text-text-muted font-mono uppercase">{currentRole}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1.5 rounded-lg text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors ml-1"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-contrast transition-colors"
                >
                  Student Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="px-3.5 py-1.5 rounded-lg bg-primary-container text-white text-xs font-semibold hover:brightness-110 transition-all shadow-sm"
                >
                  Create Account
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-contrast"
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-card border-b border-border-standard p-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-text-primary hover:text-primary-container"
          >
            Courses Catalog
          </Link>
          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-text-primary hover:text-primary-container"
          >
            Explore & Search
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-text-primary hover:text-primary-container"
          >
            SaaS Subscription Plans
          </Link>
          {isAuthenticated && currentRole === 'student' && (
            <Link
              to="/my-courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-text-primary hover:text-primary-container"
            >
              My Learning
            </Link>
          )}

          <div className="pt-3 border-t border-border-subtle flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-primary"
                >
                  Student Sign In
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-text-secondary"
                >
                  Create Student Account
                </Link>
                <Link
                  to="/portal/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs font-mono text-text-muted hover:text-text-primary pt-1"
                >
                  Staff & Faculty Portal →
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-left text-sm font-semibold text-status-danger"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
