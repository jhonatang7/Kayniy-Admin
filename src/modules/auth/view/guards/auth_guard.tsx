"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { TokenClient } from "../../data/client/token_client";
import { jwtDecode } from "jwt-decode";
import { AuthClient } from "../../data/client/auth_client";

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    setIsChecking(true);
    const token = TokenClient.getAccessToken();

    if (!token) {
      setIsChecking(false);
      router.push("/login");
      return;
    }

    // Validar si el token expiró
    const isValid = TokenClient.validateToken();
    if (!isValid) {
      try {
        await AuthClient.refreshToken();
      } catch (error) {
        TokenClient.removeToken();
        setIsChecking(false);
        router.push("/login");
      }
    }

    setIsChecking(false);
  };

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
  }, []);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  // if (isChecking) {
  //   return (
  //     <div className="flex h-screen w-screen items-center justify-center">
  //       <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }

  return (
    <>
      {children}

      {isChecking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      )}
    </>
  );
};
