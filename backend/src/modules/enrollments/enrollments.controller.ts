import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post('courses/:id/enroll')
  async enroll(@Param('id') courseId: string, @CurrentUser() user: any) {
    return this.enrollmentsService.enroll(courseId, user.id);
  }

  @Get('users/me/enrollments')
  async getMyEnrollments(@CurrentUser() user: any) {
    return this.enrollmentsService.getMyEnrollments(user.id);
  }

  @Post('courses/:id/progress')
  async updateProgress(
    @Param('id') courseId: string,
    @Body('lectureId') lectureId: string,
    @CurrentUser() user: any,
  ) {
    return this.enrollmentsService.updateProgress(courseId, lectureId, user.id);
  }
}
