import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, UserSubscriptionEntity } from '../../database/database.service';

@Injectable()
export class SubscriptionsService {
  constructor(private db: DatabaseService) {}

  async getPlans() {
    return this.db.subscriptions;
  }

  async subscribe(userId: string, subscriptionId: string) {
    const plan = this.db.subscriptions.find((s) => s.id === subscriptionId);
    if (!plan) throw new NotFoundException('Subscription plan not found');

    const newSub: UserSubscriptionEntity = {
      id: `user-sub-${Date.now()}`,
      user_id: userId,
      subscription_id: subscriptionId,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
    };

    this.db.userSubscriptions.push(newSub);
    return newSub;
  }

  async cancelSubscription(id: string) {
    const sub = this.db.userSubscriptions.find((s) => s.id === id);
    if (!sub) throw new NotFoundException('User subscription not found');

    sub.status = 'cancelled';
    return { success: true, message: `Subscription ${id} cancelled`, subscription: sub };
  }
}
