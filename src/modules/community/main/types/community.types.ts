export interface Community {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface CreateCommunityRequest {
  name: string;
  description: string;
}

export interface AddCommunityMembersRequest {
  communityRole: "TEACHER" | "STUDENT";
  communityId: string;
  userIds: string[];
}

export interface CommunityMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: string;
}

export interface CommunityMemberWithCommunity {
  id: string,
  communityRole: "TEACHER" | "STUDENT",
  joinedDate: Date,
  user: CommunityMember,
}
