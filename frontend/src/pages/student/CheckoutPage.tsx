import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useCartStore, useAuthStore, useLearningStore, SupportedPaymentMethod } from '../../store';
import { Modal } from '../../components/common/Modal';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const item = useCartStore((state) => state.item);
  const couponCode = useCartStore((state) => state.couponCode);
  const discountPercentage = useCartStore((state) => state.discountPercentage);
  const discountAmount = useCartStore((state) => state.discountAmount);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);
  const paymentMethod = useCartStore((state) => state.paymentMethod);
  const setPaymentMethod = useCartStore((state) => state.setPaymentMethod);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);
  const processPayment = useCartStore((state) => state.processPayment);
  const enrollInCourse = useLearningStore((state) => state.enrollInCourse);

  // Form states
  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  
  // Card state
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardHolder, setCardHolder] = useState(user?.name || 'Alex Rivera');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [enable3DSecureModal, setEnable3DSecureModal] = useState(false);
  const [otpCode, setOtpCode] = useState('749201');

  // PayPal state
  const [showPayPalModal, setShowPayPalModal] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState(user?.email || 'alex.rivera@engineer.io');

  // Check / PO state
  const [checkNumber, setCheckNumber] = useState('CHK-883921');
  const [poNumber, setPoNumber] = useState('PO-2026-ENG-491');
  const [companyName, setCompanyName] = useState('Starlight Cloud Systems Inc.');

  // Wire Transfer state
  const [wireReference, setWireReference] = useState('OBS-WIRE-77391');

  // Modal / Feedback state
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOfflineInstructionsModal, setShowOfflineInstructionsModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const basePrice = item?.price || 89.99;
  const discount = discountAmount > 0
    ? discountAmount
    : (basePrice * discountPercentage) / 100;
  const total = Math.max(0, Number((basePrice - discount).toFixed(2)));

  // Detect card brand
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (clean.startsWith('5')) return 'MASTERCARD';
    if (clean.startsWith('3')) return 'AMEX';
    return 'CREDIT CARD';
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const result = applyCoupon(inputCoupon);
    if (!result.success) {
      setCouponError(result.message);
    } else {
      setCouponError('');
    }
  };

  const fillTestCard = (type: 'visa' | 'mastercard') => {
    if (type === 'visa') {
      setCardNumber('4242 4242 4242 4242');
      setCardExp('12/28');
      setCardCvc('888');
    } else {
      setCardNumber('5555 4444 3333 2222');
      setCardExp('09/27');
      setCardCvc('999');
    }
  };

  const executeOrder = async (overrideMethod?: SupportedPaymentMethod) => {
    const methodToUse = overrideMethod || paymentMethod;
    setIsProcessing(true);

    try {
      const payment = await processPayment({
        userId: user?.id || 'user-student-1',
        userName: user?.name || 'Enrolled Student',
        userEmail: user?.email || 'student@engineer.io',
        cardNumber: methodToUse === 'credit_card' ? cardNumber : undefined,
        cardholderName: cardHolder,
        checkNumber: methodToUse === 'check' ? checkNumber : undefined,
        poNumber: methodToUse === 'check' ? poNumber : undefined,
        companyName: companyName,
        paypalEmail: methodToUse === 'paypal' ? paypalEmail : undefined,
        wireReference: methodToUse === 'bank_transfer' ? wireReference : undefined,
      });

      setCompletedOrder(payment);

      if (methodToUse === 'credit_card' || methodToUse === 'paypal') {
        // Instant course enrollment
        if (item?.course?.id) {
          enrollInCourse(item.course.id, user?.id || 'user-student-1');
        }
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        // Offline check or wire modal instructions
        setShowOfflineInstructionsModal(true);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'credit_card') {
      // Simulate 3D-Secure 2FA
      setEnable3DSecureModal(true);
    } else if (paymentMethod === 'paypal') {
      setShowPayPalModal(true);
    } else {
      executeOrder();
    }
  };

  const handleConfirm3DSecure = () => {
    setEnable3DSecureModal(false);
    executeOrder('credit_card');
  };

  const handleConfirmPayPal = () => {
    setShowPayPalModal(false);
    executeOrder('paypal');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="mb-8">
        <span className="text-[11px] font-mono text-primary uppercase tracking-wider font-semibold">
          Financial Clearing & Licensing Hub
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-contrast tracking-tight mt-1">
          Complete Your Enrollment
        </h1>
        <p className="text-xs text-text-muted mt-1">
          Select your preferred payment channel: instant cryptographic activation (Card/PayPal) or institutional clearance (Check/Wire).
        </p>
      </div>

      {completedOrder && (completedOrder.method === 'credit_card' || completedOrder.method === 'paypal') ? (
        /* Instant Success Screen */
        <div className="bg-surface-card border border-border-standard rounded-2xl p-10 text-center space-y-5 max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-status-success/20 text-status-success mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl font-bold">verified</span>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-text-contrast">Payment Succeeded!</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Cryptographic license issued via <strong className="text-text-primary uppercase font-mono">{completedOrder.method.replace('_', ' ')}</strong>. Course curriculum is completely unlocked.
            </p>
          </div>

          <div className="bg-surface-secondary p-4 rounded-xl border border-border-subtle text-left text-xs font-mono space-y-1.5">
            <div className="flex justify-between">
              <span className="text-text-muted">Order Number:</span>
              <span className="font-bold text-text-contrast">{completedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Amount Settled:</span>
              <span className="font-bold text-primary">${completedOrder.amount.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Licensing Timestamp:</span>
              <span className="text-text-secondary">{completedOrder.transactionDate}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-4">
            <Link
              to="/my-courses"
              className="px-6 py-2.5 rounded-lg bg-primary-container text-white text-xs font-semibold hover:brightness-110 transition-all shadow-md"
            >
              Enter Learning Player
            </Link>
            <Link
              to="/account/billing"
              className="px-5 py-2.5 rounded-lg bg-surface-interactive text-text-secondary hover:text-text-primary text-xs font-semibold border border-border-control"
            >
              View Invoices & Receipts
            </Link>
          </div>
        </div>
      ) : (
        /* Checkout 2-Column Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 4 Payment Methods & Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface-card border border-border-standard rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-contrast uppercase tracking-wider font-mono">
                  1. Payment Settlement Method
                </h3>
                <span className="text-[11px] font-mono text-text-muted flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-status-success">lock</span>
                  256-Bit SSL Encrypted
                </span>
              </div>

              {/* 4 Method Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Credit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'bg-surface-elevated border-primary-container ring-1 ring-primary-container/40'
                      : 'bg-surface-secondary border-border-control hover:border-border-standard'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="material-symbols-outlined text-xl text-primary">credit_card</span>
                    <span className="text-[10px] font-mono font-bold text-status-success bg-status-success/15 px-2 py-0.5 rounded">
                      INSTANT
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text-contrast">Credit / Debit Card</div>
                    <div className="text-[11px] text-text-muted mt-0.5">Visa, Mastercard, Amex, JCB</div>
                  </div>
                </button>

                {/* 2. PayPal */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'paypal'
                      ? 'bg-surface-elevated border-primary-container ring-1 ring-primary-container/40'
                      : 'bg-surface-secondary border-border-control hover:border-border-standard'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-bold text-sky-400 font-mono text-base tracking-tighter">
                      Pay<span className="text-blue-500">Pal</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-status-success bg-status-success/15 px-2 py-0.5 rounded">
                      EXPRESS
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text-contrast">PayPal Wallet</div>
                    <div className="text-[11px] text-text-muted mt-0.5">One-click global checkout</div>
                  </div>
                </button>

                {/* 3. Check / Institutional PO */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('check')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'check'
                      ? 'bg-surface-elevated border-primary-container ring-1 ring-primary-container/40'
                      : 'bg-surface-secondary border-border-control hover:border-border-standard'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="material-symbols-outlined text-xl text-status-warning">receipt_long</span>
                    <span className="text-[10px] font-mono font-bold text-status-warning bg-status-warning/15 px-2 py-0.5 rounded">
                      INVOICE / PO
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text-contrast">Corporate Check / PO</div>
                    <div className="text-[11px] text-text-muted mt-0.5">Institutional accounts payable</div>
                  </div>
                </button>

                {/* 4. Bank Wire / ACH */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-surface-elevated border-primary-container ring-1 ring-primary-container/40'
                      : 'bg-surface-secondary border-border-control hover:border-border-standard'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="material-symbols-outlined text-xl text-emerald-400">account_balance</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">
                      WIRE / ACH
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text-contrast">Direct Bank Wire</div>
                    <div className="text-[11px] text-text-muted mt-0.5">Fedwire, SWIFT, SEPA transfers</div>
                  </div>
                </button>
              </div>

              {/* Dynamic Payment Details Forms */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-2">
                {/* 1. CREDIT CARD FORM */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4 bg-surface-secondary/40 p-4 rounded-xl border border-border-subtle">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-text-secondary font-medium">Card Brand:</span>
                        <span className="px-2 py-0.5 rounded bg-surface-elevated font-mono font-bold text-primary text-[10px] border border-border-control">
                          {getCardBrand(cardNumber)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fillTestCard('visa')}
                          className="text-[10px] font-mono text-text-muted hover:text-primary transition-colors underline"
                        >
                          Use Test Visa
                        </button>
                        <button
                          type="button"
                          onClick={() => fillTestCard('mastercard')}
                          className="text-[10px] font-mono text-text-muted hover:text-primary transition-colors underline"
                        >
                          Use Test Mastercard
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-text-secondary font-medium">Cardholder Full Name</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Alex Rivera"
                        required
                        className="w-full bg-surface-card border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary focus:outline-none focus:border-primary-container"
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-text-secondary font-medium">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          required
                          className="w-full bg-surface-card border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary font-mono focus:outline-none focus:border-primary-container pl-10"
                        />
                        <span className="material-symbols-outlined text-text-muted text-base absolute left-3 top-3">
                          credit_card
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-text-secondary font-medium">Expiration (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          placeholder="12/28"
                          required
                          className="w-full bg-surface-card border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary font-mono focus:outline-none focus:border-primary-container"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-text-secondary font-medium">CVC / CVV</label>
                        <input
                          type="password"
                          value={cardCvc}
                          maxLength={4}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="888"
                          required
                          className="w-full bg-surface-card border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary font-mono focus:outline-none focus:border-primary-container"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PAYPAL EXPRESS FORM */}
                {paymentMethod === 'paypal' && (
                  <div className="space-y-4 bg-surface-secondary/40 p-4 rounded-xl border border-border-subtle text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg font-mono">
                        P
                      </div>
                      <div>
                        <div className="font-bold text-text-contrast">Express Wallet Settlement</div>
                        <div className="text-[11px] text-text-muted">
                          Authenticate via PayPal modal and charge to balance or connected bank account.
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-text-secondary font-medium">PayPal Account Email</label>
                      <input
                        type="email"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                        required
                        className="w-full bg-surface-card border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary font-mono focus:outline-none focus:border-primary-container"
                      />
                    </div>
                  </div>
                )}

                {/* 3. CHECK / PO FORM */}
                {paymentMethod === 'check' && (
                  <div className="space-y-3 bg-surface-secondary/40 p-4 rounded-xl border border-border-subtle text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-text-secondary font-medium">Check / Draft Reference #</label>
                        <input
                          type="text"
                          value={checkNumber}
                          onChange={(e) => setCheckNumber(e.target.value)}
                          required
                          className="w-full bg-surface-card border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary font-mono focus:outline-none focus:border-primary-container"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-text-secondary font-medium">Purchase Order (PO) #</label>
                        <input
                          type="text"
                          value={poNumber}
                          onChange={(e) => setPoNumber(e.target.value)}
                          className="w-full bg-surface-card border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary font-mono focus:outline-none focus:border-primary-container"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-text-secondary font-medium">Institution / Corporate Entity</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        className="w-full bg-surface-card border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary focus:outline-none focus:border-primary-container"
                      />
                    </div>

                    <p className="text-[11px] text-text-muted leading-relaxed">
                      Submitting initiates an invoice and places enrollment in <strong>Pending Verification</strong> status until matched by platform administration.
                    </p>
                  </div>
                )}

                {/* 4. BANK WIRE FORM */}
                {paymentMethod === 'bank_transfer' && (
                  <div className="space-y-4 bg-surface-secondary/40 p-4 rounded-xl border border-border-subtle text-xs">
                    <div className="bg-surface-card p-3 rounded-lg border border-border-standard font-mono text-[11px] space-y-1 text-text-muted">
                      <div><strong className="text-text-contrast">Beneficiary:</strong> Obsidian Education Systems Inc.</div>
                      <div><strong className="text-text-contrast">Bank:</strong> JPMorgan Chase Bank, N.A., New York</div>
                      <div><strong className="text-text-contrast">SWIFT/BIC:</strong> CHASUS33XXX</div>
                      <div><strong className="text-text-contrast">IBAN:</strong> US89CHAS12345678901234</div>
                      <div><strong className="text-text-contrast">Remittance Wire Ref:</strong> <span className="text-primary font-bold">{wireReference}</span></div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-text-secondary font-medium">Your Wire Transfer Reference</label>
                      <input
                        type="text"
                        value={wireReference}
                        onChange={(e) => setWireReference(e.target.value)}
                        required
                        className="w-full bg-surface-card border border-border-control rounded-lg px-3.5 py-2.5 text-text-primary font-mono focus:outline-none focus:border-primary-container"
                      />
                    </div>
                  </div>
                )}

                {/* Primary Action Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-12 rounded-lg bg-primary-container hover:brightness-110 active:scale-[0.98] text-white text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  {isProcessing ? (
                    <span>Processing Clearing Settlement...</span>
                  ) : paymentMethod === 'paypal' ? (
                    <span className="flex items-center gap-1.5 font-bold">
                      <span>Continue with PayPal</span>
                      <span className="font-mono text-sm">(${total.toFixed(2)})</span>
                    </span>
                  ) : paymentMethod === 'credit_card' ? (
                    <>
                      <span>Pay ${total.toFixed(2)} USD</span>
                      <span className="material-symbols-outlined text-sm">lock</span>
                    </>
                  ) : (
                    <>
                      <span>Submit {paymentMethod === 'check' ? 'Corporate Invoice Order' : 'Wire Notification'}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Order Summary (5 cols) */}
          <div className="lg:col-span-5 bg-surface-card border border-border-standard rounded-2xl p-6 space-y-6 shadow-xl">
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
                  {item?.subscriptionPlanId ? 'Monthly SaaS Recurring Tier' : 'Perpetual Commercial Engineering License'}
                </p>
              </div>
              <span className="text-sm font-bold font-mono text-text-contrast ml-auto">
                ${basePrice.toFixed(2)}
              </span>
            </div>

            {/* Coupon Code Section */}
            <div>
              {!couponCode ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Promo code (e.g. ARCHITECT20, OBSIDIAN50)"
                    className="w-full bg-surface-secondary border border-border-control rounded-lg px-3 py-2 text-xs text-text-primary font-mono focus:outline-none focus:border-primary-container uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 rounded-lg bg-surface-interactive hover:bg-surface-elevated text-text-primary text-xs font-semibold border border-border-control shrink-0"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-status-success/10 border border-status-success/30 text-xs text-status-success font-mono">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">local_offer</span>
                    <div>
                      <span className="font-bold">{couponCode}</span>
                      <span className="text-[11px] text-text-muted ml-1.5">
                        (-${discount.toFixed(2)} savings)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      removeCoupon();
                      setInputCoupon('');
                    }}
                    title="Remove coupon"
                    className="p-1 rounded hover:bg-status-danger/20 text-text-muted hover:text-status-danger transition-colors flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              )}
              {couponError && <p className="text-[11px] text-status-danger mt-1.5">{couponError}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-text-secondary pt-2 border-t border-border-subtle">
              <div className="flex justify-between">
                <span>Original Subtotal</span>
                <span className="font-mono text-text-contrast">${basePrice.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-status-success font-mono">
                  <span>Discount ({discountPercentage}%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax / VAT (0%)</span>
                <span className="font-mono text-text-contrast">$0.00</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-text-contrast pt-3 border-t border-border-standard">
                <span>Total Due</span>
                <span className="text-xl text-primary font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-border-subtle space-y-2.5 text-[11px] text-text-muted font-mono">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-status-success">verified_user</span>
                <span>30-Day Money-Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary">workspace_premium</span>
                <span>Verifiable Cryptographic Certificate Included</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-text-muted">schedule</span>
                <span>Full Lifetime Access & Curriculum Updates</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D-Secure 2FA Simulation Modal */}
      <Modal
        isOpen={enable3DSecureModal}
        onClose={() => setEnable3DSecureModal(false)}
        title="3D-Secure 2.0 Cardholder Verification"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              onClick={() => setEnable3DSecureModal(false)}
              className="px-3 py-1.5 rounded-lg bg-surface-interactive text-text-secondary text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm3DSecure}
              className="px-4 py-2 rounded-lg bg-primary-container text-white text-xs font-bold"
            >
              Verify & Authorize ${total.toFixed(2)}
            </button>
          </div>
        }
      >
        <div className="space-y-4 text-xs text-text-secondary">
          <div className="p-3 rounded-lg bg-primary-container/10 border border-primary-container/30 text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-base">shield</span>
            <span>Issuing bank authentication challenge for card ending in {cardNumber.slice(-4)}.</span>
          </div>

          <p className="text-[11px] text-text-muted">
            A one-time passcode has been generated for demo authentication. Enter the verification code to complete settlement:
          </p>

          <div className="space-y-1">
            <label className="text-text-primary font-medium">One-Time Passcode (OTP)</label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full bg-surface-card border border-border-control rounded-lg p-2.5 font-mono text-center tracking-widest text-base text-primary font-bold"
            />
          </div>
        </div>
      </Modal>

      {/* PayPal Authentication Modal */}
      <Modal
        isOpen={showPayPalModal}
        onClose={() => setShowPayPalModal(false)}
        title="PayPal Express Settlement"
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <button
              onClick={() => setShowPayPalModal(false)}
              className="px-3 py-1.5 rounded-lg bg-surface-interactive text-text-secondary text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPayPal}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors"
            >
              Agree & Pay ${total.toFixed(2)} USD
            </button>
          </div>
        }
      >
        <div className="space-y-4 text-xs text-text-secondary">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-secondary border border-border-control">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg font-mono">
              P
            </div>
            <div>
              <div className="font-bold text-text-contrast">{paypalEmail}</div>
              <div className="text-[11px] text-text-muted">Connected PayPal Balance ($2,840.50 USD)</div>
            </div>
          </div>

          <div className="space-y-2 border-t border-border-subtle pt-3">
            <div className="flex justify-between">
              <span>Merchant</span>
              <span className="font-semibold text-text-contrast">Obsidian Education Systems Inc.</span>
            </div>
            <div className="flex justify-between">
              <span>Settlement Total</span>
              <span className="font-mono font-bold text-primary">${total.toFixed(2)} USD</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Pay By Check / Wire Offline Instructions Modal */}
      <Modal
        isOpen={showOfflineInstructionsModal}
        onClose={() => {
          setShowOfflineInstructionsModal(false);
          navigate('/account/billing');
        }}
        title={`${paymentMethod === 'check' ? 'Check Order' : 'Wire Transfer'} Registered (Pending Verification)`}
        footer={
          <button
            onClick={() => {
              setShowOfflineInstructionsModal(false);
              navigate('/account/billing');
            }}
            className="px-4 py-2 rounded-lg bg-primary-container text-white text-xs font-semibold"
          >
            Go to Billing & Invoices
          </button>
        }
      >
        <div className="space-y-4 text-xs text-text-secondary">
          <div className="p-3 rounded-lg bg-status-warning/10 border border-status-warning/30 text-status-warning flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">info</span>
            <span>Order registered in PENDING status. An administrator will verify receipt to unlock course access.</span>
          </div>

          <div className="bg-surface-secondary p-4 rounded-xl border border-border-standard space-y-2 font-mono text-[11px]">
            <div><strong>Order #:</strong> {completedOrder?.orderNumber}</div>
            <div><strong>Amount Due:</strong> ${completedOrder?.amount.toFixed(2)} USD</div>
            {completedOrder?.checkNumber && <div><strong>Check Reference:</strong> {completedOrder?.checkNumber}</div>}
            {completedOrder?.wireReference && <div><strong>Wire Reference:</strong> {completedOrder?.wireReference}</div>}
            <div><strong>Payable to:</strong> Obsidian Education Systems Inc.</div>
            <div><strong>Remit Address:</strong> 500 Technology Square, Cambridge, MA 02139</div>
          </div>

          <p className="text-[11px] text-text-muted">
            You can view this invoice or download a formal PDF under your account billing console.
          </p>
        </div>
      </Modal>
    </div>
  );
};
