import { Role } from "./types/auth.types";

export type PlatformRole = "superAdmin" | "admin" | "teacher";

export function getRoleName(role: Role | string | null | undefined): string {
  if (typeof role === "string") return role;
  return role?.name ?? "";
}

export function isPlatformRole(role: Role | string | null | undefined): boolean {
  return ["superAdmin", "admin", "teacher"].includes(getRoleName(role));
}

export function canAccessRole(
  role: Role | string | null | undefined,
  allowedRoles: PlatformRole[],
): boolean {
  const roleName = getRoleName(role);
  return roleName === "superAdmin" || allowedRoles.includes(roleName as PlatformRole);
}