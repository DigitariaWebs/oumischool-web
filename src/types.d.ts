export type SessionMode = "online" | "presential";
export type SessionType = "individual" | "group";
export type SessionStatus = "scheduled" | "completed" | "cancelled";

export interface SessionStudent {
  id: string;
  name: string;
}

export interface ScheduleSession {
  id: string;
  tutorId: string;
  subjectId: string;
  title: string;
  day: number; // 0=Sun … 6=Sat
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  mode: SessionMode;
  type: SessionType;
  status: SessionStatus;
  students: SessionStudent[];
  location?: string; // for presential
  meetingUrl?: string; // for online
  recurringWeekly: boolean;
  date?: string; // ISO date string for one-off sessions
  pricePerStudent?: number; // price charged per student per session
}

/** Availability slot — a block when the tutor is free */
export interface AvailabilitySlot {
  day: number; // 0=Sun … 6=Sat
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
}

export interface TutorSchedule {
  tutorId: string;
  sessions: ScheduleSession[];
  availability: AvailabilitySlot[];
}

export interface SettingsState {
  platformCut: number;
  setPlatformCut: (value: number) => void;
}

export type TutorStatus = "active" | "inactive" | "pending";

export type TutorResourceType =
  | "document"
  | "video"
  | "audio"
  | "image"
  | "other";
export type TutorResourceStatus = "published" | "draft" | "archived";

export interface TutorResource {
  id: string;
  tutorId: string;
  title: string;
  description?: string;
  type: TutorResourceType;
  status: TutorResourceStatus;
  subjectId?: string;
  lessonId?: string;
  fileSize: string;
  views: number;
  downloads: number;
  uploadedDate: string;
}

export interface LessonRevenue {
  lessonId: string;
  amount: number;
  sales: number;
}

export interface SeriesRevenue {
  seriesId: string;
  amount: number;
  sales: number;
  lessons: LessonRevenue[];
}

export interface SubjectRevenue {
  subjectId: string;
  amount: number;
  standaloneAmount: number;
  series: SeriesRevenue[];
  standaloneLessons: LessonRevenue[];
}

export interface RecurringSessionRevenue {
  sessionId: string;
  title: string;
  type: SessionType;
  mode: SessionMode;
  subjectId: string;
  studentCount: number;
  pricePerStudent: number;
  sessionsThisMonth: number;
  amount: number; // total gross this month
}

export interface TutorRevenue {
  total: number;
  bySubject: SubjectRevenue[];
  recurringSessions?: RecurringSessionRevenue[];
}

export interface SessionPricingTier {
  pricePerStudent: number;
  accepted: boolean;
}

export interface TutorSessionPricing {
  individual?: {
    online?: SessionPricingTier;
    presential?: SessionPricingTier;
  };
  group?: {
    online?: SessionPricingTier;
    presential?: SessionPricingTier;
    maxStudents?: number;
  };
  notes?: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface LessonSeries {
  id: string;
  subjectId: string;
  tutorId: string;
  title: string;
  description?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  soldSeparately: boolean;
}

export interface Lesson {
  id: string;
  subjectId: string;
  tutorId: string;
  title: string;
  description?: string;
  duration: string;
  seriesId?: string;
  orderInSeries?: number;
  materials?: StudyMaterial[];
}

export interface Tutor {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjectIds: string[];
  status: TutorStatus;
  students: number;
  rating: number;
  joinedDate: string;
  experience: string;
  bio: string;
  location: string;
  languages: string[];
  availability: string;
  classesThisMonth: number;
  totalClasses: number;
  completionRate: number;
  responseTime: string;
  qualifications: string[];
  recentStudents: { name: string; grade: string; progress: number }[];
  upcomingClasses: {
    subjectId: string;
    date: string;
    time: string;
    students: number;
  }[];
  monthlyEarnings: number;
  sessionPricing?: TutorSessionPricing;
  revenue?: TutorRevenue;
  resources?: TutorResource[];
  schedule?: TutorSchedule;
}

export type ParentStatus = "active" | "inactive" | "suspended";
export type PaymentStatus = "paid" | "unpaid" | "overdue" | "pending";
export type PlanId = "starter" | "family" | "premium" | "custom";

export interface ParentPlan {
  id: PlanId;
  name: string;
  price: number;
  color: string;
  maxChildren: number | null;
  resourceAccess: boolean;
  prioritySupport: boolean;
  description: string;
}

export interface Child {
  name: string;
  age: number;
  grade: string;
  studentId?: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: ParentStatus;
  children: Child[];
  paymentStatus: PaymentStatus;
  joinedDate: string;
  planId?: PlanId;
  notes?: string;
  totalPayments?: number;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  monthlyFee?: number;
}

export type StudentStatus = "actifs" | "inactifs" | "graduated";

export interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  parentName: string;
  status: StudentStatus;
  enrolledSubjects: string[];
  avgScore: number;
  attendanceRate: number;
  joinedDate: string;
  age: number;
}

export type ResourceType = "document" | "video" | "interactive";
export type ResourceStatus = "published" | "draft" | "archived";

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  subject: string;
  status: ResourceStatus;
  fileUrl?: string | null;
  views: number;
  downloads: number;
  uploadedBy: string;
  uploaderRole: string;
  uploadedDate: string;
  fileSize: string;
  tags: string[];
  isPaid?: boolean;
  price?: number | null; // in cents
}

export interface StatusStyle {
  background: string;
  color: string;
}
