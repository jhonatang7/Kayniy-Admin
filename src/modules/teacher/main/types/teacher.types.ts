import { Role } from "@/modules/auth/main/types/auth.types";

export interface Teacher {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: Role;
}

export interface CreateTeacherRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface UpdateTeacherRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}