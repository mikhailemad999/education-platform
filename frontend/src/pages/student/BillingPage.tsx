import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store';
import { Payment } from '../../types';
import { MOCK_USER_SUBSCRIPTION } from '../../services/mockData';
import { Modal } from '../../components/common/Modal';

export const BillingPage: React.FC = () => {
  const payments = useCartStore((state) => state.payments);
  const approveCheckPayment = useCartStore((state) => state.approveCheckPayment);

  const [selectedInvoice, setSelectedInvoice] = useState<Payment | null>(null);
  const [showUpdateCardModal, setShowUpdateCardModal] = useState(false);
  const [savedCardLast4, setSavedCardLast4] = useState('4242');
  const [savedCardBrand, setSavedCardBrand] = useState('VISA');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExp, setNewCardExp] = useState('');
  const [newCardCvc, setNewCardCvc] = useState('');

  const handleUpdatePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardNumber) {
      setSavedCardLast4(newCardNumber.slice(-4));
      setSavedCardBrand(newCardNumber.startsWith('5') ? 'MASTERCARD' : 'VISA');
    }
    setShowUpdateCardModal(false);
    setNewCardNumber('');
    setNewCardExp('');
    setNewCardCvc('');
  };

  const handleInstantClearInvoice = (paymentId: string) => {
    approveCheckPayment(paymentId);
    if (selectedInvoice && selectedInvoice.id === paymentId) {
      setSelectedInvoice({ ...selectedInvoice, status: 'paid' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div>
        <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
          Financial Records & Licensing
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
          Account Billing & Invoices
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Manage your active SaaS subscriptions, corporate billing profiles, and verifiable receipt invoices.
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
                {savedCardBrand}
              </div>
              <div className="text-xs font-mono text-text-contrast">•••• •••• •••• {savedCardLast4}</div>
            </div>
            <div className="text-[11px] text-text-muted mt-2">Expires 12/2028 • Default Payment</div>
          </div>

          <button
            onClick={() => setShowUpdateCardModal(true)}
            className="w-full py-2 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-secondary hover:text-text-primary text-xs font-semibold border border-border-control transition-colors"
          >
            Update Payment Method
          </button>
        </div>
      </div>

      {/* Invoices & Transactions History */}
      <div className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <div>
            <h3 className="text-sm font-semibold text-text-contrast uppercase tracking-wider font-mono">
              Transaction Invoices & Receipts
            </h3>
            <p className="text-xs text-text-muted">
              Official records for tax deductions, company expense reports, and audit trails.
            </p>
          </div>
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
                <th className="py-3 px-4 text-right">Invoice Action</th>
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
                    {p.method === 'credit_card'
                      ? 'Credit Card'
                      : p.method === 'paypal'
                      ? 'PayPal'
                      : p.method === 'bank_transfer'
                      ? 'Bank Wire'
                      : 'Check / PO'}
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
                      onClick={() => setSelectedInvoice(p)}
                      className="px-2.5 py-1 rounded bg-surface-interactive hover:bg-surface-elevated text-primary font-mono text-[11px] inline-flex items-center gap-1 border border-border-control transition-colors"
                    >
                      <span className="material-symbols-outlined text-xs">receipt</span>
                      <span>View Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Invoice Modal */}
      <Modal
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        title={`Official Invoice: ${selectedInvoice?.orderNumber}`}
        footer={
          <div className="flex items-center justify-between w-full">
            {selectedInvoice?.status === 'pending' ? (
              <button
                onClick={() => handleInstantClearInvoice(selectedInvoice.id)}
                className="px-3 py-1.5 rounded-lg bg-status-success text-black text-xs font-bold hover:brightness-110 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm font-bold">bolt</span>
                <span>Instant Clear with Card/PayPal</span>
              </button>
            ) : (
              <span className="text-[11px] text-text-muted font-mono">Tax ID: US-EIN-94-2819401</span>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-surface-interactive text-text-primary text-xs font-semibold flex items-center gap-1 border border-border-control"
              >
                <span className="material-symbols-outlined text-xs">print</span>
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-1.5 rounded-lg bg-primary-container text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        }
      >
        {selectedInvoice && (
          <div className="space-y-6 text-xs text-text-secondary font-sans p-2">
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-standard">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">token</span>
                  <span className="text-base font-bold text-text-contrast font-mono">
                    OBSIDIAN EDUCATION
                  </span>
                </div>
                <div className="text-[11px] text-text-muted mt-1 leading-relaxed">
                  Obsidian Education Systems Inc.<br />
                  500 Technology Square, Suite 400<br />
                  Cambridge, MA 02139 • USA
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1 font-mono text-[11px]">
                <div className="text-lg font-bold text-text-contrast">INVOICE</div>
                <div className="text-text-muted">Order: <strong>{selectedInvoice.orderNumber}</strong></div>
                <div className="text-text-muted">Date: {selectedInvoice.transactionDate}</div>
                <div>
                  Status:{' '}
                  <span
                    className={`px-2 py-0.5 rounded uppercase font-bold text-[10px] ${
                      selectedInvoice.status === 'paid'
                        ? 'bg-status-success/20 text-status-success'
                        : selectedInvoice.status === 'pending'
                        ? 'bg-status-warning/20 text-status-warning'
                        : 'bg-status-danger/20 text-status-danger'
                    }`}
                  >
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Bill To Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-secondary/40 p-4 rounded-xl border border-border-subtle">
              <div>
                <span className="text-[10px] uppercase font-mono text-text-muted font-bold">
                  Billed To
                </span>
                <div className="font-bold text-text-contrast mt-0.5">{selectedInvoice.userName}</div>
                <div className="text-[11px] text-text-muted font-mono">{selectedInvoice.userEmail}</div>
                {selectedInvoice.companyName && (
                  <div className="text-[11px] text-text-secondary mt-0.5">{selectedInvoice.companyName}</div>
                )}
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-text-muted font-bold">
                  Payment Instrument
                </span>
                <div className="font-mono text-text-contrast mt-0.5 uppercase">
                  {selectedInvoice.method.replace('_', ' ')}
                </div>
                {selectedInvoice.checkNumber && (
                  <div className="text-[11px] font-mono text-status-warning">
                    Ref: {selectedInvoice.checkNumber}
                  </div>
                )}
                {selectedInvoice.wireReference && (
                  <div className="text-[11px] font-mono text-emerald-400">
                    Wire Ref: {selectedInvoice.wireReference}
                  </div>
                )}
                {selectedInvoice.paypalEmail && (
                  <div className="text-[11px] font-mono text-sky-400">
                    PayPal: {selectedInvoice.paypalEmail}
                  </div>
                )}
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-border-standard text-[10px] font-mono uppercase text-text-muted">
                  <tr>
                    <th className="py-2">Item Description</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Rate</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  <tr>
                    <td className="py-3 font-medium text-text-contrast">
                      {selectedInvoice.courseTitle || selectedInvoice.subscriptionName}
                    </td>
                    <td className="py-3 text-center font-mono">1</td>
                    <td className="py-3 text-right font-mono">${selectedInvoice.amount.toFixed(2)}</td>
                    <td className="py-3 text-right font-mono font-bold text-text-contrast">
                      ${selectedInvoice.amount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Block */}
            <div className="flex justify-end pt-2 border-t border-border-standard">
              <div className="w-64 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal:</span>
                  <span>${selectedInvoice.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Estimated Tax (0%):</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-base font-bold text-text-contrast pt-1 border-t border-border-standard">
                  <span>Total Due:</span>
                  <span className="text-primary">${selectedInvoice.amount.toFixed(2)} USD</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Card Modal */}
      <Modal
        isOpen={showUpdateCardModal}
        onClose={() => setShowUpdateCardModal(false)}
        title="Update Default Payment Method"
        footer={
          <button
            type="submit"
            form="update-card-form"
            className="px-4 py-2 rounded-lg bg-primary-container text-white text-xs font-semibold"
          >
            Save Card on File
          </button>
        }
      >
        <form id="update-card-form" onSubmit={handleUpdatePaymentMethod} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-text-secondary font-medium">Card Number</label>
            <input
              type="text"
              value={newCardNumber}
              onChange={(e) => setNewCardNumber(e.target.value)}
              placeholder="4242 •••• •••• 4242"
              required
              className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 font-mono text-text-primary focus:outline-none focus:border-primary-container"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-text-secondary font-medium">Expiration</label>
              <input
                type="text"
                value={newCardExp}
                onChange={(e) => setNewCardExp(e.target.value)}
                placeholder="12/28"
                required
                className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 font-mono text-text-primary focus:outline-none focus:border-primary-container"
              />
            </div>
            <div className="space-y-1">
              <label className="text-text-secondary font-medium">CVC</label>
              <input
                type="password"
                value={newCardCvc}
                onChange={(e) => setNewCardCvc(e.target.value)}
                placeholder="888"
                required
                className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 font-mono text-text-primary focus:outline-none focus:border-primary-container"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
