"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiLockClosed } from "react-icons/hi";
import toast from "react-hot-toast";
import { AuthService } from "../../data/services/auth_service";
import {
  passwordSchema,
  PasswordFormValues,
} from "../schemas/password_schema";

export default function ResetPasswordForm() {
  const [token, setToken] = useState("");
  const [hasToken, setHasToken] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
  });
  const { mutate: resetPassword, isPending, isSuccess } =
    AuthService.useResetPassword();

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get("token");
    setToken(urlToken ?? "");
    setHasToken(Boolean(urlToken));
  }, []);

  const onSubmit = ({ newPassword }: PasswordFormValues) => {
    if (!token) {
      toast.error("El enlace de recuperación no contiene un token válido");
      return;
    }

    resetPassword(
      { token, newPassword },
      {
        onSuccess: () => {
          toast.success("Contraseña restablecida correctamente");
        },
        onError: () => {
          toast.error("El enlace es inválido o ha expirado");
        },
      },
    );
  };

  return (
    <Card className="w-full max-w-lg">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <HiLockClosed className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Restablecer contraseña
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Crea una nueva contraseña para recuperar el acceso a tu cuenta.
        </p>
      </div>

      {!hasToken ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-red-600">
            El enlace no contiene un token de recuperación válido.
          </p>
          <Link
            href="/forgot-password"
            className="block text-sm font-medium text-blue-600 hover:underline"
          >
            Solicitar un nuevo enlace
          </Link>
        </div>
      ) : isSuccess ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-green-600">
            Tu contraseña fue actualizada correctamente.
          </p>
          <Link
            href="/login"
            className="block text-sm font-medium text-blue-600 hover:underline"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <TextInput
              id="newPassword"
              type="password"
              placeholder="Ingresa tu nueva contraseña"
              icon={() => <HiLockClosed className="mr-2 h-5 w-5" />}
              {...register("newPassword")}
              color={errors.newPassword ? "failure" : "gray"}
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <TextInput
              id="confirmPassword"
              type="password"
              placeholder="Repite tu nueva contraseña"
              icon={() => <HiLockClosed className="mr-2 h-5 w-5" />}
              {...register("confirmPassword")}
              color={errors.confirmPassword ? "failure" : "gray"}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={!isValid || isPending}>
            {isPending ? "Guardando..." : "Restablecer contraseña"}
          </Button>
        </form>
      )}
    </Card>
  );
}
