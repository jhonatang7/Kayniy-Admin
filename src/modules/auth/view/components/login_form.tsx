import Image from "next/image";
import { Label, TextInput, Button } from "flowbite-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "../schemas/login_schema";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Esto habilita la validación en tiempo real
  });

  const onSubmit = (data: LoginFormValues) => {
    // Aquí puedes manejar el envío del formulario
    console.log("Form data:", data);
  };

  return (
    <div className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/logo.svg" // Cambia esto por la ruta de tu logo
          alt="Logo"
          width={150}
          height={150}
          priority
        />
      </div>
      {/* Login Form */}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col mx-auto max-w-lg">
        <div className="mb-5 w-full">
          <Label>Tu Email</Label>
          <TextInput
            {...register("email")}
            placeholder="Ingresa tu email"
            color={errors.email ? "failure" : "gray"}
            icon={() => (
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-width="2"
                  d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                />
              </svg>
            )}
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
            icon={() => (
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
                />
              </svg>
            )}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
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
          disabled={!isValid}
          color={isValid ? "blue" : "gray"}
        >
          Iniciar sesión
        </Button>
      </form>
    </div>
  );
}
