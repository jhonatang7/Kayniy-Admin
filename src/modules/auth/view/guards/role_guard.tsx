"use client";

import Loading from "@/@core/view/components/Loading";
import { canAccessRole, PlatformRole } from "../../main/authorization";
import { AuthService } from "../../data/services/auth_service";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: PlatformRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { data: user, isLoading, isError } = AuthService.useMe();
  const isAllowed = canAccessRole(user?.role, allowedRoles);

  useEffect(() => {
    if (!isLoading && (isError || !isAllowed)) {
      router.replace("/dashboard");
    }
  }, [isAllowed, isError, isLoading, router]);

  if (isLoading || !isAllowed) {
    return <Loading />;
  }

  return <>{children}</>;
}