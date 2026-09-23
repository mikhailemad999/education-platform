import { Controller, Post, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('credit-card')
  async processCreditCard(@Body() body: any, @CurrentUser() user: any) {
    return this.paymentsService.processCreditCard({
      ...body,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('check')
  async processCheck(@Body() body: any, @CurrentUser() user: any) {
    return this.paymentsService.processCheck({
      ...body,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('paypal')
  async processPayPal(@Body() body: any, @CurrentUser() user: any) {
    return this.paymentsService.processPayPal({
      ...body,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('bank-transfer')
  async processBankTransfer(@Body() body: any, @CurrentUser() user: any) {
    return this.paymentsService.processBankTransfer({
      ...body,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
    });
  }

  @Post('webhook')
  async webhook(@Body() event: any) {
    return this.paymentsService.handleWebhook(event);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Put(':id/approve')
  async approveCheckPayment(@Param('id') id: string) {
    return this.paymentsService.approveCheckPayment(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Put(':id/refund')
  async refundPayment(@Param('id') id: string) {
    return this.paymentsService.refundPayment(id);
  }
}
