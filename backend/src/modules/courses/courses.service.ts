import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService, CourseEntity, SectionEntity, LectureEntity } from '../../database/database.service';

@Injectable()
export class CoursesService {
  constructor(private db: DatabaseService) {}

  async findAll(query?: { category?: string; search?: string; level?: string }) {
    let result = this.db.courses;

    if (query?.category) {
      result = result.filter((c) => c.category_id === query.category);
    }
    if (query?.level) {
      result = result.filter((c) => c.level.toLowerCase() === query.level.toLowerCase());
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.subtitle.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      );
    }

    return result;
  }

  async findOne(id: string) {
    const course = this.db.courses.find((c) => c.id === id);
    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }
    return course;
  }

  async create(courseData: Partial<CourseEntity>, instructorId: string) {
    const newCourse: CourseEntity = {
      id: `course-${Date.now()}`,
      title: courseData.title || 'Untitled Masterclass',
      subtitle: courseData.subtitle || '',
      description: courseData.description || '',
      price: courseData.price || 89.99,
      original_price: courseData.original_price || 149.99,
      instructor_id: instructorId,
      category_id: courseData.category_id || 'cat-1',
      status: courseData.status || 'draft',
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0],
      rating: 5.0,
      review_count: 0,
      enrolled_students: 0,
      level: courseData.level || 'Advanced',
      duration: courseData.duration || '12 hours',
      thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      promo_video_url: courseData.promo_video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      sections: courseData.sections || [],
    };

    this.db.courses.unshift(newCourse);
    return newCourse;
  }

  async update(id: string, updates: Partial<CourseEntity>, userId: string, userRole: string) {
    const course = await this.findOne(id);
    if (course.instructor_id !== userId && userRole !== 'admin' && userRole !== 'superadmin') {
      throw new ForbiddenException('You cannot modify another instructor\'s course.');
    }

    Object.assign(course, updates, { updated_at: new Date().toISOString().split('T')[0] });
    return course;
  }

  async delete(id: string, userId: string, userRole: string) {
    const course = await this.findOne(id);
    if (course.instructor_id !== userId && userRole !== 'admin' && userRole !== 'superadmin') {
      throw new ForbiddenException('You cannot delete another instructor\'s course.');
    }

    this.db.courses = this.db.courses.filter((c) => c.id !== id);
    return { success: true, message: `Course ${id} deleted` };
  }

  async addSection(courseId: string, title: string, userId: string, userRole: string) {
    const course = await this.findOne(courseId);
    if (course.instructor_id !== userId && userRole !== 'admin' && userRole !== 'superadmin') {
      throw new ForbiddenException('Forbidden');
    }

    const newSection: SectionEntity = {
      id: `sec-${Date.now()}`,
      course_id: courseId,
      title,
      sort_order: course.sections.length + 1,
      lectures: [],
    };

    course.sections.push(newSection);
    return newSection;
  }

  async addLecture(sectionId: string, lectureData: Partial<LectureEntity>, userId: string, userRole: string) {
    for (const course of this.db.courses) {
      const section = course.sections.find((s) => s.id === sectionId);
      if (section) {
        if (course.instructor_id !== userId && userRole !== 'admin' && userRole !== 'superadmin') {
          throw new ForbiddenException('Forbidden');
        }

        const newLecture: LectureEntity = {
          id: `lec-${Date.now()}`,
          section_id: sectionId,
          title: lectureData.title || 'New Lecture',
          content_type: lectureData.content_type || 'video',
          content_url: lectureData.content_url || '',
          duration: lectureData.duration || '15:00',
          sort_order: section.lectures.length + 1,
          is_preview: lectureData.is_preview || false,
          pdf_downloadable: lectureData.pdf_downloadable || false,
        };

        section.lectures.push(newLecture);
        return newLecture;
      }
    }
    throw new NotFoundException('Section not found');
  }

  async getCourseStats(id: string) {
    const course = await this.findOne(id);
    const revenue = course.enrolled_students * course.price * 0.85;
    return {
      courseId: id,
      title: course.title,
      enrolledStudents: course.enrolled_students,
      grossRevenue: course.enrolled_students * course.price,
      instructorNetRoyalty: revenue,
      rating: course.rating,
      reviewCount: course.review_count,
    };
  }
}
