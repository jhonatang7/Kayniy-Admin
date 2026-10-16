import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "El nombre es requerido"),
  lastName: z.string().trim().min(1, "El apellido es requerido"),
  phoneNumber: z.string().trim().min(1, "El teléfono es requerido"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
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

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
