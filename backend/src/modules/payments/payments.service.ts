import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, PaymentEntity } from '../../database/database.service';

@Injectable()
export class PaymentsService {
  constructor(private db: DatabaseService) {}

  async processCreditCard(body: {
    userId: string;
    userName: string;
    userEmail: string;
    courseId?: string;
    subscriptionId?: string;
    amount: number;
    token?: string;
  }) {
    const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPayment: PaymentEntity = {
      id: `pay-${Date.now()}`,
      order_number: orderNumber,
      user_id: body.userId,
      user_name: body.userName,
      user_email: body.userEmail,
      course_id: body.courseId,
      subscription_id: body.subscriptionId,
      amount: body.amount,
      currency: 'USD',
      method: 'credit_card',
      status: 'paid',
      transaction_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    this.db.payments.unshift(newPayment);

    // If for a course, enroll immediately
    if (body.courseId) {
      const existing = this.db.enrollments.find(
        (e) => e.user_id === body.userId && e.course_id === body.courseId,
      );
      if (!existing) {
        this.db.enrollments.push({
          id: `enroll-${Date.now()}`,
          user_id: body.userId,
          course_id: body.courseId,
          status: 'active',
          enrolled_at: new Date().toISOString().split('T')[0],
          progress_percentage: 0,
          completed_lecture_ids: [],
        });
      }
    }

    return {
      payment: newPayment,
      message: 'Payment charged successfully. Course access granted immediately.',
    };
  }

  async processCheck(body: {
    userId: string;
    userName: string;
    userEmail: string;
    courseId?: string;
    subscriptionId?: string;
    amount: number;
    checkNumber?: string;
  }) {
    const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPayment: PaymentEntity = {
      id: `pay-${Date.now()}`,
      order_number: orderNumber,
      user_id: body.userId,
      user_name: body.userName,
      user_email: body.userEmail,
      course_id: body.courseId,
      subscription_id: body.subscriptionId,
      amount: body.amount,
      currency: 'USD',
      method: 'check',
      status: 'pending',
      check_number: body.checkNumber || `CHK-${Math.floor(100000 + Math.random() * 900000)}`,
      transaction_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    this.db.payments.unshift(newPayment);

    return {
      payment: newPayment,
      message: 'Pay-by-check order registered. Pending admin verification upon receipt of check.',
      invoiceInstructions: {
        payableTo: 'Obsidian Education Systems Inc.',
        orderNumber: newPayment.order_number,
        remittanceAddress: '500 Technology Square, Suite 400, Cambridge, MA 02139',
      },
    };
  }

  async processPayPal(body: {
    userId: string;
    userName: string;
    userEmail: string;
    courseId?: string;
    subscriptionId?: string;
    amount: number;
    paypalEmail?: string;
    paypalOrderId?: string;
  }) {
    const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const newPayment: PaymentEntity = {
      id: `pay-${Date.now()}`,
      order_number: orderNumber,
      user_id: body.userId,
      user_name: body.userName,
      user_email: body.userEmail,
      course_id: body.courseId,
      subscription_id: body.subscriptionId,
      amount: body.amount,
      currency: 'USD',
      method: 'paypal',
      status: 'paid',
      paypal_email: body.paypalEmail || body.userEmail,
      transaction_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    this.db.payments.unshift(newPayment);

    // If for a course, enroll immediately
    if (body.courseId) {
      const existing = this.db.enrollments.find(
        (e) => e.user_id === body.userId && e.course_id === body.courseId,
      );
      if (!existing) {
        this.db.enrollments.push({
          id: `enroll-${Date.now()}`,
          user_id: body.userId,
          course_id: body.courseId,
          status: 'active',
          enrolled_at: new Date().toISOString().split('T')[0],
          progress_percentage: 0,
          completed_lecture_ids: [],
        });
      }
    }

    return {
      payment: newPayment,
      message: 'PayPal payment captured successfully. Course access granted immediately.',
    };
  }

  async processBankTransfer(body: {
    userId: string;
    userName: string;
    userEmail: string;
    courseId?: string;
    subscriptionId?: string;
    amount: number;
    wireReference?: string;
    companyName?: string;
  }) {
    const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const wireRef = body.wireReference || `WIRE-${Math.floor(100000 + Math.random() * 900000)}`;
    const newPayment: PaymentEntity = {
      id: `pay-${Date.now()}`,
      order_number: orderNumber,
      user_id: body.userId,
      user_name: body.userName,
      user_email: body.userEmail,
      course_id: body.courseId,
      subscription_id: body.subscriptionId,
      amount: body.amount,
      currency: 'USD',
      method: 'bank_transfer',
      status: 'pending',
      wire_reference: wireRef,
      company_name: body.companyName,
      transaction_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    this.db.payments.unshift(newPayment);

    return {
      payment: newPayment,
      message: 'Wire transfer registered. Course access will activate upon bank reconciliation.',
      wireInstructions: {
        beneficiary: 'Obsidian Education Systems Inc.',
        bank: 'JPMorgan Chase Bank, N.A., New York',
        swift: 'CHASUS33XXX',
        iban: 'US89CHAS12345678901234',
        wireReference: wireRef,
      },
    };
  }

  async handleWebhook(event: any) {
    return { received: true, eventType: event?.type || 'payment_intent.succeeded' };
  }

  async getAllPayments() {
    return this.db.payments;
  }

  async approveCheckPayment(id: string) {
    const payment = this.db.payments.find((p) => p.id === id);
    if (!payment) throw new NotFoundException('Payment not found');

    payment.status = 'paid';

    // Activate enrollment
    if (payment.course_id) {
      const existing = this.db.enrollments.find(
        (e) => e.user_id === payment.user_id && e.course_id === payment.course_id,
      );
      if (!existing) {
        this.db.enrollments.push({
          id: `enroll-${Date.now()}`,
          user_id: payment.user_id,
          course_id: payment.course_id,
          status: 'active',
          enrolled_at: new Date().toISOString().split('T')[0],
          progress_percentage: 0,
          completed_lecture_ids: [],
        });
      }
    }

    return { success: true, payment };
  }

  async refundPayment(id: string) {
    const payment = this.db.payments.find((p) => p.id === id);
    if (!payment) throw new NotFoundException('Payment not found');

    payment.status = 'refunded';

    // Revoke enrollment if course
    if (payment.course_id) {
      const enrollmentIndex = this.db.enrollments.findIndex(
        (e) => e.user_id === payment.user_id && e.course_id === payment.course_id,
      );
      if (enrollmentIndex !== -1) {
        this.db.enrollments.splice(enrollmentIndex, 1);
      }
    }

    return { success: true, payment, message: 'Payment successfully refunded and access revoked.' };
  }

  async getCoupons() {
    return this.db.coupons;
  }

  async validateCoupon(code: string, amount: number) {
    const trimmed = (code || '').trim().toUpperCase();
    const coupon = this.db.coupons.find((c) => c.code.toUpperCase() === trimmed);
    if (!coupon) {
      return { valid: false, message: `Promo code "${trimmed}" not recognized.` };
    }
    if (!coupon.is_active) {
      return { valid: false, message: `Promo code "${trimmed}" is currently disabled.` };
    }
    const today = new Date().toISOString().split('T')[0];
    if (coupon.expires_at && coupon.expires_at < today) {
      return { valid: false, message: `Promo code "${trimmed}" expired.` };
    }
    if (coupon.times_used >= coupon.max_uses) {
      return { valid: false, message: `Promo code "${trimmed}" has reached maximum usage limit.` };
    }
    if (coupon.min_purchase_amount && amount < coupon.min_purchase_amount) {
      return { valid: false, message: `Minimum order amount of $${coupon.min_purchase_amount} required.` };
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = Number(((amount * coupon.discount_value) / 100).toFixed(2));
    } else {
      discount = Math.min(amount, coupon.discount_value);
    }

    return {
      valid: true,
      coupon,
      discountAmount: discount,
      finalAmount: Math.max(0, Number((amount - discount).toFixed(2))),
      message: `Coupon "${coupon.code}" verified.`,
    };
  }

  async createCoupon(data: any) {
    const code = (data.code || '').trim().toUpperCase();
    const newCoupon = {
      id: `coup-${Date.now()}`,
      code,
      description: data.description || '',
      discount_type: data.discountType || 'percentage',
      discount_value: Number(data.discountValue || 10),
      min_purchase_amount: Number(data.minPurchaseAmount || 0),
      max_uses: Number(data.maxUses || 100),
      times_used: 0,
      expires_at: data.expiresAt || '2026-12-31',
      is_active: true,
      applicable_to: data.applicableTo || 'all',
      created_at: new Date().toISOString().split('T')[0],
    };
    this.db.coupons.unshift(newCoupon);
    return newCoupon;
  }

  async updateCoupon(id: string, updates: any) {
    const coupon = this.db.coupons.find((c) => c.id === id);
    if (!coupon) throw new NotFoundException('Coupon not found');
    Object.assign(coupon, updates);
    return coupon;
  }

  async deleteCoupon(id: string) {
    const idx = this.db.coupons.findIndex((c) => c.id === id);
    if (idx === -1) throw new NotFoundException('Coupon not found');
    this.db.coupons.splice(idx, 1);
    return { success: true };
  }
}
