import React from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store';
import { MOCK_USER_SUBSCRIPTION } from '../../services/mockData';

export const BillingPage: React.FC = () => {
  const payments = useCartStore((state) => state.payments);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div>
        <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
          Financial Records
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
          Account Billing & Invoices
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Manage your active SaaS subscriptions, corporate billing details, and receipt invoices.
        </p>
      </div>

      {/* Subscription Card & Payment Method on File */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Plan */}
        <div className="md:col-span-2 bg-surface-card border border-border-standard rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-md">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
                Active SaaS Tier
              </span>
              <h3 className="text-xl font-bold text-text-contrast">
                {MOCK_USER_SUBSCRIPTION.planName}
              </h3>
              <p className="text-xs text-text-secondary">
                Unlimited access to all engineering tracks and cloud sandboxes.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-status-success/15 text-status-success text-[11px] font-mono font-bold">
              ACTIVE (AUTO-RENEW)
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border-subtle text-xs">
            <div className="font-mono text-text-muted">
              Next billing date:{' '}
              <strong className="text-text-primary">{MOCK_USER_SUBSCRIPTION.endDate}</strong> ($
              {MOCK_USER_SUBSCRIPTION.price}/mo)
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/pricing"
                className="px-3.5 py-1.5 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-primary font-semibold text-xs border border-border-control transition-colors"
              >
                Change Tier
              </Link>
            </div>
          </div>
        </div>

        {/* Payment Method On File */}
        <div className="bg-surface-card border border-border-standard rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-md">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
              Default Method
            </span>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-10 h-7 rounded bg-surface-secondary border border-border-control flex items-center justify-center text-primary font-mono font-bold text-xs">
                VISA
              </div>
              <div className="text-xs font-mono text-text-contrast">•••• •••• •••• 4242</div>
            </div>
            <div className="text-[11px] text-text-muted mt-2">Expires 12/2028</div>
          </div>

          <button className="w-full py-2 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-secondary hover:text-text-primary text-xs font-semibold border border-border-control transition-colors">
            Update Card
          </button>
        </div>
      </div>

      {/* Invoices & Transactions History */}
      <div className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <h3 className="text-sm font-semibold text-text-contrast uppercase tracking-wider font-mono">
            Transaction Invoices & Receipts
          </h3>
          <span className="text-[11px] font-mono text-text-muted">
            {payments.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary text-text-muted uppercase text-[10px] font-mono tracking-wider border-b border-border-subtle">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-surface-interactive/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-text-contrast">
                    {p.orderNumber}
                  </td>
                  <td className="py-3 px-4 text-text-primary font-medium truncate max-w-xs">
                    {p.courseTitle || p.subscriptionName}
                  </td>
                  <td className="py-3 px-4 font-mono text-text-muted text-[11px]">
                    {p.transactionDate}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-text-contrast">
                    ${p.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 uppercase font-mono text-[10px]">
                    {p.method === 'credit_card' ? 'Card' : 'Check/Wire'}
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
                    <button
                      onClick={() => alert(`Downloading formal PDF receipt for ${p.orderNumber}...`)}
                      className="text-primary hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">download</span>
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
