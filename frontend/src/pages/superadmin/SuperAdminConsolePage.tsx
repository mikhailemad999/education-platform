import React, { useState } from 'react';
import { useCartStore } from '../../store';
import { Modal } from '../../components/common/Modal';

export const SuperAdminConsolePage: React.FC = () => {
  const payments = useCartStore((state) => state.payments);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [adminRole, setAdminRole] = useState('Curriculum Moderator');
  const [inviteSuccessNotice, setInviteSuccessNotice] = useState('');
  const [ledgerPayments, setLedgerPayments] = useState(payments);

  const handleDispatchInvitation = () => {
    if (!inviteEmail) return;
    setInviteSuccessNotice(`Administrator provisioned for "${inviteEmail}" (${adminRole}). Credentials dispatched.`);
    setShowInviteModal(false);
    setInviteEmail('');
    setTimeout(() => setInviteSuccessNotice(''), 4000);
  };

  const handleRefund = (id: string) => {
    setLedgerPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'refunded' as const } : p))
    );
  };

  const totalGross = ledgerPayments
    .filter((p) => p.status === 'paid')
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-8">
      {/* Top SuperAdmin Security Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-surface-card p-6 sm:p-8 rounded-2xl border border-border-standard shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-ambient-dark text-primary text-[11px] font-mono font-bold uppercase tracking-wider border border-primary-container/30">
              <span className="material-symbols-outlined text-sm">lock</span>
              SUPERADMIN SUPREME GOVERNANCE
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-status-success/15 text-status-success text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse"></span>
              REALTIME SYNC ACTIVE
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-contrast tracking-tight flex items-center gap-3">
            Master Operations Core
            <span className="text-xs text-text-secondary px-2.5 py-0.5 rounded bg-surface-elevated font-mono">
              v4.18.2-prod
            </span>
          </h1>
          <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
            Global instructional governance, sovereign revenue clearing, identity compliance, and emergency telemetry switchboards.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2.5 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>Invite Administrator</span>
          </button>
        </div>
      </div>

      {inviteSuccessNotice && (
        <div className="p-3.5 rounded-xl bg-status-success/10 border border-status-success/30 text-status-success text-xs flex items-center gap-2 animate-fade-in font-medium">
          <span className="material-symbols-outlined text-base">verified_user</span>
          <span>{inviteSuccessNotice}</span>
        </div>
      )}

      {/* Financial Volumes Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Gross Settled Volume</span>
          <div className="text-2xl font-bold font-mono text-text-contrast">
            ${(1842910 + totalGross).toLocaleString()}
          </div>
          <span className="text-[11px] text-status-success font-mono">+14.2% YTD growth</span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Monthly Recurring (MRR)</span>
          <div className="text-2xl font-bold font-mono text-primary-bright">$184,200.00</div>
          <span className="text-[11px] text-text-muted font-mono">4,120 Pro Subscriptions</span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Total Transactions</span>
          <div className="text-2xl font-bold font-mono text-text-contrast">
            {ledgerPayments.length + 1420}
          </div>
          <span className="text-[11px] text-status-success font-mono">99.8% gateway uptime</span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Active Admins</span>
          <div className="text-2xl font-bold font-mono text-text-contrast">4 Core Admins</div>
          <span className="text-[11px] text-text-muted font-mono">All 2FA enforced</span>
        </div>
      </div>

      {/* Global Financial Ledger */}
      <div className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div>
            <h3 className="text-sm font-semibold text-text-contrast uppercase tracking-wider font-mono">
              Global Platform Financial Ledger
            </h3>
            <p className="text-xs text-text-muted">
              Live settlement audit of credit card gateways, manual checks, and corporate invoices.
            </p>
          </div>
          <span className="text-[11px] font-mono text-text-muted">
            {ledgerPayments.length} Active Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary text-text-muted uppercase text-[10px] font-mono tracking-wider border-b border-border-subtle">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Learner Identity</th>
                <th className="py-3 px-4">Enrolled Course / SaaS Plan</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Emergency Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary">
              {ledgerPayments.map((p) => (
                <tr key={p.id} className="hover:bg-surface-interactive/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-text-contrast">{p.orderNumber}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-text-primary">{p.userName}</div>
                    <div className="text-[11px] text-text-muted font-mono">{p.userEmail}</div>
                  </td>
                  <td className="py-3 px-4 text-text-primary font-medium truncate max-w-xs">
                    {p.courseTitle || p.subscriptionName}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-text-contrast">
                    ${p.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-mono uppercase text-[10px]">
                    {p.method === 'credit_card' ? 'Credit Card' : 'Check / Invoice'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        p.status === 'paid'
                          ? 'bg-status-success/15 text-status-success'
                          : p.status === 'pending'
                          ? 'bg-status-warning/15 text-status-warning'
                          : 'bg-status-danger/15 text-status-danger'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {p.status === 'paid' ? (
                      <button
                        onClick={() => handleRefund(p.id)}
                        className="px-2.5 py-1 rounded bg-surface-interactive hover:bg-status-danger/20 text-status-danger text-[11px] font-semibold transition-colors"
                      >
                        Refund Order
                      </button>
                    ) : (
                      <span className="text-text-muted text-[11px] font-mono">None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Administrator Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite New Administrator"
        footer={
          <button
            onClick={handleDispatchInvitation}
            disabled={!inviteEmail}
            className="px-4 py-2 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 disabled:opacity-40 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Provision Administrator Account
          </button>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-text-secondary font-medium">Administrator Email</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="admin.colleague@obsidian.edu"
              className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-primary-container"
            />
          </div>

          <div className="space-y-1">
            <label className="text-text-secondary font-medium">Administrative Department</label>
            <select
              value={adminRole}
              onChange={(e) => setAdminRole(e.target.value)}
              className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-primary-container"
            >
              <option value="Curriculum Moderator">Curriculum Quality & Moderation</option>
              <option value="Financial Auditor">Financial Ledger Auditor</option>
              <option value="Security Operations">Security & IP Telemetry Operations</option>
            </select>
          </div>

          <div className="p-3 rounded-lg bg-surface-secondary border border-border-subtle text-text-muted text-[11px]">
            New administrators will be issued a hardware-token registration email with required multi-factor authentication (MFA).
          </div>
        </div>
      </Modal>
    </div>
  );
};
