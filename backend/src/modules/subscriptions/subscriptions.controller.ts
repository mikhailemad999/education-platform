import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('subscriptions/plans')
  async getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @UseGuards(JwtAuthGuard)
  @Post('payments/subscribe')
  async subscribe(@Body('subscriptionId') subscriptionId: string, @CurrentUser() user: any) {
    return this.subscriptionsService.subscribe(user.id, subscriptionId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  @Put('superadmin/subscriptions/:id/cancel')
  async cancelSubscription(@Param('id') id: string) {
    return this.subscriptionsService.cancelSubscription(id);
  }
}
