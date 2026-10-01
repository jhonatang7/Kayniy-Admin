import RoleGuard from "@/modules/auth/view/guards/role_guard";

export default function MyModulesLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={["teacher"]}>{children}</RoleGuard>;
}