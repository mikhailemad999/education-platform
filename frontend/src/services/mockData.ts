import {
  Course,
  User,
  Category,
  Enrollment,
  Payment,
  SubscriptionPlan,
  UserSubscription,
  Review,
  AuditLog,
  CourseQuestion,
  StudentEnrollmentDetail,
  AdminStaff,
  Coupon
} from '../types';

export const MOCK_USERS: Record<string, User> = {
  student: {
    id: 'user-student-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@engineer.io',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Frontend Engineer',
    bio: 'Continuous learner transitioning toward distributed backend systems and Kubernetes architecture.',
    status: 'active',
    createdAt: '2025-01-15'
  },
  instructor: {
    id: 'user-instructor-1',
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@obsidian.edu',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Principal Systems Architect & ex-AWS Lead',
    bio: '15+ years architecting hyper-scale distributed backends, author of high-throughput streaming systems.',
    status: 'active',
    createdAt: '2024-03-10'
  },
  admin: {
    id: 'user-admin-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@obsidian.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Operations Director',
    bio: 'Curriculum quality assurance and instructor verification lead.',
    status: 'active',
    createdAt: '2024-01-05'
  },
  superadmin: {
    id: 'user-superadmin-1',
    name: 'Viktor Kane',
    email: 'viktor.kane@obsidian.edu',
    role: 'superadmin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Chief Technology Officer & Platform Owner',
    bio: 'Oversees sovereign platform infrastructure, governance, security compliance, and financial settlement.',
    status: 'active',
    createdAt: '2023-11-01'
  }
};

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Distributed Systems', slug: 'distributed-systems', icon: 'hub', courseCount: 14 },
  { id: 'cat-2', name: 'Backend & NestJS', slug: 'backend-nestjs', icon: 'terminal', courseCount: 22 },
  { id: 'cat-3', name: 'Cloud Infrastructure', slug: 'cloud-infra', icon: 'cloud_sync', courseCount: 18 },
  { id: 'cat-4', name: 'Rust & Systems Programming', slug: 'rust-systems', icon: 'memory', courseCount: 12 },
  { id: 'cat-5', name: 'AI Engineering & MLOps', slug: 'ai-mlops', icon: 'neurology', courseCount: 16 },
  { id: 'cat-6', name: 'Security & Cryptography', slug: 'security', icon: 'shield_lock', courseCount: 9 }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Distributed Systems & Microservices with NestJS, Kafka & Redis',
    subtitle: 'Architect fault-tolerant event-driven microservices. Deep dive into outbox patterns, distributed tracing with OpenTelemetry, Kafka partitions, NestJS CQRS, and high-throughput Redis caching.',
    description: 'This masterclass is designed for senior engineers looking to transition to principal backend architects. You will construct a multi-cluster event stream processing engine using NestJS microservices, Apache Kafka, and Redis Sentinel.',
    price: 89.99,
    originalPrice: 149.99,
    instructorId: 'user-instructor-1',
    instructorName: 'Dr. Marcus Vance',
    instructorTitle: 'Principal Systems Architect',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    categoryId: 'cat-1',
    categoryName: 'Distributed Systems',
    status: 'published',
    rating: 4.95,
    reviewCount: 3420,
    enrolledStudents: 12850,
    level: 'Advanced',
    duration: '28 hours',
    badge: 'BEST SELLER',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    promoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    whatYouWillLearn: [
      'Design fault-tolerant event-driven microservices with NestJS and Kafka',
      'Implement the Transactional Outbox Pattern to guarantee at-least-once delivery',
      'Optimize high-concurrency Redis caching with lua scripts and cluster sharding',
      'Instrument production microservices using OpenTelemetry distributed tracing and Jaeger',
      'Build resilient CQRS patterns and Saga transaction orchestration'
    ],
    prerequisites: [
      'Strong proficiency in TypeScript and Node.js backend concepts',
      'Basic familiarity with Docker and relational databases'
    ],
    createdAt: '2024-08-10',
    updatedAt: '2025-02-18',
    sections: [
      {
        id: 'sec-1',
        courseId: 'course-1',
        title: 'Section 01 — Architectural Foundations & NestJS Core',
        sortOrder: 1,
        lectures: [
          {
            id: 'lec-1-1',
            sectionId: 'sec-1',
            title: '01. System Architecture Blueprint & Threat Model',
            contentType: 'video',
            contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: '18:45',
            sortOrder: 1,
            isPreview: true,
            summary: 'Deep dive into decoupled microservice architectures and state machine guarantees.'
          },
          {
            id: 'lec-1-2',
            sectionId: 'sec-1',
            title: '02. Production Syllabus & Microservices Topology Specification',
            contentType: 'pdf',
            contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            duration: '24 pages',
            sortOrder: 2,
            isPreview: true,
            pdfDownloadable: true,
            summary: 'Complete architectural whitepaper and reference diagrams.'
          },
          {
            id: 'lec-1-3',
            sectionId: 'sec-1',
            title: '03. Event-Driven Architecture with Kafka & NestJS CQRS',
            contentType: 'video',
            contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            duration: '24:10',
            sortOrder: 3,
            isPreview: false,
            summary: 'Implementing Command Query Responsibility Segregation with event emitters.'
          }
        ]
      },
      {
        id: 'sec-2',
        courseId: 'course-1',
        title: 'Section 02 — High-Throughput Message Brokers with Kafka',
        sortOrder: 2,
        lectures: [
          {
            id: 'lec-2-1',
            sectionId: 'sec-2',
            title: '04. Partitioning Strategies, Consumer Groups & Offsets',
            contentType: 'video',
            contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration: '31:20',
            sortOrder: 1,
            isPreview: false
          },
          {
            id: 'lec-2-2',
            sectionId: 'sec-2',
            title: '05. Transactional Outbox Pattern Implementation Lab',
            contentType: 'pdf',
            contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            duration: '16 pages',
            sortOrder: 2,
            pdfDownloadable: true
          }
        ]
      },
      {
        id: 'sec-3',
        courseId: 'course-1',
        title: 'Section 03 — Resilient Caching & Distributed Locks with Redis',
        sortOrder: 3,
        lectures: [
          {
            id: 'lec-3-1',
            sectionId: 'sec-3',
            title: '06. Redlock Algorithm & Distributed Synchronization',
            contentType: 'video',
            contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: '22:15',
            sortOrder: 1
          }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Advanced Linux Kernel Observability & eBPF Telemetry',
    subtitle: 'Extract kernel tracepoints, build high-performance network filters, and diagnose production bottlenecks in real-time using eBPF and Go.',
    description: 'Master kernel-level tracing with eBPF (extended Berkeley Packet Filter). Uncover system call latency, packet drops, memory leaks, and CPU cache misses without modifying application code.',
    price: 99.99,
    originalPrice: 179.99,
    instructorId: 'user-instructor-1',
    instructorName: 'Dr. Marcus Vance',
    instructorTitle: 'Principal Systems Architect',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    categoryId: 'cat-4',
    categoryName: 'Rust & Systems Programming',
    status: 'published',
    rating: 4.98,
    reviewCount: 1840,
    enrolledStudents: 6420,
    level: 'Advanced',
    duration: '22 hours',
    badge: 'FEATURED',
    thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80',
    promoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    whatYouWillLearn: [
      'Write eBPF C programs loaded directly into the Linux Kernel',
      'Trace syscalls, TCP connections, and disk I/O with zero overhead',
      'Build userspace telemetry collectors in Go using cilium/ebpf',
      'Deploy custom observability agents into Kubernetes pods'
    ],
    prerequisites: ['Proficiency in C or Go and foundational Linux knowledge'],
    createdAt: '2024-09-12',
    updatedAt: '2025-01-30',
    sections: [
      {
        id: 'sec-2-1',
        courseId: 'course-2',
        title: 'Section 01 — eBPF Architecture & Kernel Verifier',
        sortOrder: 1,
        lectures: [
          {
            id: 'lec-2-1-1',
            sectionId: 'sec-2-1',
            title: '01. Anatomy of the BPF Virtual Machine',
            contentType: 'video',
            contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            duration: '20:10',
            sortOrder: 1,
            isPreview: true
          },
          {
            id: 'lec-2-1-2',
            sectionId: 'sec-2-1',
            title: '02. Kernel Hookpoints & Tracepoints Reference',
            contentType: 'pdf',
            contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            duration: '32 pages',
            sortOrder: 2,
            pdfDownloadable: true
          }
        ]
      }
    ]
  },
  {
    id: 'course-3',
    title: 'High-Performance Systems Programming in Rust with Tokio',
    subtitle: 'Develop concurrent, memory-safe, and asynchronous systems with Rust, Tokio runtime, actor models, and zero-copy networking.',
    description: 'A deep immersion into production Rust. Learn concurrency primitives, async-await mechanics, channels, non-blocking I/O, and lock-free data structures.',
    price: 79.99,
    originalPrice: 129.99,
    instructorId: 'user-instructor-1',
    instructorName: 'Dr. Marcus Vance',
    instructorTitle: 'Principal Systems Architect',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    categoryId: 'cat-4',
    categoryName: 'Rust & Systems Programming',
    status: 'published',
    rating: 4.92,
    reviewCount: 2190,
    enrolledStudents: 8930,
    level: 'Intermediate',
    duration: '34 hours',
    badge: 'HOT',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    promoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    whatYouWillLearn: [
      'Master ownership, borrowing, and lifetimes in multi-threaded contexts',
      'Build async network servers handling 100k+ concurrent connections',
      'Implement zero-copy serialization with serde and byte buffers',
      'Optimize binary performance using cargo-flamegraph and perf'
    ],
    prerequisites: ['Prior programming experience in C++, Go, or TypeScript'],
    createdAt: '2024-07-20',
    updatedAt: '2025-02-01',
    sections: [
      {
        id: 'sec-3-1',
        courseId: 'course-3',
        title: 'Section 01 — Async Foundations in Rust',
        sortOrder: 1,
        lectures: [
          {
            id: 'lec-3-1-1',
            sectionId: 'sec-3-1',
            title: '01. Futures, Tasks, and Tokio Reactor Design',
            contentType: 'video',
            contentUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
            duration: '26:40',
            sortOrder: 1,
            isPreview: true
          }
        ]
      }
    ]
  },
  {
    id: 'course-4',
    title: 'Kubernetes Platform Engineering & Multi-Cluster Mesh',
    subtitle: 'Deploy enterprise-grade Kubernetes clusters, Cilium CNI, Istio service mesh, GitOps with ArgoCD, and automated canary rollouts.',
    description: 'Learn how modern platform teams construct internal developer platforms (IDP) upon Kubernetes with automated security posture management.',
    price: 94.99,
    originalPrice: 159.99,
    instructorId: 'user-instructor-1',
    instructorName: 'Dr. Marcus Vance',
    instructorTitle: 'Principal Systems Architect',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    categoryId: 'cat-3',
    categoryName: 'Cloud Infrastructure',
    status: 'published',
    rating: 4.89,
    reviewCount: 1450,
    enrolledStudents: 5120,
    level: 'Advanced',
    duration: '25 hours',
    badge: 'NEW',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    promoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    whatYouWillLearn: [
      'Multi-cluster service mesh networking with Istio & Envoy',
      'Automated declarative GitOps workflows with ArgoCD and Helm',
      'mTLS enforcement and zero-trust workload identity',
      'Cost optimization and resource rightsizing with Kubecost'
    ],
    prerequisites: ['Basic Docker and Kubernetes commands'],
    createdAt: '2024-11-05',
    updatedAt: '2025-02-10',
    sections: []
  }
];

export const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enroll-1',
    userId: 'user-student-1',
    courseId: 'course-1',
    status: 'active',
    enrolledAt: '2025-02-01',
    progressPercentage: 40,
    completedLectureIds: ['lec-1-1', 'lec-1-2'],
    lastLectureId: 'lec-1-3'
  },
  {
    id: 'enroll-2',
    userId: 'user-student-1',
    courseId: 'course-2',
    status: 'completed',
    enrolledAt: '2025-01-10',
    progressPercentage: 100,
    completedLectureIds: ['lec-2-1-1', 'lec-2-1-2'],
    lastLectureId: 'lec-2-1-2'
  }
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay-101',
    orderNumber: 'ORD-98421',
    userId: 'user-student-1',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@engineer.io',
    courseId: 'course-1',
    courseTitle: 'Distributed Systems & Microservices with NestJS',
    amount: 89.99,
    currency: 'USD',
    method: 'credit_card',
    status: 'paid',
    transactionDate: '2025-02-01 14:22:10',
    invoiceUrl: '#'
  },
  {
    id: 'pay-102',
    orderNumber: 'ORD-97814',
    userId: 'user-student-1',
    userName: 'Alex Rivera',
    userEmail: 'alex.rivera@engineer.io',
    courseId: 'course-2',
    courseTitle: 'Advanced Linux Kernel Observability & eBPF Telemetry',
    amount: 99.99,
    currency: 'USD',
    method: 'credit_card',
    status: 'paid',
    transactionDate: '2025-01-10 09:15:32',
    invoiceUrl: '#'
  },
  {
    id: 'pay-103',
    orderNumber: 'ORD-96102',
    userId: 'user-student-2',
    userName: 'Morgan Reed',
    userEmail: 'morgan.reed@techcorp.com',
    courseId: 'course-3',
    courseTitle: 'High-Performance Systems Programming in Rust with Tokio',
    amount: 79.99,
    currency: 'USD',
    method: 'check',
    status: 'pending',
    checkNumber: 'CHK-4491028',
    transactionDate: '2025-02-20 18:40:00',
    invoiceUrl: '#'
  },
  {
    id: 'pay-104',
    orderNumber: 'ORD-95320',
    userId: 'user-student-3',
    userName: 'David Chen',
    userEmail: 'd.chen@startup.io',
    subscriptionId: 'sub-plan-pro',
    subscriptionName: 'Pro Tier Subscription (Annual)',
    amount: 290.00,
    currency: 'USD',
    method: 'credit_card',
    status: 'paid',
    transactionDate: '2025-02-15 11:05:14',
    invoiceUrl: '#'
  }
];

export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'sub-plan-starter',
    name: 'Starter',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Perfect for exploring foundational open modules and preview lectures.',
    features: [
      'Access to all open preview lectures',
      'Community discussion forums',
      'Standard video quality (720p)',
      'Single device streaming'
    ]
  },
  {
    id: 'sub-plan-pro',
    name: 'Pro Engineer',
    priceMonthly: 29,
    priceAnnual: 279,
    isPopular: true,
    description: 'Full unhindered access to all masterclasses, lab PDFs, and verifiable credentials.',
    features: [
      'Unlimited access to all 45+ masterclasses',
      'Downloadable lab code & production blueprints',
      'Verifiable cryptographic credentials',
      'Priority Q&A from instructors',
      '4K ultra-low latency video streams',
      'Offline PDF lecture downloads'
    ]
  },
  {
    id: 'sub-plan-team',
    name: 'Team / Enterprise',
    priceMonthly: 79,
    priceAnnual: 790,
    description: 'For engineering teams requiring SSO, analytics dashboards, and seat provisioning.',
    features: [
      'All Pro Engineer benefits for up to 10 seats',
      'SAML/SSO Okta & Google Workspace authentication',
      'Centralized admin billing & invoices',
      'Team skill progression & completion analytics',
      'Dedicated engineering advisory sessions'
    ]
  }
];

export const MOCK_USER_SUBSCRIPTION: UserSubscription = {
  id: 'user-sub-1',
  userId: 'user-student-1',
  subscriptionId: 'sub-plan-pro',
  planName: 'Pro Engineer',
  billingCycle: 'monthly',
  price: 29,
  startDate: '2025-01-01',
  endDate: '2025-03-01',
  status: 'active'
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    courseId: 'course-1',
    userId: 'user-student-1',
    userName: 'Alex Rivera',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'The explanation of the Transactional Outbox pattern with Kafka and NestJS saved our team months of trial-and-error in production. Truly an elite masterclass.',
    createdAt: '2025-02-10',
    sentiment: 'positive',
    instructorReply: {
      text: 'Thanks Alex! Glad the outbox section helped simplify your distributed transactions.',
      repliedAt: '2025-02-11'
    }
  },
  {
    id: 'rev-2',
    courseId: 'course-1',
    userId: 'user-student-2',
    userName: 'David Miller',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Zero filler. Immediate code and telemetry. The OpenTelemetry tracing configuration was exactly what I needed for our Jaeger deployment.',
    createdAt: '2025-02-05',
    sentiment: 'positive'
  }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2025-02-23 21:14:02',
    actor: 'viktor.kane@obsidian.edu',
    role: 'superadmin',
    action: 'POLICY_OVERRIDE_UPDATED',
    target: 'Platform Commission Rate set to 15%',
    ipAddress: '192.168.1.104',
    severity: 'medium'
  },
  {
    id: 'log-2',
    timestamp: '2025-02-23 19:42:15',
    actor: 'elena.rostova@obsidian.edu',
    role: 'admin',
    action: 'INSTRUCTOR_APPROVED',
    target: 'Dr. Marcus Vance (marcus.vance@obsidian.edu)',
    ipAddress: '10.0.4.82',
    severity: 'low'
  },
  {
    id: 'log-3',
    timestamp: '2025-02-23 14:08:50',
    actor: 'system.gateway',
    role: 'superadmin',
    action: 'CHECK_PAYMENT_PENDING',
    target: 'Order ORD-96102 submitted for review ($79.99)',
    ipAddress: '54.210.89.12',
    severity: 'low'
  },
  {
    id: 'log-4',
    timestamp: '2025-02-22 08:30:11',
    actor: 'viktor.kane@obsidian.edu',
    role: 'superadmin',
    action: 'ADMIN_INVITED',
    target: 'Elena Rostova (elena.rostova@obsidian.edu)',
    ipAddress: '192.168.1.104',
    severity: 'high'
  }
];

export const MOCK_QUESTIONS: CourseQuestion[] = [
  {
    id: 'q-1',
    courseId: 'course-1',
    courseTitle: 'Distributed Systems & Microservices with NestJS, Kafka & Redis',
    lectureId: 'lec-1-1',
    lectureTitle: 'Lec 01 — Modern Distributed System Invariants & Trade-offs',
    userId: 'user-student-2',
    userName: 'David Miller',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    userTitle: 'Staff Architect @ Apex Fintech',
    title: 'How does the Transactional Outbox handle high table partition churn?',
    content: 'When event volume exceeds 10M rows daily, what is the best strategy to prevent performance degradation on the outbox table? Should we rely on pg_partman or Kafka Connect Debezium CDC?',
    createdAt: '2 days ago',
    upvotes: 18,
    hasInstructorReplied: true,
    status: 'resolved',
    answers: [
      {
        id: 'ans-1',
        questionId: 'q-1',
        userId: 'user-instructor-1',
        userName: 'Dr. Marcus Vance',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        userRole: 'instructor',
        text: 'In production systems, we strongly advocate for Debezium CDC reading directly from Postgres WAL or MySQL Binlog. This eliminates polling `SELECT ... FOR UPDATE SKIP LOCKED` overhead completely and achieves sub-second delivery latency.',
        createdAt: '1 day ago',
        isInstructorAnswer: true
      },
      {
        id: 'ans-2',
        questionId: 'q-1',
        userId: 'user-student-1',
        userName: 'Alex Rivera',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        userRole: 'student',
        text: 'We also use range partitioning by hour and drop expired partitions after CDC watermark commits. Works smoothly under heavy write spikes!',
        createdAt: '18 hours ago'
      }
    ]
  },
  {
    id: 'q-2',
    courseId: 'course-1',
    courseTitle: 'Distributed Systems & Microservices with NestJS, Kafka & Redis',
    lectureId: 'lec-1-2',
    lectureTitle: 'Lec 02 — NestJS Monorepo Structure & Clean Architecture',
    userId: 'user-student-3',
    userName: 'Samantha Wu',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    userTitle: 'Tech Lead @ HyperMetrics',
    title: 'NestJS CQRS EventBus vs Kafka consumer loop: when to use which?',
    content: 'Is it recommended to publish domain events directly to Kafka, or should internal NestJS Command/Query handlers publish to the local EventBus first and let an event subscriber write to outbox?',
    createdAt: '3 days ago',
    upvotes: 12,
    hasInstructorReplied: true,
    status: 'resolved',
    answers: [
      {
        id: 'ans-3',
        questionId: 'q-2',
        userId: 'user-instructor-1',
        userName: 'Dr. Marcus Vance',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        userRole: 'instructor',
        text: 'Always write to the local outbox table in the same DB transaction as your domain entity state changes! The local NestJS EventBus is purely in-memory; if the process crashes before Kafka confirms receipt, the event is permanently lost.',
        createdAt: '2 days ago',
        isInstructorAnswer: true
      }
    ]
  },
  {
    id: 'q-3',
    courseId: 'course-1',
    courseTitle: 'Distributed Systems & Microservices with NestJS, Kafka & Redis',
    lectureId: 'lec-2-1',
    lectureTitle: 'Lec 03 — Deep-Dive: Transactional Outbox Pattern with Debezium',
    userId: 'user-student-4',
    userName: 'Lucas Tanaka',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    userTitle: 'DevOps & SRE Specialist',
    title: 'Redis Cluster failover and split-brain scenarios',
    content: 'What happens to active locks in Redis Sentinel or Cluster during automatic failover? Does the replica replicate lock keys with TTL synchronously?',
    createdAt: '5 days ago',
    upvotes: 7,
    hasInstructorReplied: false,
    status: 'unresolved',
    answers: [
      {
        id: 'ans-4',
        questionId: 'q-3',
        userId: 'user-student-1',
        userName: 'Alex Rivera',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        userRole: 'student',
        text: 'Redis replication is asynchronous! A master can acknowledge a lock and crash before the replica receives it. That is why Martin Kleppmann warns against assuming absolute mutual exclusion with standard Redis.',
        createdAt: '4 days ago'
      }
    ]
  },
  {
    id: 'q-4',
    courseId: 'course-1',
    courseTitle: 'Distributed Systems & Microservices with NestJS, Kafka & Redis',
    lectureId: 'lec-2-2',
    lectureTitle: 'Lec 04 — OpenTelemetry Distributed Tracing Setup',
    userId: 'user-student-5',
    userName: 'Priya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    userTitle: 'Senior Backend Engineer @ PayGrid',
    title: 'Handling trace baggage propagation across Kafka headers safely',
    content: 'When propagating W3C tracecontext and custom baggage across Kafka message headers, what is the best practice to prevent leaking PII or internal cluster IDs to untrusted external consumers?',
    createdAt: '1 day ago',
    upvotes: 9,
    hasInstructorReplied: false,
    status: 'unresolved',
    answers: []
  },
  {
    id: 'q-5',
    courseId: 'course-2',
    courseTitle: 'Advanced Linux Kernel Observability & eBPF Telemetry',
    lectureId: 'lec-2-1-1',
    lectureTitle: 'Kernel Probe Attach Mechanics',
    userId: 'user-student-6',
    userName: 'Jean-Luc Moreau',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    userTitle: 'Systems Engineer',
    title: 'eBPF verifier rejection with unbounded loop bounded iteration',
    content: 'On Linux kernel 5.15, the BPF verifier is rejecting my ring-buffer reader loop because it claims instruction count exceeded 1M limit. Is unrolling mandatory here?',
    createdAt: '6 hours ago',
    upvotes: 14,
    hasInstructorReplied: false,
    status: 'unresolved',
    answers: []
  }
];

export const MOCK_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'ARCHITECT20',
    description: 'Launch Promotion: 20% discount on all advanced engineering courses and plans.',
    discountType: 'percentage',
    discountValue: 20,
    minPurchaseAmount: 49,
    maxUses: 500,
    timesUsed: 142,
    expiresAt: '2026-12-31',
    isActive: true,
    applicableTo: 'all',
    createdAt: '2025-01-01'
  },
  {
    id: 'coup-2',
    code: 'OBSIDIAN50',
    description: 'VIP Founding Fellows 50% Half-Off Voucher for Enterprise Cohort Students.',
    discountType: 'percentage',
    discountValue: 50,
    minPurchaseAmount: 80,
    maxUses: 100,
    timesUsed: 68,
    expiresAt: '2026-11-30',
    isActive: true,
    applicableTo: 'courses',
    createdAt: '2025-01-15'
  },
  {
    id: 'coup-3',
    code: 'KERNEL10',
    description: 'Direct $10 instantaneous voucher for Linux Kernel & eBPF Telemetry courses.',
    discountType: 'fixed',
    discountValue: 10,
    minPurchaseAmount: 50,
    maxUses: 250,
    timesUsed: 89,
    expiresAt: '2026-10-15',
    isActive: true,
    applicableTo: 'courses',
    createdAt: '2025-02-01'
  },
  {
    id: 'coup-4',
    code: 'STAFFDEV',
    description: 'Exclusive 30% discount voucher for Staff/Principal engineering cohorts.',
    discountType: 'percentage',
    discountValue: 30,
    minPurchaseAmount: 90,
    maxUses: 50,
    timesUsed: 12,
    expiresAt: '2026-08-30',
    isActive: true,
    applicableTo: 'all',
    createdAt: '2025-02-10'
  },
  {
    id: 'coup-5',
    code: 'EXPIRED2024',
    description: 'Legacy 2024 Early Access Alpha discount token (Archived campaign).',
    discountType: 'percentage',
    discountValue: 25,
    minPurchaseAmount: 40,
    maxUses: 100,
    timesUsed: 100,
    expiresAt: '2024-12-31',
    isActive: false,
    applicableTo: 'all',
    createdAt: '2024-06-01'
  }
];

export const MOCK_STUDENT_ENROLLMENTS: StudentEnrollmentDetail[] = [
  {
    id: 'stud-enr-1',
    studentId: 'user-student-1',
    studentName: 'Alex Rivera',
    studentEmail: 'alex.rivera@engineer.io',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    country: 'United States',
    countryCode: 'US',
    companyOrOrg: 'Starlight Cloud Systems',
    seniority: 'Senior Backend',
    courseId: 'course-1',
    courseTitle: 'Distributed Systems & Microservices with NestJS, Kafka & Redis',
    enrolledAt: '2025-01-15',
    progressPercentage: 100,
    lastLectureWatched: 'Lec 04 — OpenTelemetry Distributed Tracing Setup',
    quizScore: 100,
    certificateIssued: true,
    certificateId: 'OBS-COURSE-1-849201',
    status: 'completed'
  },
  {
    id: 'stud-enr-2',
    studentId: 'user-student-2',
    studentName: 'David Miller',
    studentEmail: 'david.m@apexfintech.com',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    country: 'United Kingdom',
    countryCode: 'GB',
    companyOrOrg: 'Apex Financial Technologies',
    seniority: 'Staff / Principal',
    courseId: 'course-1',
    courseTitle: 'Distributed Systems & Microservices with NestJS, Kafka & Redis',
    enrolledAt: '2025-01-20',
    progressPercentage: 85,
    lastLectureWatched: 'Lec 03 — Deep-Dive: Transactional Outbox Pattern with Debezium',
    quizScore: 100,
    certificateIssued: false,
    status: 'active'
  },
  {
    id: 'stud-enr-3',
    studentId: 'user-student-3',
    studentName: 'Samantha Wu',
    studentEmail: 's.wu@hypermetrics.de',
    studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    country: 'Germany',
    countryCode: 'DE',
    companyOrOrg: 'HyperMetrics Telemetry GmbH',
    seniority: 'Tech Lead',
    courseId: 'course-1',
    courseTitle: 'Distributed Systems & Microservices with NestJS, Kafka & Redis',
    enrolledAt: '2025-02-01',
    progressPercentage: 72,
    lastLectureWatched: 'Lec 02 — NestJS Monorepo Structure & Clean Architecture',
    quizScore: 66,
    certificateIssued: false,
    status: 'active'
  },
  {
    id: 'stud-enr-4',
    studentId: 'user-student-4',
    studentName: 'Lucas Tanaka',
    studentEmail: 'lucas.tanaka@tokyocloud.jp',
    studentAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    country: 'Japan',
    countryCode: 'JP',
    companyOrOrg: 'Tokyo Cloud Infrastructure',
    seniority: 'DevOps / SRE',
    courseId: 'course-1',
    courseTitle: 'Distributed Systems & Microservices with NestJS, Kafka & Redis',
    enrolledAt: '2025-02-08',
    progressPercentage: 45,
    lastLectureWatched: 'Lec 02 — NestJS Monorepo Structure & Clean Architecture',
    quizScore: 100,
    certificateIssued: false,
    status: 'active'
  },
  {
    id: 'stud-enr-5',
    studentId: 'user-student-5',
    studentName: 'Priya Sharma',
    studentEmail: 'priya.sharma@paygrid.in',
    studentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    country: 'India',
    countryCode: 'IN',
    companyOrOrg: 'PayGrid Payments Systems',
    seniority: 'Senior Backend',
    courseId: 'course-1',
    courseTitle: 'Distributed Systems & Microservices with NestJS, Kafka & Redis',
    enrolledAt: '2025-02-14',
    progressPercentage: 92,
    lastLectureWatched: 'Lec 04 — OpenTelemetry Distributed Tracing Setup',
    quizScore: 100,
    certificateIssued: false,
    status: 'active'
  },
  {
    id: 'stud-enr-6',
    studentId: 'user-student-6',
    studentName: 'Jean-Luc Moreau',
    studentEmail: 'jeanluc@aerodev.fr',
    studentAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    country: 'France',
    countryCode: 'FR',
    companyOrOrg: 'AeroData Systems',
    seniority: 'Mid-Level',
    courseId: 'course-1',
    courseTitle: 'Distributed Systems & Microservices with NestJS, Kafka & Redis',
    enrolledAt: '2025-01-05',
    progressPercentage: 15,
    lastLectureWatched: 'Lec 01 — Modern Distributed System Invariants & Trade-offs',
    quizScore: 0,
    certificateIssued: false,
    status: 'at_risk'
  }
];

export const MOCK_ADMIN_STAFF: AdminStaff[] = [
  {
    id: 'adm-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@obsidian.edu',
    department: 'Curriculum Operations',
    roleTier: 'Operations Director',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    mfaEnabled: true,
    status: 'active',
    lastActive: '10 mins ago',
    createdAt: '2024-01-05'
  },
  {
    id: 'adm-2',
    name: 'Klaus Reinhardt',
    email: 'klaus.r@obsidian.edu',
    department: 'Quality Assurance & Accreditation',
    roleTier: 'Curriculum Moderator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    mfaEnabled: true,
    status: 'active',
    lastActive: '2 hours ago',
    createdAt: '2024-04-12'
  },
  {
    id: 'adm-3',
    name: 'Sarah Jenkins',
    email: 'sarah.j@obsidian.edu',
    department: 'Financial Settlement & Clearing',
    roleTier: 'Financial Settlement',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    mfaEnabled: true,
    status: 'active',
    lastActive: 'Yesterday',
    createdAt: '2024-06-18'
  },
  {
    id: 'adm-4',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.m@obsidian.edu',
    department: 'Information Security & Compliance',
    roleTier: 'Security Auditor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    mfaEnabled: true,
    status: 'active',
    lastActive: '4 hours ago',
    createdAt: '2024-08-01'
  }
];

