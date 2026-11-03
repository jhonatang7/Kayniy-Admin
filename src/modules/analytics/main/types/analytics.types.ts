export type FunnelStage = "enrolled" | "moduleActivity" | "completed";

export interface FunnelMetric {
  stage: FunnelStage;
  count: number;
  rate: number;
}

export interface AnalyticsExample {
  funnel: {
    totalEnrollments: number;
    stages: FunnelMetric[];
    dropoutRate: number;
  };
  cohorts: Array<{
    registrationMonth: string;
    completionMonth: string;
    completedLessons: number;
  }>;
  enrollmentTreemap: Array<{
    communityId: string;
    community: string;
    course: string;
    level: string;
    enrollments: number;
  }>;
}

export interface AnalyticsQuery {
  courseId?: string;
  communityId?: string;
  startDate?: string;
  endDate?: string;
}

export interface AnalyticsCourse {
  id: string;
  name: string;
  description: string;
  level: string;
  registeredDate: string;
  isDeleted: boolean;
}

export interface AnalyticsCommunity {
  id: string;
  name: string;
  description: string;
  registeredDate: string;
  deletedAt: string | null;
}

export interface QuizBottleneckAnalytics {
  quizId: string;
  quiz: string;
  averageScore: number;
  failedAttempts: number;
  totalAttempts: number;
  failedRate: number;
}

export interface StudentRiskAnalytics {
  studentId: string;
  student: string;
  courseProgress: number;
  averageScore: number;
}

export interface ActivityByWeekdayHourAnalytics {
  weekday: number;
  hour: number;
  completedLessons: number;
}

export type AdminFunnelResponse = AnalyticsExample["funnel"];
export type AdminCohortsResponse = AnalyticsExample["cohorts"];
export type AdminTreemapResponse = AnalyticsExample["enrollmentTreemap"];
export type ProfessorBottlenecksAnalytics = QuizBottleneckAnalytics[];
export type ProfessorStudentRiskAnalytics = StudentRiskAnalytics[];
export type ProfessorActivityAnalytics = ActivityByWeekdayHourAnalytics[];
