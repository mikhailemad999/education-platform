import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useCartStore, useAuthStore, useLearningStore } from '../../store';
import { Modal } from '../../components/common/Modal';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const item = useCartStore((state) => state.item);
  const couponCode = useCartStore((state) => state.couponCode);
  const discountPercentage = useCartStore((state) => state.discountPercentage);
  const paymentMethod = useCartStore((state) => state.paymentMethod);
  const setPaymentMethod = useCartStore((state) => state.setPaymentMethod);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const processPayment = useCartStore((state) => state.processPayment);
  const enrollInCourse = useLearningStore((state) => state.enrollInCourse);

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [checkNumber, setCheckNumber] = useState('CHK-883921');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckInvoiceModal, setShowCheckInvoiceModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const basePrice = item?.price || 89.99;
  const discount = (basePrice * discountPercentage) / 100;
  const total = Math.max(0, Number((basePrice - discount).toFixed(2)));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const success = applyCoupon(inputCoupon);
    if (!success) {
      setCouponError('Invalid coupon. Try "ARCHITECT20" for 20% off.');
    } else {
      setCouponError('');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const payment = processPayment({
        userId: user?.id || 'user-student-1',
        userName: user?.name || 'Enrolled Student',
        userEmail: user?.email || 'student@engineer.io',
        cardNumber: paymentMethod === 'credit_card' ? cardNumber : undefined,
        checkNumber: paymentMethod === 'check' ? checkNumber : undefined
      });

      setCompletedOrder(payment);

      if (paymentMethod === 'credit_card') {
        // Instant enrollment
        if (item?.course?.id) {
          enrollInCourse(item.course.id, user?.id || 'user-student-1');
        }
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        // Pay by check opens invoice modal
        setShowCheckInvoiceModal(true);
      }
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="mb-8">
        <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
          Secure Settlement Gateway
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
          Complete Your Enrollment
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Select credit card for immediate cryptographic license activation, or check payment for institutional invoicing.
        </p>
      </div>

      {completedOrder && paymentMethod === 'credit_card' ? (
        /* Success Screen */
        <div className="bg-surface-card border border-border-standard rounded-2xl p-10 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-status-success/20 text-status-success mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">verified</span>
          </div>
          <h2 className="text-2xl font-bold text-text-contrast">Payment Succeeded!</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Your enrollment has been registered and course materials are fully unlocked. Order Number: <span className="font-mono text-text-contrast font-bold">{completedOrder.orderNumber}</span>
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link
              to="/my-courses"
              className="px-6 py-2.5 rounded-lg bg-primary-container text-white text-xs font-semibold hover:brightness-110 transition-all shadow-md"
            >
              Go to My Learning
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-lg bg-surface-interactive text-text-secondary hover:text-text-primary text-xs font-semibold"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      ) : (
        /* Checkout 2-Column Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Payment Method & Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Method Tabs */}
            <div className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-5">
              <h3 className="text-sm font-semibold text-text-contrast uppercase tracking-wider font-mono">
                1. Select Payment Method
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {/* Credit Card Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'bg-surface-elevated border-primary-container ring-1 ring-primary-container/30'
                      : 'bg-surface-secondary border-border-control hover:border-border-standard'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="material-symbols-outlined text-xl text-primary">credit_card</span>
                    <span className="text-[10px] font-mono font-bold text-status-success bg-status-success/15 px-2 py-0.5 rounded">
                      INSTANT ACCESS
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text-contrast">Credit / Debit Card</div>
                    <div className="text-[11px] text-text-muted mt-0.5">Visa, Mastercard, Amex</div>
                  </div>
                </button>

                {/* Check / Bank Invoice Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('check')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'check'
                      ? 'bg-surface-elevated border-primary-container ring-1 ring-primary-container/30'
                      : 'bg-surface-secondary border-border-control hover:border-border-standard'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="material-symbols-outlined text-xl text-status-warning">receipt_long</span>
                    <span className="text-[10px] font-mono font-bold text-status-warning bg-status-warning/15 px-2 py-0.5 rounded">
                      OFFLINE / PENDING
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text-contrast">Check / Corporate Invoice</div>
                    <div className="text-[11px] text-text-muted mt-0.5">Approved upon verification</div>
                  </div>
                </button>
              </div>

              {/* Method Forms */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-2">
                {paymentMethod === 'credit_card' ? (
                  <div className="space-y-3">
                    <div className="space-y-1 text-xs">
                      <label className="text-text-secondary font-medium">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-surface-secondary border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary font-mono focus:outline-none focus:border-primary-container"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-text-secondary font-medium">Expiration</label>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          className="w-full bg-surface-secondary border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary font-mono focus:outline-none focus:border-primary-container"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-text-secondary font-medium">CVC</label>
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full bg-surface-secondary border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary font-mono focus:outline-none focus:border-primary-container"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 bg-surface-secondary/50 p-4 rounded-xl border border-border-subtle text-xs">
                    <div className="space-y-1">
                      <label className="text-text-secondary font-medium">Check / Reference Number</label>
                      <input
                        type="text"
                        value={checkNumber}
                        onChange={(e) => setCheckNumber(e.target.value)}
                        placeholder="CHK-12345678"
                        className="w-full bg-surface-card border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary font-mono focus:outline-none focus:border-primary-container"
                      />
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed">
                      Submitting creates a pending invoice. An administrator will verify check receipt before activating your course access.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-12 rounded-lg bg-primary-container hover:brightness-110 active:scale-[0.98] text-white text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  {isProcessing ? (
                    <span>Processing Gateway Settlement...</span>
                  ) : (
                    <>
                      <span>{paymentMethod === 'credit_card' ? `Pay $${total.toFixed(2)}` : 'Submit Check Order'}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Order Summary (5 cols) */}
          <div className="lg:col-span-5 bg-surface-card border border-border-standard rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-semibold text-text-contrast uppercase tracking-wider font-mono">
              2. Order Summary
            </h3>

            {/* Course / Subscription Item */}
            <div className="flex items-start gap-4 pb-4 border-b border-border-subtle">
              <div className="w-16 h-12 rounded-lg bg-surface-secondary border border-border-standard flex items-center justify-center text-primary shrink-0 overflow-hidden">
                <span className="material-symbols-outlined text-xl">token</span>
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="text-xs font-bold text-text-contrast truncate">
                  {item?.course?.title || item?.subscriptionPlanName || 'Distributed Systems Masterclass'}
                </h4>
                <p className="text-[11px] text-text-muted font-mono">
                  Standard Enterprise License
                </p>
              </div>
              <span className="text-sm font-bold font-mono text-text-contrast ml-auto">
                ${basePrice.toFixed(2)}
              </span>
            </div>

            {/* Coupon Code Section */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  placeholder="Promo code (e.g. ARCHITECT20)"
                  className="w-full bg-surface-secondary border border-border-control rounded-lg px-3 py-2 text-xs text-text-primary font-mono focus:outline-none focus:border-primary-container uppercase"
                />
                <button
                  type="submit"
                  className="px-4 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-primary text-xs font-semibold border border-border-control shrink-0"
                >
                  Apply
                </button>
              </form>
              {couponError && <p className="text-[11px] text-status-danger mt-1.5">{couponError}</p>}
              {discountPercentage > 0 && (
                <p className="text-[11px] text-status-success mt-1.5 font-mono">
                  ✓ {couponCode} applied: {discountPercentage}% OFF saved!
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-text-secondary pt-2 border-t border-border-subtle">
              <div className="flex justify-between">
                <span>Original Price</span>
                <span className="font-mono text-text-contrast">${basePrice.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-status-success font-mono">
                  <span>Discount ({discountPercentage}%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-mono text-text-contrast">$0.00</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-text-contrast pt-3 border-t border-border-standard">
                <span>Total Due</span>
                <span className="text-xl text-primary font-mono">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pay By Check Pending Invoice Modal */}
      <Modal
        isOpen={showCheckInvoiceModal}
        onClose={() => {
          setShowCheckInvoiceModal(false);
          navigate('/account/billing');
        }}
        title="Check Payment Order Created (Pending)"
        footer={
          <button
            onClick={() => {
              setShowCheckInvoiceModal(false);
              navigate('/account/billing');
            }}
            className="px-4 py-2 rounded-lg bg-primary-container text-white text-xs font-semibold"
          >
            View Invoices
          </button>
        }
      >
        <div className="space-y-4 text-xs text-text-secondary">
          <div className="p-3 rounded-lg bg-status-warning/10 border border-status-warning/30 text-status-warning flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">info</span>
            <span>Order status is PENDING manual check verification.</span>
          </div>

          <div className="bg-surface-secondary p-4 rounded-xl border border-border-standard space-y-2 font-mono text-[11px]">
            <div><strong>Order #:</strong> {completedOrder?.orderNumber}</div>
            <div><strong>Amount:</strong> ${completedOrder?.amount.toFixed(2)} USD</div>
            <div><strong>Check Reference:</strong> {completedOrder?.checkNumber}</div>
            <div><strong>Payable to:</strong> Obsidian Education Systems Inc.</div>
            <div><strong>Remit Address:</strong> 500 Technology Square, Suite 400, Cambridge, MA 02139</div>
          </div>

          <p className="text-[11px] text-text-muted">
            Once our accounts team receives and matches your check, an administrator will approve the transaction in the console, immediately activating your course enrollment.
          </p>
        </div>
      </Modal>
    </div>
  );
};
