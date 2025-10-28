"use client";

import LoginForm from "@/modules/auth/view/components/login_form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-[#155DFC] justify-center flex-col items-center">
        <img src="/image_frontPage.png" className="max-w-3xl" />
        <h2 className="text-white text-6xl font-bold text-center px-8 mt-16 mb-4">
          Plataforma Administrativa
        </h2>
        <h4 className="text-lg text-white font-semibold text-center">
          Que la distancia no te canse, que el tiempo no te acorte, enseña sin
          limites.
        </h4>
      </div>
      <LoginForm />
    </div>
  );
}
