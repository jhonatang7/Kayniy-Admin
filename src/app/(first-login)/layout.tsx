import { AuthGuard } from "@/modules/auth/view/guards/auth_guard";

export default function FirstLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
