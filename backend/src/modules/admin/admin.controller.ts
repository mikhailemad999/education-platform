import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'superadmin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updates: any) {
    return this.adminService.updateUser(id, updates);
  }

  @Get('instructors')
  async getInstructors() {
    return this.adminService.getInstructors();
  }

  @Post('instructors')
  async approveInstructor(@Body() body: { name: string; email: string }) {
    return this.adminService.approveInstructor(body);
  }

  @Delete('instructors/:id')
  async removeInstructor(@Param('id') id: string) {
    return this.adminService.removeInstructor(id);
  }

  @Get('stats')
  async getPlatformStats() {
    return this.adminService.getPlatformStats();
  }
}
