"use client";

import FirstLoginPasswordForm from "@/modules/auth/view/components/first_login_password_form";

export default function FirstLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <FirstLoginPasswordForm />
    </main>
  );
}
