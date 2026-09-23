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
}
