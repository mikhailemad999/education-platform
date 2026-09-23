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

export interface CartState {
  item: CartItem | null;
  couponCode: string;
  discountPercentage: number;
  paymentMethod: 'credit_card' | 'check';
  payments: Payment[];
  lastOrder: Payment | null;
}

export interface CartActions {
  setItem: (item: CartItem | null) => void;
  applyCoupon: (code: string) => boolean;
  setPaymentMethod: (method: 'credit_card' | 'check') => void;
  processPayment: (details: {
    userId: string;
    userName: string;
    userEmail: string;
    cardNumber?: string;
    checkNumber?: string;
  }) => Payment;
  approveCheckPayment: (paymentId: string) => void;
}

export type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  subscribeWithSelector((set, get) => ({
    item: {
      price: 89.99
    },
    couponCode: '',
    discountPercentage: 0,
    paymentMethod: 'credit_card',
    payments: MOCK_PAYMENTS,
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

    processPayment: (details) => {
      const state = get();
      const basePrice = state.item?.price || 89.99;
      const discount = (basePrice * state.discountPercentage) / 100;
      const finalAmount = Math.max(0, Number((basePrice - discount).toFixed(2)));

      const isCard = state.paymentMethod === 'credit_card';
      const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

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
        method: state.paymentMethod,
        status: isCard ? 'paid' : 'pending',
        checkNumber: details.checkNumber,
        transactionDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        invoiceUrl: '#'
      };

      set({
        payments: [newPayment, ...state.payments],
        lastOrder: newPayment
      });

      return newPayment;
    },

    approveCheckPayment: (paymentId: string) => {
      set((state) => ({
        payments: state.payments.map((p) =>
          p.id === paymentId ? { ...p, status: 'paid' as const } : p
        )
      }));
    }
  }))
);
