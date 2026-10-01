import { Role } from "@/modules/auth/main/types/auth.types";

export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: Role;
}

export interface CreateAdminRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}