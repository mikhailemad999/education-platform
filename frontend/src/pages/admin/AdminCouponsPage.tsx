import React, { useState } from 'react';
import { useCartStore } from '../../store';
import { Coupon } from '../../types';
import { Modal } from '../../components/common/Modal';

export const AdminCouponsPage: React.FC = () => {
  const coupons = useCartStore((state) => state.coupons);
  const addCoupon = useCartStore((state) => state.addCoupon);
  const toggleCouponStatus = useCartStore((state) => state.toggleCouponStatus);
  const deleteCoupon = useCartStore((state) => state.deleteCoupon);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDiscountType, setNewDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [newDiscountValue, setNewDiscountValue] = useState(20);
  const [newMinPurchase, setNewMinPurchase] = useState(49);
  const [newMaxUses, setNewMaxUses] = useState(250);
  const [newExpiresAt, setNewExpiresAt] = useState('2026-12-31');
  const [newApplicableTo, setNewApplicableTo] = useState<'all' | 'courses' | 'subscriptions'>('all');
  const [createError, setCreateError] = useState('');

  // Delete Confirmation Modal
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    triggerToast(`Copied "${code}" to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newCode.trim().toUpperCase();

    if (!cleanCode) {
      setCreateError('Promo code cannot be empty.');
      return;
    }

    if (coupons.some((c) => c.code === cleanCode)) {
      setCreateError(`Promo code "${cleanCode}" already exists.`);
      return;
    }

    if (newDiscountValue <= 0) {
      setCreateError('Discount value must be greater than zero.');
      return;
    }

    if (newDiscountType === 'percentage' && newDiscountValue > 100) {
      setCreateError('Percentage discount cannot exceed 100%.');
      return;
    }

    addCoupon({
      code: cleanCode,
      description: newDescription || `${cleanCode} promotional discount`,
      discountType: newDiscountType,
      discountValue: Number(newDiscountValue),
      minPurchaseAmount: Number(newMinPurchase),
      maxUses: Number(newMaxUses),
      expiresAt: newExpiresAt,
      isActive: true,
      applicableTo: newApplicableTo
    });

    setIsCreateModalOpen(false);
    setNewCode('');
    setNewDescription('');
    setNewDiscountValue(20);
    setCreateError('');
    triggerToast(`Promo code "${cleanCode}" launched successfully!`);
  };

  const handleDeleteConfirm = () => {
    if (couponToDelete) {
      deleteCoupon(couponToDelete.id);
      triggerToast(`Campaign "${couponToDelete.code}" deleted.`);
      setCouponToDelete(null);
    }
  };

  // Filtered coupons
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && coupon.isActive) ||
      (statusFilter === 'inactive' && !coupon.isActive);

    return matchesSearch && matchesStatus;
  });

  // KPI calculations
  const totalActive = coupons.filter((c) => c.isActive).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.timesUsed, 0);
  const totalEstimatedDiscount = coupons.reduce((sum, c) => {
    const avgSavings = c.discountType === 'percentage' ? 24.5 : c.discountValue;
    return sum + c.timesUsed * avgSavings;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-surface-elevated text-text-contrast border border-primary-container px-4 py-2.5 rounded-xl shadow-2xl text-xs font-mono animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-standard">
        <div>
          <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
            Commercial Governance & Revenue
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
            Promotions & Coupons
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Configure promotional discount codes, manage redemption quotas, and monitor conversion velocity.
          </p>
        </div>

        <button
          onClick={() => {
            setCreateError('');
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-container hover:brightness-110 text-white text-xs font-semibold shadow-md transition-all shrink-0 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-surface-card border border-border-standard rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Active Campaigns</span>
            <span className="p-2 rounded-lg bg-status-success/10 text-status-success material-symbols-outlined text-base">
              local_offer
            </span>
          </div>
          <div className="text-2xl font-bold text-text-contrast font-mono">{totalActive}</div>
          <div className="text-[11px] text-text-muted">
            of {coupons.length} total registered vouchers
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-card border border-border-standard rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Total Redemptions</span>
            <span className="p-2 rounded-lg bg-primary-container/10 text-primary material-symbols-outlined text-base">
              redeem
            </span>
          </div>
          <div className="text-2xl font-bold text-text-contrast font-mono">
            {totalRedemptions.toLocaleString()}
          </div>
          <div className="text-[11px] text-status-success font-mono">
            ↑ +18.4% this quarter
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-card border border-border-standard rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Gross Savings Granted</span>
            <span className="p-2 rounded-lg bg-amber-500/10 text-status-warning material-symbols-outlined text-base">
              savings
            </span>
          </div>
          <div className="text-2xl font-bold text-text-contrast font-mono">
            ${Math.round(totalEstimatedDiscount).toLocaleString()}
          </div>
          <div className="text-[11px] text-text-muted">Direct commercial incentives</div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-card border border-border-standard rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">Conversion Lift</span>
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 material-symbols-outlined text-base">
              trending_up
            </span>
          </div>
          <div className="text-2xl font-bold text-text-contrast font-mono">+24.8%</div>
          <div className="text-[11px] text-text-muted">Checkout completion vs baseline</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-surface-card border border-border-standard rounded-2xl p-4 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupon code or campaign description..."
            className="w-full bg-surface-secondary border border-border-control rounded-xl pl-10 pr-4 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-container"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-surface-secondary p-1 rounded-xl border border-border-control shrink-0">
          {(['all', 'active', 'inactive'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === filter
                  ? 'bg-surface-elevated text-text-contrast shadow-sm border border-border-control'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {filter === 'all' ? `All (${coupons.length})` : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons List / Table */}
      <div className="bg-surface-card border border-border-standard rounded-2xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary/60 text-text-muted uppercase text-[10px] font-mono border-b border-border-standard tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Promo Code</th>
                <th className="py-3.5 px-6">Discount Value</th>
                <th className="py-3.5 px-6">Scope / Minimum</th>
                <th className="py-3.5 px-6">Redemption Usage</th>
                <th className="py-3.5 px-6">Expiration</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-text-muted">
                    <span className="material-symbols-outlined text-3xl mb-2 text-text-muted/60 block">
                      search_off
                    </span>
                    No promotional vouchers match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => {
                  const usagePct = Math.min(
                    100,
                    Math.round((coupon.timesUsed / coupon.maxUses) * 100)
                  );
                  const isExpired =
                    coupon.expiresAt &&
                    coupon.expiresAt < new Date().toISOString().split('T')[0];

                  return (
                    <tr
                      key={coupon.id}
                      className="hover:bg-surface-secondary/30 transition-colors"
                    >
                      {/* Code */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-surface-elevated border border-border-control font-mono font-bold text-primary text-xs tracking-wider">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            title="Copy code"
                            className="p-1 rounded hover:bg-surface-interactive text-text-muted hover:text-text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">
                              {copiedCode === coupon.code ? 'done' : 'content_copy'}
                            </span>
                          </button>
                        </div>
                        <p className="text-[11px] text-text-muted mt-1 max-w-xs truncate">
                          {coupon.description}
                        </p>
                      </td>

                      {/* Discount Value */}
                      <td className="py-4 px-6 font-mono">
                        <span className="text-sm font-bold text-text-contrast">
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}% OFF`
                            : `$${coupon.discountValue.toFixed(2)} OFF`}
                        </span>
                        <div className="text-[10px] text-text-muted uppercase">
                          {coupon.discountType === 'percentage' ? 'Percentage' : 'Fixed Credit'}
                        </div>
                      </td>

                      {/* Scope & Min */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-text-secondary capitalize">
                          <span className="material-symbols-outlined text-sm text-text-muted">
                            {coupon.applicableTo === 'subscriptions'
                              ? 'credit_card'
                              : coupon.applicableTo === 'courses'
                              ? 'school'
                              : 'store'}
                          </span>
                          <span>{coupon.applicableTo || 'All Catalog'}</span>
                        </div>
                        <div className="text-[10px] text-text-muted font-mono mt-0.5">
                          Min spend: ${coupon.minPurchaseAmount || 0}
                        </div>
                      </td>

                      {/* Usage */}
                      <td className="py-4 px-6 min-w-[160px]">
                        <div className="flex items-center justify-between text-[11px] font-mono text-text-muted mb-1">
                          <span>{coupon.timesUsed} used</span>
                          <span>{coupon.maxUses} cap</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              usagePct >= 90
                                ? 'bg-status-danger'
                                : usagePct >= 70
                                ? 'bg-status-warning'
                                : 'bg-primary-container'
                            }`}
                            style={{ width: `${usagePct}%` }}
                          ></div>
                        </div>
                      </td>

                      {/* Expiration */}
                      <td className="py-4 px-6 font-mono text-xs">
                        <span
                          className={
                            isExpired ? 'text-status-danger font-semibold' : 'text-text-secondary'
                          }
                        >
                          {coupon.expiresAt}
                        </span>
                        {isExpired && (
                          <div className="text-[10px] text-status-danger font-semibold">Expired</div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                            coupon.isActive && !isExpired
                              ? 'bg-status-success/15 text-status-success'
                              : 'bg-status-danger/15 text-status-danger'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              coupon.isActive && !isExpired
                                ? 'bg-status-success'
                                : 'bg-status-danger'
                            }`}
                          ></span>
                          {coupon.isActive && !isExpired ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleCouponStatus(coupon.id)}
                            title={coupon.isActive ? 'Pause Promotion' : 'Activate Promotion'}
                            className={`p-1.5 rounded-lg border text-xs transition-colors ${
                              coupon.isActive
                                ? 'bg-surface-secondary border-border-control text-text-muted hover:text-status-warning'
                                : 'bg-status-success/10 border-status-success/30 text-status-success hover:bg-status-success/20'
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {coupon.isActive ? 'pause' : 'play_arrow'}
                            </span>
                          </button>
                          <button
                            onClick={() => setCouponToDelete(coupon)}
                            title="Delete Promotion"
                            className="p-1.5 rounded-lg bg-surface-secondary border border-border-control text-text-muted hover:text-status-danger hover:border-status-danger/40 transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE COUPON MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Promotional Discount Code"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-surface-interactive text-text-secondary text-xs hover:text-text-primary"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateCoupon}
              className="px-4 py-2 rounded-lg bg-primary-container text-white text-xs font-bold shadow-md hover:brightness-110"
            >
              Launch Promotion
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
          {createError && (
            <div className="p-3 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-xs">
              {createError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-text-primary font-medium">Coupon Code *</label>
              <input
                type="text"
                required
                value={newCode}
                onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER50"
                className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 font-mono text-primary font-bold uppercase focus:outline-none focus:border-primary-container"
              />
            </div>

            <div className="space-y-1">
              <label className="text-text-primary font-medium">Discount Type</label>
              <select
                value={newDiscountType}
                onChange={(e) => setNewDiscountType(e.target.value as 'percentage' | 'fixed')}
                className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-primary-container"
              >
                <option value="percentage">Percentage Discount (%)</option>
                <option value="fixed">Fixed Dollar Credit ($)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-text-primary font-medium">
                {newDiscountType === 'percentage' ? 'Percentage (e.g. 25)' : 'Dollar Amount (e.g. 20)'} *
              </label>
              <input
                type="number"
                required
                min={1}
                max={newDiscountType === 'percentage' ? 100 : 1000}
                value={newDiscountValue}
                onChange={(e) => setNewDiscountValue(Number(e.target.value))}
                className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 font-mono text-text-primary focus:outline-none focus:border-primary-container"
              />
            </div>

            <div className="space-y-1">
              <label className="text-text-primary font-medium">Min Order Spend ($)</label>
              <input
                type="number"
                min={0}
                value={newMinPurchase}
                onChange={(e) => setNewMinPurchase(Number(e.target.value))}
                className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 font-mono text-text-primary focus:outline-none focus:border-primary-container"
              />
            </div>

            <div className="space-y-1">
              <label className="text-text-primary font-medium">Max Uses Cap</label>
              <input
                type="number"
                min={1}
                value={newMaxUses}
                onChange={(e) => setNewMaxUses(Number(e.target.value))}
                className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 font-mono text-text-primary focus:outline-none focus:border-primary-container"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-text-primary font-medium">Expiration Date</label>
              <input
                type="date"
                required
                value={newExpiresAt}
                onChange={(e) => setNewExpiresAt(e.target.value)}
                className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 font-mono text-text-primary focus:outline-none focus:border-primary-container"
              />
            </div>

            <div className="space-y-1">
              <label className="text-text-primary font-medium">Catalog Applicability</label>
              <select
                value={newApplicableTo}
                onChange={(e) => setNewApplicableTo(e.target.value as any)}
                className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-primary-container"
              >
                <option value="all">All Catalog (Courses & Subscriptions)</option>
                <option value="courses">Courses Only</option>
                <option value="subscriptions">Subscriptions Only</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-text-primary font-medium">Campaign Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="e.g. Black Friday Special 2026 for Dev Teams"
              className="w-full bg-surface-secondary border border-border-control rounded-lg p-2.5 text-text-primary focus:outline-none focus:border-primary-container"
            />
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={!!couponToDelete}
        onClose={() => setCouponToDelete(null)}
        title="Delete Promotional Campaign"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              onClick={() => setCouponToDelete(null)}
              className="px-3 py-1.5 rounded-lg bg-surface-interactive text-text-secondary text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded-lg bg-status-danger text-white text-xs font-bold shadow-md hover:brightness-110"
            >
              Confirm Deletion
            </button>
          </div>
        }
      >
        <div className="space-y-3 text-xs text-text-secondary">
          <p>
            Are you sure you want to permanently delete promotional code{' '}
            <strong className="text-text-contrast font-mono">{couponToDelete?.code}</strong>?
          </p>
          <div className="p-3 rounded-lg bg-status-danger/10 border border-status-danger/30 text-status-danger text-[11px]">
            Any checkout sessions actively referencing this code will immediately lose the discount.
          </div>
        </div>
      </Modal>
    </div>
  );
};
