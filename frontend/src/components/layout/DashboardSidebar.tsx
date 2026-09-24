import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: string;
}

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentRole = useAuthStore((state) => state.currentRole);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/portal/login');
  };

  const getNavItems = (): { section: string; items: NavItem[] }[] => {
    if (currentRole === 'instructor') {
      return [
        {
          section: 'INSTRUCTIONAL CORE',
          items: [
            { label: 'Studio Overview', path: '/instructor/dashboard', icon: 'dashboard' },
            { label: 'Curriculum Builder', path: '/instructor/courses/new', icon: 'edit_note' },
            { label: 'Students & Demographics', path: '/instructor/students', icon: 'school', badge: '12.8k' },
            { label: 'Learner Metrics', path: '/instructor/analytics', icon: 'monitoring' },
            { label: 'Q&A Discussions', path: '/instructor/qa', icon: 'forum', badge: '3' },
            { label: 'Reviews & Feedback', path: '/instructor/reviews', icon: 'rate_review', badge: '12' }
          ]
        }
      ];
    }

    if (currentRole === 'admin') {
      return [
        {
          section: 'OPERATIONS & GOVERNANCE',
          items: [
            { label: 'Operations Hub', path: '/admin', icon: 'admin_panel_settings' },
            { label: 'Category Taxonomies', path: '/admin/categories', icon: 'category', badge: '6' },
            { label: 'Promotions & Coupons', path: '/admin/coupons', icon: 'local_offer', badge: '5' },
            { label: 'User Directory', path: '/admin/users', icon: 'group' },
            { label: 'Instructor Approvals', path: '/admin/instructors', icon: 'verified_user', badge: '3' },
            { label: 'Course Moderation', path: '/admin/courses', icon: 'layers', badge: '1' }
          ]
        }
      ];
    }

    if (currentRole === 'superadmin') {
      return [
        {
          section: 'SUPREME GOVERNANCE',
          items: [
            { label: 'Governance Core', path: '/superadmin', icon: 'shield_with_house' },
            { label: 'Financial Ledger & Refunds', path: '/superadmin/payments', icon: 'receipt_long' },
            { label: 'Promotions & Coupons', path: '/admin/coupons', icon: 'local_offer' },
            { label: 'Platform Settings', path: '/superadmin/settings', icon: 'tune' },
            { label: 'Security & Audit Logs', path: '/superadmin/audit-logs', icon: 'policy', badge: 'LIVE' }
          ]
        }
      ];
    }

    return [];
  };

  const navSections = getNavItems();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface-container-lowest border-r border-border-standard">
      {/* Brand & Workspace indicator */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-border-subtle shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-surface-card border border-border-standard flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-lg">token</span>
          </div>
          <span className="font-title-sm tracking-tight text-text-contrast uppercase font-bold text-sm">
            Obsidian<span className="text-primary-container">.ops</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-primary-container/20 text-primary border border-primary-container/30">
            {currentRole || 'GUEST'}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md text-text-muted hover:text-text-contrast"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
        {navSections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-text-muted">
              {sec.section}
            </div>
            {sec.items.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose?.()}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-surface-interactive text-text-contrast border-l-2 border-primary-container font-semibold shadow-sm'
                      : 'text-text-secondary hover:text-text-contrast hover:bg-surface-hover'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`material-symbols-outlined text-base ${
                        active ? 'text-primary-container' : 'text-text-muted'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-primary-container/20 text-primary border border-primary-container/40">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom User Card & Sign Out */}
      <div className="p-3 border-t border-border-subtle bg-surface-card/60 space-y-2 shrink-0">
        {user && (
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-surface-secondary/50 border border-border-subtle">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-border-standard"
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-contrast truncate">{user.name}</div>
              <div className="text-[10px] text-text-muted font-mono truncate">{user.email}</div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-xs text-status-danger hover:bg-status-danger/10 px-3 py-2 rounded-lg border border-status-danger/20 transition-colors font-medium"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          <span>Sign Out of Ops</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 z-40 flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          ></div>
          {/* Drawer content */}
          <div className="relative w-72 max-w-[80vw] h-full shadow-2xl z-10 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
