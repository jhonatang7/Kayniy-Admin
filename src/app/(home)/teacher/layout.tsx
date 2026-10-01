import RoleGuard from "@/modules/auth/view/guards/role_guard";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={["admin"]}>{children}</RoleGuard>;
}