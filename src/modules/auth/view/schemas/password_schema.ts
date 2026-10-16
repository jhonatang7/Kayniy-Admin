import { z } from "zod";

export const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/(?=.*[a-z])/, "Debe incluir al menos una letra minúscula")
      .regex(/(?=.*[A-Z])/, "Debe incluir al menos una letra mayúscula")
      .regex(/(?=.*\d)/, "Debe incluir al menos un número"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type PasswordFormValues = z.infer<typeof passwordSchema>;
