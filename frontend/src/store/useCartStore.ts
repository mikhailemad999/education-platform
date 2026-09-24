import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Course, Payment, Coupon } from '../types';
import { MOCK_PAYMENTS, MOCK_COUPONS } from '../services/mockData';

export interface CartItem {
  course?: Course;
  subscriptionPlanId?: string;
  subscriptionPlanName?: string;
  price: number;
}

export type SupportedPaymentMethod = 'credit_card' | 'check' | 'paypal' | 'bank_transfer';

export interface CartState {
  item: CartItem | null;
  couponCode: string;
  discountPercentage: number;
  discountAmount: number;
  appliedCoupon: Coupon | null;
  coupons: Coupon[];
  paymentMethod: SupportedPaymentMethod;
  payments: Payment[];
  lastOrder: Payment | null;
}

export interface ProcessPaymentPayload {
  userId: string;
  userName: string;
  userEmail: string;
  cardNumber?: string;
  cardholderName?: string;
  checkNumber?: string;
  poNumber?: string;
  companyName?: string;
  paypalEmail?: string;
  wireReference?: string;
}

export interface CartActions {
  setItem: (item: CartItem | null) => void;
  applyCoupon: (code: string) => { success: boolean; message: string; discountAmount: number };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'timesUsed' | 'createdAt'>) => void;
  toggleCouponStatus: (id: string) => void;
  deleteCoupon: (id: string) => void;
  setPaymentMethod: (method: SupportedPaymentMethod) => void;
  processPayment: (details: ProcessPaymentPayload) => Promise<Payment>;
  approveCheckPayment: (paymentId: string) => void;
  refundPayment: (paymentId: string) => void;
}

export type CartStore = CartState & CartActions;

const STORAGE_KEY = 'obsidian_payments_ledger';
const COUPONS_STORAGE_KEY = 'obsidian_coupons_catalog';

const getInitialPayments = (): Payment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse cached payments ledger:', e);
  }
  return MOCK_PAYMENTS;
};

const savePayments = (payments: Payment[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
  } catch (e) {
    console.error('Failed to cache payments ledger:', e);
  }
};

const getInitialCoupons = (): Coupon[] => {
  try {
    const raw = localStorage.getItem(COUPONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse cached coupons catalog:', e);
  }
  return MOCK_COUPONS;
};

const saveCoupons = (coupons: Coupon[]) => {
  try {
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
  } catch (e) {
    console.error('Failed to cache coupons catalog:', e);
  }
};

export const useCartStore = create<CartStore>()(
  subscribeWithSelector((set, get) => ({
    item: {
      price: 89.99
    },
    couponCode: '',
    discountPercentage: 0,
    discountAmount: 0,
    appliedCoupon: null,
    coupons: getInitialCoupons(),
    paymentMethod: 'credit_card',
    payments: getInitialPayments(),
    lastOrder: null,

    setItem: (item) =>
      set({
        item,
        couponCode: '',
        discountPercentage: 0,
        discountAmount: 0,
        appliedCoupon: null
      }),

    applyCoupon: (code: string) => {
      const state = get();
      const trimmed = code.trim().toUpperCase();
      if (!trimmed) {
        return { success: false, message: 'Please enter a valid coupon or promo code.', discountAmount: 0 };
      }

      const coupon = state.coupons.find((c) => c.code.toUpperCase() === trimmed);
      if (!coupon) {
        return { success: false, message: `Promo code "${trimmed}" not recognized.`, discountAmount: 0 };
      }

      if (!coupon.isActive) {
        return { success: false, message: `Promo code "${trimmed}" is currently deactivated.`, discountAmount: 0 };
      }

      const now = new Date().toISOString().split('T')[0];
      if (coupon.expiresAt && coupon.expiresAt < now) {
        return { success: false, message: `Promo code "${trimmed}" expired on ${coupon.expiresAt}.`, discountAmount: 0 };
      }

      if (coupon.timesUsed >= coupon.maxUses) {
        return { success: false, message: `Promo code "${trimmed}" has reached maximum usage limit (${coupon.maxUses}).`, discountAmount: 0 };
      }

      const basePrice = state.item?.price || 89.99;
      if (coupon.minPurchaseAmount && basePrice < coupon.minPurchaseAmount) {
        return {
          success: false,
          message: `Minimum order amount of $${coupon.minPurchaseAmount} required for this promotion.`,
          discountAmount: 0
        };
      }

      let calculatedDiscount = 0;
      let calculatedPercentage = 0;

      if (coupon.discountType === 'percentage') {
        calculatedPercentage = coupon.discountValue;
        calculatedDiscount = Number(((basePrice * coupon.discountValue) / 100).toFixed(2));
      } else {
        calculatedDiscount = Math.min(basePrice, coupon.discountValue);
        calculatedPercentage = Math.round((calculatedDiscount / basePrice) * 100);
      }

      set({
        couponCode: trimmed,
        discountPercentage: calculatedPercentage,
        discountAmount: calculatedDiscount,
        appliedCoupon: coupon
      });

      return {
        success: true,
        message: `Voucher "${coupon.code}" applied: saved $${calculatedDiscount.toFixed(2)} (${coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `$${coupon.discountValue} voucher`})`,
        discountAmount: calculatedDiscount
      };
    },

    removeCoupon: () =>
      set({
        couponCode: '',
        discountPercentage: 0,
        discountAmount: 0,
        appliedCoupon: null
      }),

    addCoupon: (couponData) => {
      const state = get();
      const newCoupon: Coupon = {
        ...couponData,
        id: `coup-${Date.now()}`,
        code: couponData.code.trim().toUpperCase(),
        timesUsed: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      const updated = [newCoupon, ...state.coupons];
      saveCoupons(updated);
      set({ coupons: updated });
    },

    toggleCouponStatus: (id: string) => {
      const state = get();
      const updated = state.coupons.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      );
      saveCoupons(updated);
      set({ coupons: updated });
    },

    deleteCoupon: (id: string) => {
      const state = get();
      const updated = state.coupons.filter((c) => c.id !== id);
      saveCoupons(updated);
      set({ coupons: updated });
    },

    setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

    processPayment: async (details) => {
      const state = get();
      const basePrice = state.item?.price || 89.99;
      const discount = state.discountAmount > 0
        ? state.discountAmount
        : (basePrice * state.discountPercentage) / 100;
      const finalAmount = Math.max(0, Number((basePrice - discount).toFixed(2)));

      const method = state.paymentMethod;
      const isInstant = method === 'credit_card' || method === 'paypal';
      const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

      let cardLast4: string | undefined;
      if (details.cardNumber) {
        const clean = details.cardNumber.replace(/\D/g, '');
        cardLast4 = clean.slice(-4) || '4242';
      }

      const newPayment: Payment = {
        id: `pay-${Date.now()}`,
        orderNumber,
        userId: details.userId,
        userName: details.userName,
        userEmail: details.userEmail,
        courseId: state.item?.course?.id,
        courseTitle: state.item?.course?.title || 'Distributed Systems Masterclass',
        subscriptionId: state.item?.subscriptionPlanId,
        subscriptionName: state.item?.subscriptionPlanName,
        amount: finalAmount,
        currency: 'USD',
        method,
        status: isInstant ? 'paid' : 'pending',
        checkNumber: details.checkNumber,
        poNumber: details.poNumber,
        companyName: details.companyName,
        paypalEmail: details.paypalEmail,
        wireReference: details.wireReference,
        cardLast4,
        transactionDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        invoiceUrl: '#'
      };

      // Increment coupon usage if used
      if (state.appliedCoupon) {
        const updatedCoupons = state.coupons.map((c) =>
          c.id === state.appliedCoupon?.id ? { ...c, timesUsed: c.timesUsed + 1 } : c
        );
        saveCoupons(updatedCoupons);
        set({ coupons: updatedCoupons });
      }

      // Sync with backend if available
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        };

        const endpointMap: Record<SupportedPaymentMethod, string> = {
          credit_card: 'http://localhost:3001/api/payments/credit-card',
          paypal: 'http://localhost:3001/api/payments/paypal',
          check: 'http://localhost:3001/api/payments/check',
          bank_transfer: 'http://localhost:3001/api/payments/bank-transfer'
        };

        await fetch(endpointMap[method], {
          method: 'POST',
          headers,
          body: JSON.stringify({
            amount: finalAmount,
            courseId: state.item?.course?.id,
            subscriptionId: state.item?.subscriptionPlanId,
            ...details
          })
        }).catch(() => null);
      } catch (err) {
        // Fallback gracefully
      }

      const updatedPayments = [newPayment, ...state.payments];
      savePayments(updatedPayments);

      set({
        payments: updatedPayments,
        lastOrder: newPayment
      });

      return newPayment;
    },

    approveCheckPayment: (paymentId: string) => {
      set((state) => {
        const updated = state.payments.map((p) =>
          p.id === paymentId ? { ...p, status: 'paid' as const } : p
        );
        savePayments(updated);
        return { payments: updated };
      });
    },

    refundPayment: (paymentId: string) => {
      set((state) => {
        const updated = state.payments.map((p) =>
          p.id === paymentId ? { ...p, status: 'refunded' as const } : p
        );
        savePayments(updated);
        return { payments: updated };
      });
    }
  }))
);
