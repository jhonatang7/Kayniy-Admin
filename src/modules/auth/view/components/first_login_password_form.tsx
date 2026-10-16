"use client";

import { Button, Card, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiLockClosed } from "react-icons/hi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthService } from "../../data/services/auth_service";
import {
  firstLoginPasswordSchema,
  FirstLoginPasswordFormValues,
} from "../schemas/first_login_password_schema";

export default function FirstLoginPasswordForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FirstLoginPasswordFormValues>({
    resolver: zodResolver(firstLoginPasswordSchema),
    mode: "onChange",
  });
  const { mutate: setPassword, isPending } =
    AuthService.useSetFirstLoginPassword();

  const onSubmit = ({ newPassword }: FirstLoginPasswordFormValues) => {
    setPassword(
      { newPassword },
      {
        onSuccess: () => {
          toast.success("Contraseña actualizada correctamente");
          router.replace("/dashboard");
        },
        onError: () => toast.error("No fue posible actualizar la contraseña"),
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
          Actualiza tu contraseña
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Por seguridad, establece una contraseña personal para continuar.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="newPassword">Nueva contraseña</Label>
          <TextInput
            id="newPassword"
            type="password"
            placeholder="Ingresa tu nueva contraseña"
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
          {isPending ? "Guardando..." : "Guardar contraseña"}
        </Button>
      </form>
    </Card>
  );
}
