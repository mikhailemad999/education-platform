import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Course, Payment } from '../types';
import { MOCK_PAYMENTS } from '../services/mockData';

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
  applyCoupon: (code: string) => boolean;
  setPaymentMethod: (method: SupportedPaymentMethod) => void;
  processPayment: (details: ProcessPaymentPayload) => Promise<Payment>;
  approveCheckPayment: (paymentId: string) => void;
  refundPayment: (paymentId: string) => void;
}

export type CartStore = CartState & CartActions;

const STORAGE_KEY = 'obsidian_payments_ledger';

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

export const useCartStore = create<CartStore>()(
  subscribeWithSelector((set, get) => ({
    item: {
      price: 89.99
    },
    couponCode: '',
    discountPercentage: 0,
    paymentMethod: 'credit_card',
    payments: getInitialPayments(),
    lastOrder: null,

    setItem: (item) => set({ item, couponCode: '', discountPercentage: 0 }),

    applyCoupon: (code: string) => {
      const trimmed = code.trim().toUpperCase();
      if (trimmed === 'ARCHITECT20' || trimmed === 'OBSIDIAN20') {
        set({ couponCode: trimmed, discountPercentage: 20 });
        return true;
      }
      return false;
    },

    setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

    processPayment: async (details) => {
      const state = get();
      const basePrice = state.item?.price || 89.99;
      const discount = (basePrice * state.discountPercentage) / 100;
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

      // Attempt to sync with backend if running
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
        // Fallback gracefully to offline state
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
