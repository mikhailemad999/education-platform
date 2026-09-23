import { Injectable, OnModuleInit } from '@nestjs/common';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'student' | 'instructor' | 'admin' | 'superadmin';
  status: 'active' | 'pending' | 'suspended';
  created_at: string;
  avatar?: string;
  title?: string;
  bio?: string;
}

export interface CategoryEntity {
  id: string;
  name: string;
  slug: string;
  icon: string;
  courseCount: number;
}

export interface LectureEntity {
  id: string;
  section_id: string;
  title: string;
  content_type: 'video' | 'pdf';
  content_url: string;
  duration: string;
  sort_order: number;
  is_preview?: boolean;
  pdf_downloadable?: boolean;
}

export interface SectionEntity {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
  lectures: LectureEntity[];
}

export interface CourseEntity {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  original_price: number;
  instructor_id: string;
  category_id: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  rating: number;
  review_count: number;
  enrolled_students: number;
  level: string;
  duration: string;
  badge?: string;
  thumbnail: string;
  promo_video_url: string;
  sections: SectionEntity[];
}

export interface EnrollmentEntity {
  id: string;
  user_id: string;
  course_id: string;
  status: 'active' | 'completed';
  enrolled_at: string;
  progress_percentage: number;
  completed_lecture_ids: string[];
  last_lecture_id?: string;
}

export interface PaymentEntity {
  id: string;
  order_number: string;
  user_id: string;
  user_name: string;
  user_email: string;
  course_id?: string;
  subscription_id?: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'check';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  transaction_date: string;
  check_number?: string;
}

export interface SubscriptionEntity {
  id: string;
  name: string;
  price_monthly: number;
  price_annual: number;
  description: string;
  features: string[];
}

export interface UserSubscriptionEntity {
  id: string;
  user_id: string;
  subscription_id: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'cancelled' | 'pending';
}

export interface ReviewEntity {
  id: string;
  course_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  rating: number;
  comment: string;
  created_at: string;
  instructor_reply?: {
    text: string;
    replied_at: string;
  };
}

export interface AuditLogEntity {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  ip_address: string;
  severity: string;
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  public users: UserEntity[] = [];
  public categories: CategoryEntity[] = [];
  public courses: CourseEntity[] = [];
  public enrollments: EnrollmentEntity[] = [];
  public payments: PaymentEntity[] = [];
  public subscriptions: SubscriptionEntity[] = [];
  public userSubscriptions: UserSubscriptionEntity[] = [];
  public reviews: ReviewEntity[] = [];
  public auditLogs: AuditLogEntity[] = [];

  onModuleInit() {
    this.seed();
  }

  seed() {
    this.users = [
      {
        id: 'user-student-1',
        name: 'Alex Rivera',
        email: 'alex.rivera@engineer.io',
        password_hash: '$2b$10$epB0qR/d4L.z8e.F22Zz1.Y1wS.Xb3j58',
        role: 'student',
        status: 'active',
        created_at: '2025-01-15',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        title: 'Senior Frontend Engineer'
      },
      {
        id: 'user-instructor-1',
        name: 'Dr. Marcus Vance',
        email: 'marcus.vance@obsidian.edu',
        password_hash: '$2b$10$epB0qR/d4L.z8e.F22Zz1.Y1wS.Xb3j58',
        role: 'instructor',
        status: 'active',
        created_at: '2024-03-10',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        title: 'Principal Systems Architect'
      },
      {
        id: 'user-admin-1',
        name: 'Elena Rostova',
        email: 'elena.rostova@obsidian.edu',
        password_hash: '$2b$10$epB0qR/d4L.z8e.F22Zz1.Y1wS.Xb3j58',
        role: 'admin',
        status: 'active',
        created_at: '2024-01-05',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      },
      {
        id: 'user-superadmin-1',
        name: 'Viktor Kane',
        email: 'viktor.kane@obsidian.edu',
        password_hash: '$2b$10$epB0qR/d4L.z8e.F22Zz1.Y1wS.Xb3j58',
        role: 'superadmin',
        status: 'active',
        created_at: '2023-11-01',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
      }
    ];

    this.categories = [
      { id: 'cat-1', name: 'Distributed Systems', slug: 'distributed-systems', icon: 'hub', courseCount: 14 },
      { id: 'cat-2', name: 'Backend & NestJS', slug: 'backend-nestjs', icon: 'terminal', courseCount: 22 },
      { id: 'cat-3', name: 'Cloud Infrastructure', slug: 'cloud-infra', icon: 'cloud_sync', courseCount: 18 },
      { id: 'cat-4', name: 'Rust & Systems Programming', slug: 'rust-systems', icon: 'memory', courseCount: 12 }
    ];

    this.courses = [
      {
        id: 'course-1',
        title: 'Distributed Systems & Microservices with NestJS, Kafka & Redis',
        subtitle: 'Architect fault-tolerant event-driven microservices with transactional outbox and CQRS.',
        description: 'Complete hands-on masterclass for principal engineers.',
        price: 89.99,
        original_price: 149.99,
        instructor_id: 'user-instructor-1',
        category_id: 'cat-1',
        status: 'published',
        created_at: '2024-08-10',
        updated_at: '2025-02-18',
        rating: 4.95,
        review_count: 3420,
        enrolled_students: 12850,
        level: 'Advanced',
        duration: '28 hours',
        badge: 'BEST SELLER',
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        promo_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        sections: [
          {
            id: 'sec-1',
            course_id: 'course-1',
            title: 'Section 01 — Architectural Foundations & NestJS Core',
            sort_order: 1,
            lectures: [
              {
                id: 'lec-1-1',
                section_id: 'sec-1',
                title: '01. System Architecture Blueprint & Threat Model',
                content_type: 'video',
                content_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                duration: '18:45',
                sort_order: 1,
                is_preview: true
              },
              {
                id: 'lec-1-2',
                section_id: 'sec-1',
                title: '02. Production Syllabus & Microservices Topology Specification',
                content_type: 'pdf',
                content_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                duration: '24 pages',
                sort_order: 2,
                is_preview: true,
                pdf_downloadable: true
              },
              {
                id: 'lec-1-3',
                section_id: 'sec-1',
                title: '03. Event-Driven Architecture with Kafka & NestJS CQRS',
                content_type: 'video',
                content_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                duration: '24:10',
                sort_order: 3,
                is_preview: false
              }
            ]
          }
        ]
      },
      {
        id: 'course-2',
        title: 'Advanced Linux Kernel Observability & eBPF Telemetry',
        subtitle: 'Extract kernel tracepoints and diagnose production bottlenecks with zero overhead.',
        description: 'Deep dive into eBPF tracing programs in Linux.',
        price: 99.99,
        original_price: 179.99,
        instructor_id: 'user-instructor-1',
        category_id: 'cat-4',
        status: 'published',
        created_at: '2024-09-12',
        updated_at: '2025-01-30',
        rating: 4.98,
        review_count: 1840,
        enrolled_students: 6420,
        level: 'Advanced',
        duration: '22 hours',
        badge: 'FEATURED',
        thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80',
        promo_video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        sections: []
      }
    ];

    this.enrollments = [
      {
        id: 'enroll-1',
        user_id: 'user-student-1',
        course_id: 'course-1',
        status: 'active',
        enrolled_at: '2025-02-01',
        progress_percentage: 40,
        completed_lecture_ids: ['lec-1-1', 'lec-1-2'],
        last_lecture_id: 'lec-1-3'
      }
    ];

    this.payments = [
      {
        id: 'pay-101',
        order_number: 'ORD-98421',
        user_id: 'user-student-1',
        user_name: 'Alex Rivera',
        user_email: 'alex.rivera@engineer.io',
        course_id: 'course-1',
        amount: 89.99,
        currency: 'USD',
        method: 'credit_card',
        status: 'paid',
        transaction_date: '2025-02-01 14:22:10'
      },
      {
        id: 'pay-103',
        order_number: 'ORD-96102',
        user_id: 'user-student-2',
        user_name: 'Morgan Reed',
        user_email: 'morgan.reed@techcorp.com',
        course_id: 'course-2',
        amount: 99.99,
        currency: 'USD',
        method: 'check',
        status: 'pending',
        check_number: 'CHK-4491028',
        transaction_date: '2025-02-20 18:40:00'
      }
    ];

    this.subscriptions = [
      {
        id: 'sub-plan-pro',
        name: 'Pro Engineer',
        price_monthly: 29,
        price_annual: 279,
        description: 'Unlimited access to all engineering tracks and lab sandboxes.',
        features: ['All masterclasses', 'Certificates', 'Code downloads']
      }
    ];

    this.userSubscriptions = [
      {
        id: 'user-sub-1',
        user_id: 'user-student-1',
        subscription_id: 'sub-plan-pro',
        start_date: '2025-01-01',
        end_date: '2025-03-01',
        status: 'active'
      }
    ];

    this.reviews = [
      {
        id: 'rev-1',
        course_id: 'course-1',
        user_id: 'user-student-1',
        user_name: 'Alex Rivera',
        user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        rating: 5,
        comment: 'The Transactional Outbox pattern with Kafka and NestJS saved our team months in production.',
        created_at: '2025-02-10',
        instructor_reply: {
          text: 'Thanks Alex! Glad the outbox section helped simplify your distributed transactions.',
          replied_at: '2025-02-11'
        }
      }
    ];

    this.auditLogs = [
      {
        id: 'log-1',
        timestamp: '2025-02-23 21:14:02',
        actor: 'viktor.kane@obsidian.edu',
        role: 'superadmin',
        action: 'POLICY_OVERRIDE_UPDATED',
        target: 'Platform Commission Rate set to 15%',
        ip_address: '192.168.1.104',
        severity: 'medium'
      },
      {
        id: 'log-2',
        timestamp: '2025-02-23 19:42:15',
        actor: 'elena.rostova@obsidian.edu',
        role: 'admin',
        action: 'INSTRUCTOR_APPROVED',
        target: 'Dr. Marcus Vance (marcus.vance@obsidian.edu)',
        ip_address: '10.0.4.82',
        severity: 'low'
      }
    ];
  }
}
