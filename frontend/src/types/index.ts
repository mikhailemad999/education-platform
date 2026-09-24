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
  method: 'credit_card' | 'check' | 'paypal' | 'bank_transfer';
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  transactionDate: string;
  checkNumber?: string;
  poNumber?: string;
  companyName?: string;
  paypalEmail?: string;
  wireReference?: string;
  cardLast4?: string;
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
  userTitle?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpfulVotes?: number;
  sentiment?: 'positive' | 'neutral' | 'constructive';
  instructorReply?: {
    text: string;
    repliedAt: string;
  };
}

export interface CourseAnswer {
  id: string;
  questionId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  text: string;
  createdAt: string;
  isInstructorAnswer?: boolean;
}

export interface CourseQuestion {
  id: string;
  courseId: string;
  courseTitle?: string;
  lectureId?: string;
  lectureTitle?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userTitle?: string;
  title: string;
  content: string;
  createdAt: string;
  upvotes: number;
  hasInstructorReplied?: boolean;
  status?: 'unresolved' | 'resolved';
  answers: CourseAnswer[];
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  maxUses: number;
  timesUsed: number;
  expiresAt: string;
  isActive: boolean;
  applicableTo?: 'all' | 'courses' | 'subscriptions';
  createdAt: string;
}

export interface LectureNoteItem {
  id: string;
  courseId: string;
  courseTitle: string;
  lectureId: string;
  lectureTitle: string;
  timestampFormatted?: string;
  timestampSeconds?: number;
  content: string;
  createdAt: string;
}

export interface StudentEnrollmentDetail {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  country: string;
  countryCode: string;
  companyOrOrg: string;
  seniority: 'Staff / Principal' | 'Senior Backend' | 'Tech Lead' | 'DevOps / SRE' | 'Mid-Level';
  courseId: string;
  courseTitle: string;
  enrolledAt: string;
  progressPercentage: number;
  lastLectureWatched: string;
  quizScore: number; // e.g. 100 or 66
  certificateIssued: boolean;
  certificateId?: string;
  status: 'active' | 'completed' | 'at_risk';
}

export interface AdminStaff {
  id: string;
  name: string;
  email: string;
  department: string;
  roleTier: 'Operations Director' | 'Curriculum Moderator' | 'Financial Settlement' | 'Security Auditor';
  avatar: string;
  mfaEnabled: boolean;
  status: 'active' | 'suspended';
  lastActive: string;
  createdAt: string;
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

