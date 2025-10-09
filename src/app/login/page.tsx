"use client";

import LoginForm from "@/modules/auth/view/components/login_form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex w-1/2 bg-[#155DFC] items-center justify-center">
        {/* Puedes agregar aquí una imagen, texto o dejarlo vacío */}
        <h2 className="text-white text-3xl font-bold text-center px-8">
          ¡Bienvenido de nuevo!
        </h2>
      </div>
      <LoginForm />
      {/* Right side: Blue background */}
    </div>
  );
}
