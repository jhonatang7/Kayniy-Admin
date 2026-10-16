import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email("Correo inválido").min(1, "El correo es requerido"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
