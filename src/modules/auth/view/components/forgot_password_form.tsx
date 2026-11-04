"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { HiEnvelope } from "react-icons/hi2";
import toast from "react-hot-toast";
import { AuthService } from "../../data/services/auth_service";
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "../schemas/forgot_password_schema";

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });
  const { mutate: forgotPassword, isPending } = AuthService.useForgotPassword();

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPassword(data, {
      onSuccess: () => {
        reset();
        toast.success("Revisa tu correo para continuar con la recuperación");
      },
      onError: () => {
        toast.error("No fue posible enviar el correo de recuperación");
      },
    });
  };

  return (
    <Card className="w-full max-w-lg border-gray-700 bg-gray-900 text-white">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">
          Recuperar contraseña
        </h1>
        <p className="mt-2 text-sm text-gray-300">
          Ingresa tu correo y te enviaremos un enlace para restablecerla.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="email" className="text-gray-200">Correo electrónico</Label>
          <TextInput
            id="email"
            type="email"
            placeholder="tu-correo@ejemplo.com"
            icon={() => <HiEnvelope className="mr-2 h-5 w-5" />}
            {...register("email")}
            color={errors.email ? "failure" : "gray"}
            className="!border-gray-600 !bg-gray-800 !text-white placeholder:!text-gray-400"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={!isValid || isPending}>
          {isPending ? "Enviando..." : "Enviar enlace"}
        </Button>
      </form>

      <Link
        href="/login"
        className="text-center text-sm font-medium text-blue-400 hover:underline"
      >
        Volver al inicio de sesión
      </Link>
    </Card>
  );
}
