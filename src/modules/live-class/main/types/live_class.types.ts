export interface LiveClass {
  id: string;
  community_id: string;
  title: string;
  description: string;
  startedDate: string;
  transmitionLink: string;
  profesor_id: string;
  duration: number;
  expiresAt: string;
  isDeleted: boolean;
  registeredDate: string;
}

export interface CreateLiveClassRequest {
  communityId: string;
  title: string;
  description: string;
  startedDate: string;
  transmitionLink: string;
  professorId: string;
  duration: number;
  expiresAt: string;
}

export type UpdateLiveClassRequest = Omit<
  CreateLiveClassRequest,
  "communityId" | "professorId"
>;