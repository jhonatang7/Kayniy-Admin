import Image from "next/image";
import { Label, TextInput, Button } from "flowbite-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "../schemas/login_schema";
import { useRouter } from "next/navigation";
import { HiCheckCircle, HiLockClosed } from "react-icons/hi";
import { HiEnvelope } from "react-icons/hi2";
import { AuthService } from "../../data/services/auth_service";

export default function LoginForm() {
  const router = useRouter();
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
    // Aquí puedes manejar el envío del formulario
    console.log("Form data:", data);
    login(data, {
      onSuccess: (data) => {
        console.log("Login successful> ", data);
        router.push("/dashboard"); // Redirige a la página de inicio después del login
      },
      onError: (error) => {
        console.error("Login error:", error);
      },
    });
  };

  return (
    <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8">
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
        className="w-full flex flex-col mx-auto max-w-lg shadow-lg p-8 rounded-lg"
      >
        <div className="mb-8">
          <h2 className="text-3xl font-semibold">Inicio de Sesión</h2>
        </div>
        <div className="mb-5 w-full">
          <Label>Tu Email</Label>
          <TextInput
            {...register("email")}
            placeholder="Ingresa tu email"
            color={errors.email ? "failure" : "gray"}
            icon={() => <HiEnvelope className="mr-2 h-5 w-5" />}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-5">
          <Label>Tu contraseña</Label>
          <TextInput
            {...register("password")}
            type="password"
            placeholder="*******"
            color={errors.password ? "failure" : "gray"}
            icon={() => <HiLockClosed className="mr-2 h-5 w-5" />}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="flex justify-end mb-4">
          <a
            href="#"
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </a>
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
  );
}
