"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { TokenClient } from "../../data/client/token_client";
import { AuthClient } from "../../data/client/auth_client";
import { AuthService } from "../../data/services/auth_service";
import { isPlatformRole } from "../../main/authorization";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading: isUserLoading, isError: isUserError } =
    AuthService.useMe(isClient);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkAuth = useCallback(async () => {
    setIsChecking(true);
    const token = TokenClient.getAccessToken();

    if (!token) {
      setIsChecking(false);
      setIsAuthorized(false);
      router.push("/login");
      return;
    }

    // Validar si el token expiró
    const isValid = TokenClient.validateToken();
    if (!isValid) {
      try {
        await AuthClient.refreshToken();
      } catch {
        TokenClient.removeToken();
        setIsChecking(false);
        setIsAuthorized(false);
        router.push("/login");
        return;
      }
    }

    setIsChecking(false);
  }, [router]);

  useEffect(() => {
    // Check auth on visibility change (tab focus)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAuth();
      }
    };

    // Check auth on window focus
    const handleWindowFocus = () => {
      checkAuth();
    };

    // Set up listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);

    // Do initial check
    checkAuth();

    // Cleanup listeners
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [checkAuth]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth, pathname]);

  useEffect(() => {
    if (isChecking || isUserLoading) return;

    if (isUserError || !user || !isPlatformRole(user.role)) {
      TokenClient.removeToken();
      setIsAuthorized(false);
      router.replace("/login");
      return;
    }

    setIsAuthorized(true);
  }, [isChecking, isUserError, isUserLoading, router, user]);

  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
};
