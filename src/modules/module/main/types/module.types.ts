import { Lesson } from "@/modules/lesson/main/lesson.types";

export interface Module {
  id: string;
  title: string;
  description: string;
  state: ModuleState;
  registeredDate: Date;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export enum ModuleState {
  VERIFIED = 'VERIFIED',
  NOT_VERIFIED = 'NOT_VERIFIED',
}

export interface CreateModuleRequest {
  title: string;
  description: string;
  communityId: string;
}

export interface UpdateModuleRequest {
  title?: string;
  description?: string;
  state?: ModuleState;
}
