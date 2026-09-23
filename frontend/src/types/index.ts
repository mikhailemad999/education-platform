export type UserRole = 'student' | 'instructor' | 'admin' | 'superadmin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title?: string;
  bio?: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  courseCount: number;
}

export interface Lecture {
  id: string;
  sectionId: string;
  title: string;
  contentType: 'video' | 'pdf';
  contentUrl: string;
  duration: string; // e.g. "14:20" or "18 pages"
  sortOrder: number;
  isPreview?: boolean;
  pdfDownloadable?: boolean;
  summary?: string;
}

export interface Section {
  id: string;
  courseId: string;
  title: string;
  sortOrder: number;
  lectures: Lecture[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice: number;
  instructorId: string;
  instructorName: string;
  instructorTitle: string;
  instructorAvatar: string;
  categoryId: string;
  categoryName: string;
  status: 'draft' | 'pending_review' | 'published';
  rating: number;
  reviewCount: number;
  enrolledStudents: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  badge?: 'BEST SELLER' | 'NEW' | 'FEATURED' | 'HOT';
  thumbnail: string;
  promoVideoUrl: string;
  whatYouWillLearn: string[];
  prerequisites: string[];
  sections: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: 'active' | 'completed';
  enrolledAt: string;
  progressPercentage: number;
  completedLectureIds: string[];
  lastLectureId?: string;
}

export interface Payment {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId?: string;
  courseTitle?: string;
  subscriptionId?: string;
  subscriptionName?: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'check';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  transactionDate: string;
  checkNumber?: string;
  invoiceUrl?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  subscriptionId: string;
  planName: string;
  billingCycle: 'monthly' | 'annual';
  price: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'pending';
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  sentiment?: 'positive' | 'neutral' | 'constructive';
  instructorReply?: {
    text: string;
    repliedAt: string;
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  target: string;
  ipAddress: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
