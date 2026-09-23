import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, EnrollmentEntity } from '../../database/database.service';

@Injectable()
export class EnrollmentsService {
  constructor(private db: DatabaseService) {}

  async enroll(courseId: string, userId: string) {
    const course = this.db.courses.find((c) => c.id === courseId);
    if (!course) throw new NotFoundException('Course not found');

    const existing = this.db.enrollments.find(
      (e) => e.user_id === userId && e.course_id === courseId,
    );

    if (existing) {
      return existing;
    }

    const newEnrollment: EnrollmentEntity = {
      id: `enroll-${Date.now()}`,
      user_id: userId,
      course_id: courseId,
      status: 'active',
      enrolled_at: new Date().toISOString().split('T')[0],
      progress_percentage: 0,
      completed_lecture_ids: [],
    };

    this.db.enrollments.push(newEnrollment);
    course.enrolled_students += 1;

    return newEnrollment;
  }

  async getMyEnrollments(userId: string) {
    const userEnrollments = this.db.enrollments.filter((e) => e.user_id === userId);
    return userEnrollments.map((e) => {
      const course = this.db.courses.find((c) => c.id === e.course_id);
      return {
        ...e,
        course,
      };
    });
  }

  async updateProgress(courseId: string, lectureId: string, userId: string) {
    let enrollment = this.db.enrollments.find(
      (e) => e.user_id === userId && e.course_id === courseId,
    );

    if (!enrollment) {
      enrollment = await this.enroll(courseId, userId);
    }

    if (!enrollment.completed_lecture_ids.includes(lectureId)) {
      enrollment.completed_lecture_ids.push(lectureId);
    }

    enrollment.last_lecture_id = lectureId;
    enrollment.progress_percentage = Math.min(
      100,
      Math.round((enrollment.completed_lecture_ids.length / 5) * 100),
    );

    if (enrollment.progress_percentage === 100) {
      enrollment.status = 'completed';
    }

    return enrollment;
  }
}
