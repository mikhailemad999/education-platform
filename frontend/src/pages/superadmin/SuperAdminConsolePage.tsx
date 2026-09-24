import React, { useState } from 'react';
import { useCartStore } from '../../store';
import { Modal } from '../../components/common/Modal';
import { MOCK_ADMIN_STAFF } from '../../services/mockData';
import { AdminStaff } from '../../types';

export const SuperAdminConsolePage: React.FC = () => {
  const payments = useCartStore((state) => state.payments);
  const approveCheckPayment = useCartStore((state) => state.approveCheckPayment);
  const refundPayment = useCartStore((state) => state.refundPayment);

  const [activeTab, setActiveTab] = useState<'ledger' | 'staff'>('ledger');
  const [staffList, setStaffList] = useState<AdminStaff[]>(MOCK_ADMIN_STAFF);

  // Invite Admin State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteDept, setInviteDept] = useState('Curriculum Operations');
  const [inviteRoleTier, setInviteRoleTier] = useState<AdminStaff['roleTier']>('Curriculum Moderator');

  const [actionNotice, setActionNotice] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'refunded'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleDispatchInvitation = () => {
    if (!inviteEmail || !inviteName) return;

    const newAdmin: AdminStaff = {
      id: `adm-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      department: inviteDept,
      roleTier: inviteRoleTier,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      mfaEnabled: true,
      status: 'active',
      lastActive: 'Just now',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setStaffList([newAdmin, ...staffList]);
    setActionNotice(`Administrator "${newAdmin.name}" (${newAdmin.roleTier}) provisioned successfully. Hardware MFA registration dispatched.`);
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleToggleAdminStatus = (id: string) => {
    setStaffList((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === 'active' ? 'suspended' : 'active' } : a
      )
    );
    setActionNotice('Administrator access status updated.');
    setTimeout(() => setActionNotice(''), 3000);
  };

  const handleApprove = (id: string, orderNumber: string) => {
    approveCheckPayment(id);
    setActionNotice(`✓ Order ${orderNumber} approved! Student course access unlocked immediately.`);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleRefund = (id: string, orderNumber: string) => {
    refundPayment(id);
    setActionNotice(`✓ Order ${orderNumber} refunded. Access license revoked.`);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleExportCSV = () => {
    const headers = 'Order Number,Learner Name,Email,Course/Plan,Amount,Method,Status,Date\n';
    const rows = payments
      .map(
        (p) =>
          `"${p.orderNumber}","${p.userName}","${p.userEmail}","${p.courseTitle || p.subscriptionName || ''}","${p.amount}","${p.method}","${p.status}","${p.transactionDate}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `obsidian-financial-ledger-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredPayments = payments.filter((p) => {
    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      p.orderNumber.toLowerCase().includes(query) ||
      p.userName.toLowerCase().includes(query) ||
      p.userEmail.toLowerCase().includes(query) ||
      (p.courseTitle && p.courseTitle.toLowerCase().includes(query)) ||
      (p.checkNumber && p.checkNumber.toLowerCase().includes(query)) ||
      (p.wireReference && p.wireReference.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  const totalGross = payments
    .filter((p) => p.status === 'paid')
    .reduce((acc, p) => acc + p.amount, 0);

  const pendingCount = payments.filter((p) => p.status === 'pending').length;

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
              REALTIME GATEWAY SYNC ACTIVE
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-contrast tracking-tight flex items-center gap-3">
            Master Financial & Operations Core
            <span className="text-xs text-text-secondary px-2.5 py-0.5 rounded bg-surface-elevated font-mono">
              v4.18.2-prod
            </span>
          </h1>
          <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
            Global instructional governance, multi-channel settlement clearing, check/wire verification, and emergency financial controls.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-primary text-xs font-semibold border border-border-control transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2.5 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>Invite Administrator</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-status-success/10 border border-status-success/30 text-status-success text-xs flex items-center gap-2 animate-fade-in font-medium">
          <span className="material-symbols-outlined text-base font-bold">verified</span>
          <span>{actionNotice}</span>
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
          <span className="text-[11px] text-text-muted font-mono">4,120 Active Subscribers</span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Offline Queue</span>
          <div className="text-2xl font-bold font-mono text-status-warning">
            {pendingCount} Pending
          </div>
          <span className="text-[11px] text-text-muted font-mono">Checks & Wire Remittances</span>
        </div>

        <div className="bg-surface-card border border-border-standard rounded-xl p-5 space-y-1 shadow-sm">
          <span className="text-[11px] font-mono text-text-muted uppercase">Global Clearing Channels</span>
          <div className="text-2xl font-bold font-mono text-text-contrast">4 Channels</div>
          <span className="text-[11px] text-status-success font-mono">Card • PayPal • Wire • Check</span>
        </div>
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-border-standard pb-2">
        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'ledger'
              ? 'bg-primary-container text-white shadow-md'
              : 'bg-surface-secondary text-text-muted hover:text-text-contrast hover:bg-surface-interactive'
          }`}
        >
          <span className="material-symbols-outlined text-base">receipt_long</span>
          <span>Financial Settlement Ledger</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-black/20">
            {payments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'staff'
              ? 'bg-primary-container text-white shadow-md'
              : 'bg-surface-secondary text-text-muted hover:text-text-contrast hover:bg-surface-interactive'
          }`}
        >
          <span className="material-symbols-outlined text-base">admin_panel_settings</span>
          <span>Staff Governance & RBAC Directory</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-black/20">
            {staffList.length}
          </span>
        </button>
      </div>

      {/* Global Financial Ledger */}
      {activeTab === 'ledger' && (
      <div className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-5 shadow-xl animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border-subtle">
          <div>
            <h3 className="text-sm font-semibold text-text-contrast uppercase tracking-wider font-mono">
              Global Platform Financial Ledger
            </h3>
            <p className="text-xs text-text-muted">
              Live settlement audit of Stripe credit card transactions, PayPal captures, offline checks, and wire transfers.
            </p>
          </div>

          {/* Filter Pills & Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, emails, refs..."
                className="bg-surface-secondary border border-border-control rounded-lg px-3 py-1.5 text-xs text-text-primary font-mono focus:outline-none focus:border-primary-container pl-8 w-56"
              />
              <span className="material-symbols-outlined text-text-muted text-sm absolute left-2.5 top-2">
                search
              </span>
            </div>

            <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-lg border border-border-control text-[11px] font-mono">
              {(['all', 'paid', 'pending', 'refunded'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-2.5 py-1 rounded capitalize transition-all ${
                    filterStatus === s
                      ? 'bg-primary-container text-white font-bold shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary text-text-muted uppercase text-[10px] font-mono tracking-wider border-b border-border-subtle">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Learner Identity</th>
                <th className="py-3 px-4">Enrolled Course / SaaS Plan</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method & Ref</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary">
              {filteredPayments.map((p) => (
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
                  <td className="py-3 px-4 font-mono text-[10px]">
                    <div className="uppercase font-bold text-text-primary">
                      {p.method === 'credit_card'
                        ? 'Credit Card'
                        : p.method === 'paypal'
                        ? 'PayPal'
                        : p.method === 'bank_transfer'
                        ? 'Bank Wire'
                        : 'Check / PO'}
                    </div>
                    {p.checkNumber && <div className="text-status-warning">{p.checkNumber}</div>}
                    {p.wireReference && <div className="text-emerald-400">{p.wireReference}</div>}
                    {p.cardLast4 && <div className="text-text-muted">•••• {p.cardLast4}</div>}
                    {p.paypalEmail && <div className="text-sky-400">{p.paypalEmail}</div>}
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
                    <div className="flex items-center justify-end gap-2">
                      {p.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(p.id, p.orderNumber)}
                          className="px-2.5 py-1 rounded bg-status-success text-black font-bold text-[11px] hover:brightness-110 transition-colors shadow-sm flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs font-bold">check</span>
                          <span>Verify & Unlock</span>
                        </button>
                      )}
                      {p.status === 'paid' && (
                        <button
                          onClick={() => handleRefund(p.id, p.orderNumber)}
                          className="px-2.5 py-1 rounded bg-surface-interactive hover:bg-status-danger/20 text-status-danger text-[11px] font-semibold transition-colors"
                        >
                          Refund
                        </button>
                      )}
                      {p.status === 'refunded' && (
                        <span className="text-text-muted text-[11px] font-mono">Settled Refund</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Tab 2: Platform Administrators & Staff Governance */}
      {activeTab === 'staff' && (
        <div className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-5 shadow-xl animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border-subtle">
            <div>
              <h3 className="text-sm font-semibold text-text-contrast uppercase tracking-wider font-mono">
                Platform Administrators & Staff Governance (RBAC)
              </h3>
              <p className="text-xs text-text-muted">
                Manage internal administrative privileges, provision operations personnel, and enforce multi-factor security.
              </p>
            </div>

            <button
              onClick={() => setShowInviteModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
              <span>Provision Administrator</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary text-text-muted uppercase text-[10px] font-mono tracking-wider border-b border-border-subtle">
                <tr>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Department & Division</th>
                  <th className="py-3 px-4">Role Tier</th>
                  <th className="py-3 px-4">MFA Security</th>
                  <th className="py-3 px-4">Last Active</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-text-secondary">
                {staffList.map((adm) => (
                  <tr key={adm.id} className="hover:bg-surface-interactive/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={adm.avatar}
                          alt={adm.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-border-control"
                        />
                        <div>
                          <div className="font-semibold text-text-contrast">{adm.name}</div>
                          <div className="text-[11px] text-text-muted font-mono">{adm.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-text-contrast font-medium">
                      {adm.department}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary-container/20 text-primary border border-primary-container/30">
                        {adm.roleTier}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {adm.mfaEnabled ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-status-success font-mono font-semibold">
                          <span className="material-symbols-outlined text-xs">key</span>
                          <span>Hardware FIDO2</span>
                        </span>
                      ) : (
                        <span className="text-status-warning text-[11px] font-mono">Pending Enrollment</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-text-muted">
                      {adm.lastActive}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          adm.status === 'active'
                            ? 'bg-status-success/15 text-status-success'
                            : 'bg-status-error/15 text-status-error'
                        }`}
                      >
                        {adm.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleAdminStatus(adm.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                          adm.status === 'active'
                            ? 'bg-status-error/15 hover:bg-status-error/25 text-status-error'
                            : 'bg-status-success/15 hover:bg-status-success/25 text-status-success'
                        }`}
                      >
                        {adm.status === 'active' ? 'Suspend' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invite Administrator Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Provision Platform Administrator"
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-text-secondary font-medium">Administrator Full Name</label>
            <input
              type="text"
              required
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. Dr. Maya Lin"
              className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-primary-container"
            />
          </div>

          <div className="space-y-1">
            <label className="text-text-secondary font-medium">Official Email Address</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="maya.lin@obsidian.edu"
              className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-primary-container"
            />
          </div>

          <div className="space-y-1">
            <label className="text-text-secondary font-medium">Department / Division</label>
            <input
              type="text"
              value={inviteDept}
              onChange={(e) => setInviteDept(e.target.value)}
              placeholder="e.g. Curriculum Operations / Security QA"
              className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-primary-container"
            />
          </div>

          <div className="space-y-1">
            <label className="text-text-secondary font-medium">Role Tier & Security Clearance</label>
            <select
              value={inviteRoleTier}
              onChange={(e) => setInviteRoleTier(e.target.value as AdminStaff['roleTier'])}
              className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-primary-container"
            >
              <option value="Curriculum Moderator">Curriculum Moderator (Review & publish courses)</option>
              <option value="Operations Director">Operations Director (Instructor verification & platform stats)</option>
              <option value="Financial Settlement">Financial Settlement (Check & Wire clearing)</option>
              <option value="Security Auditor">Security Auditor (IP Telemetry & audit logs)</option>
            </select>
          </div>

          <div className="p-3 rounded-lg bg-surface-secondary border border-border-subtle text-text-muted text-[11px] leading-relaxed">
            Upon creation, an encrypted hardware-token enrollment link and temporary passkey will be securely transmitted to the administrator's official mailbox.
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="px-4 py-2 rounded-lg bg-surface-secondary text-text-muted hover:text-text-contrast"
            >
              Cancel
            </button>
            <button
              onClick={handleDispatchInvitation}
              disabled={!inviteEmail || !inviteName}
              className="px-4 py-2 rounded-lg bg-primary-container hover:brightness-110 active:scale-95 disabled:opacity-40 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>Provision Administrator</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
