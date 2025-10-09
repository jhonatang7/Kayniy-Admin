import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Correo inválido").min(1, "Su correo es requerido"),

  password: z
    .string()
    .min(1, { message: "Su contraseña es requerida" })
    .regex(/(?=.*[a-z])/, {
      message: "La contraseña debe tener al menos una letra minúscula",
    })
    .regex(/(?=.*[A-Z])/, {
      message: "La contraseña debe tener al menos una letra mayúscula",
    })
    .regex(/(?=.*\d)/, {
      message: "La contraseña debe tener al menos un número",
    }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
