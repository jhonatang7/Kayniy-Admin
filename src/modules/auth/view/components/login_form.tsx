import Image from "next/image";
import { Label, TextInput, Button } from "flowbite-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "../schemas/login_schema";
import { useRouter } from "next/navigation";
import { HiLockClosed } from "react-icons/hi";
import { HiEnvelope } from "react-icons/hi2";
import { AuthService } from "../../data/services/auth_service";
import toast from "react-hot-toast";
import { useState } from "react";
import Loading from "@/@core/view/components/Loading";

export default function LoginForm() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Esto habilita la validación en tiempo real
  });

  const { mutate: login, isPending } = AuthService.useLogin();

  const onSubmit = (data: LoginFormValues) => {
    login(data, {
      onSuccess: (data) => {
        setIsRedirecting(true);
        toast.success("Inicio de sesión exitoso. Cargando tu dashboard...");
        router.replace(data.user.isFirstLogin ? "/first-login" : "/dashboard");
      },
      onError: () => {
        toast.error("No fue posible iniciar sesión. Verifica tus credenciales.");
      },
    });
  };

  return (
    <>
      {isRedirecting && <Loading />}
      <div className="flex w-full flex-col items-center justify-center bg-gray-950 p-8 text-white md:w-1/2">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/logo.svg" // Cambia esto por la ruta de tu logo
          alt="Logo"
          width={100}
          height={100}
          priority
        />
      </div>
      {/* Login Form */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-lg flex-col rounded-lg border border-gray-700 bg-gray-900 p-8 shadow-lg"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white">Inicio de Sesión</h2>
        </div>
        <div className="mb-5 w-full">
          <Label className="text-gray-200">Tu Email</Label>
          <TextInput
            {...register("email")}
            placeholder="Ingresa tu email"
            color={errors.email ? "failure" : "gray"}
            className="!border-gray-600 !bg-gray-800 !text-white placeholder:!text-gray-400"
            icon={() => <HiEnvelope className="mr-2 h-5 w-5" />}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-5">
          <Label className="text-gray-200">Tu contraseña</Label>
          <TextInput
            {...register("password")}
            type="password"
            placeholder="*******"
            color={errors.password ? "failure" : "gray"}
            className="!border-gray-600 !bg-gray-800 !text-white placeholder:!text-gray-400"
            icon={() => <HiLockClosed className="mr-2 h-5 w-5" />}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-300">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="flex justify-end mb-4">
          <Link
            href="/forgot-password"
            className="font-medium text-blue-400 hover:text-blue-300 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Button
          type="submit"
          disabled={!isValid || isPending}
          color={isValid ? "blue" : "gray"}
        >
          {isPending ? "Cargando..." : "Iniciar sesión"}
        </Button>
      </form>
      </div>
    </>
  );
}
