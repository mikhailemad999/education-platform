import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { SuperAdminService } from './superadmin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
@Controller('superadmin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Post('admins')
  async createAdmin(@Body() body: { name: string; email: string; department?: string }) {
    return this.superAdminService.createAdmin(body);
  }

  @Get('payments')
  async getAllPayments() {
    return this.superAdminService.getAllPayments();
  }

  @Get('audit-logs')
  async getAuditLogs() {
    return this.superAdminService.getAuditLogs();
  }

  @Get('settings')
  async getSettings() {
    return this.superAdminService.getSettings();
  }
}
