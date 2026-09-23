import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('courses')
  async getCourses(@Query() query: { category?: string; search?: string; level?: string }) {
    return this.coursesService.findAll(query);
  }

  @Get('courses/:id')
  async getCourseById(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  // Instructor endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor', 'admin', 'superadmin')
  @Post('instructor/courses')
  async createCourse(@Body() courseData: any, @CurrentUser() user: any) {
    return this.coursesService.create(courseData, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor', 'admin', 'superadmin')
  @Put('instructor/courses/:id')
  async updateCourse(@Param('id') id: string, @Body() updates: any, @CurrentUser() user: any) {
    return this.coursesService.update(id, updates, user.id, user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor', 'admin', 'superadmin')
  @Delete('instructor/courses/:id')
  async deleteCourse(@Param('id') id: string, @CurrentUser() user: any) {
    return this.coursesService.delete(id, user.id, user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor', 'admin', 'superadmin')
  @Post('instructor/courses/:id/sections')
  async addSection(@Param('id') courseId: string, @Body('title') title: string, @CurrentUser() user: any) {
    return this.coursesService.addSection(courseId, title, user.id, user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor', 'admin', 'superadmin')
  @Post('instructor/sections/:id/lectures')
  async addLecture(@Param('id') sectionId: string, @Body() lectureData: any, @CurrentUser() user: any) {
    return this.coursesService.addLecture(sectionId, lectureData, user.id, user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('instructor', 'admin', 'superadmin')
  @Get('instructor/courses/:id/stats')
  async getCourseStats(@Param('id') id: string) {
    return this.coursesService.getCourseStats(id);
  }
}
