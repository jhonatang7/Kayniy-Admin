export interface Course {
  id: string;
  name: string;
  description: string;
  level: CourseLevel;
  registeredDate: string;
  isDeleted: boolean;
  community: {
    id: string;
    name: string;
  };
}

export interface CourseLesson {
  id: string;
  title: string;
  description: string;
  urlContent: string;
  duration: number;
  order: number;
  type: string;
}

export interface CourseModuleContent {
  id: string;
  title: string;
  description: string;
  state: string;
  registeredDate: string;
  lessons: CourseLesson[];
}

export interface CourseModuleRelation {
  id: string;
  order: number;
  module: CourseModuleContent;
}

export interface CourseWithContent extends Course {
  courseModules: CourseModuleRelation[];
}

export type CourseLevel = "Basic" | "Medium" | "Hard";

export interface CreateCourseModuleRequest {
  moduleId: string;
  order: number;
}

export interface CreateCourseRequest {
  name: string;
  description: string;
  level: CourseLevel;
  userId: string;
  communityId: string;
  modules: CreateCourseModuleRequest[];
}

export interface UpdateCourseRequest {
  name: string;
  description: string;
  level: CourseLevel;
}

export interface CourseModuleOrderItem {
  moduleId: string;
  order: number;
}

export interface ReorderCourseModulesRequest {
  courseId: string;
  modules: CourseModuleOrderItem[];
}
