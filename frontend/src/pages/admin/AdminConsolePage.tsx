import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore, useCourseStore } from '../../store';

export const AdminConsolePage: React.FC = () => {
  const payments = useCartStore((state) => state.payments);
  const approveCheckPayment = useCartStore((state) => state.approveCheckPayment);
  const courses = useCourseStore((state) => state.courses);

  const pendingPayments = payments.filter((p) => p.status === 'pending');

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-standard">
        <div>
          <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
            Administrative Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
            Operations & Moderation Hub
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Monitor platform health, verify instructor credentials, moderate courses, and approve check payments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/users"
            className="px-4 py-2 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-primary text-xs font-semibold border border-border-control transition-colors"
          >
            Manage User Directory
          </Link>
        </div>
      </div>

      {/* Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Total Users</span>
          <div className="text-2xl font-bold font-mono text-text-contrast">18,420</div>
          <span className="text-[11px] text-status-success font-mono">1,240 Instructors</span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Published Courses</span>
          <div className="text-2xl font-bold font-mono text-text-contrast">{courses.length}</div>
          <span className="text-[11px] text-text-muted font-mono">100% QA inspected</span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Pending Approvals</span>
          <div className="text-2xl font-bold font-mono text-status-warning">
            {pendingPayments.length + 3}
          </div>
          <span className="text-[11px] text-text-muted font-mono">Checks & Instructors</span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Settled Volume</span>
          <div className="text-2xl font-bold font-mono text-primary-bright">$1,842,910</div>
          <span className="text-[11px] text-status-success font-mono">All transactions clear</span>
        </div>
      </div>

      {/* Check Payments Review Queue (Required by recurement.md) */}
      <div className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div>
            <h3 className="text-sm font-semibold text-text-contrast uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="material-symbols-outlined text-status-warning text-base">receipt_long</span>
              Offline Check / Wire Verification Queue
            </h3>
            <p className="text-xs text-text-muted">
              Manually approve received checks to immediately activate student course enrollments.
            </p>
          </div>
          <span className="text-[11px] font-mono text-status-warning font-bold bg-status-warning/15 px-2 py-0.5 rounded">
            {pendingPayments.length} PENDING
          </span>
        </div>

        {pendingPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary text-text-muted uppercase text-[10px] font-mono tracking-wider border-b border-border-subtle">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Learner</th>
                  <th className="py-3 px-4">Target Course</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Check Reference</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-text-secondary">
                {pendingPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-interactive/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-text-contrast">{p.orderNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-text-primary">{p.userName}</div>
                      <div className="text-[11px] text-text-muted font-mono">{p.userEmail}</div>
                    </td>
                    <td className="py-3 px-4 text-text-primary truncate max-w-xs">{p.courseTitle}</td>
                    <td className="py-3 px-4 font-mono font-bold text-text-contrast">
                      ${p.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono text-status-warning">
                      {p.checkNumber || 'CHK-OFFLINE'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => approveCheckPayment(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-status-success text-black font-bold text-[11px] hover:brightness-110 active:scale-95 transition-all shadow-sm flex items-center gap-1 ml-auto"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                        <span>Confirm Receipt & Unlock</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-text-muted bg-surface-secondary/40 rounded-xl">
            ✓ No pending check payments. All learner accounts are up to date!
          </div>
        )}
      </div>

      {/* Instructor Approval Applications Queue */}
      <div className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <h3 className="text-sm font-semibold text-text-contrast uppercase tracking-wider font-mono flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">verified_user</span>
            Pending Instructor Applications
          </h3>
          <span className="text-[11px] font-mono text-text-muted">2 Applications Waiting</span>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-surface-secondary border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-text-contrast flex items-center gap-2">
                <span>Dr. Julian Thorne</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated text-primary">
                  PhD Distributed Storage
                </span>
              </div>
              <p className="text-text-muted">
                Proposed Track: <strong className="text-text-secondary">Raft Consensus & Distributed Log Engines</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-surface-interactive text-status-danger text-xs font-semibold hover:bg-surface-elevated">
                Reject
              </button>
              <button className="px-4 py-1.5 rounded-lg bg-primary-container text-white text-xs font-semibold hover:brightness-110">
                Approve Faculty
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
