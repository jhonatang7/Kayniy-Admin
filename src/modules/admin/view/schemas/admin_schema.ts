import { z } from "zod";

export const createAdminSchema = z.object({
  firstName: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().trim().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.email("Correo inválido").min(1, "El correo es requerido"),
  phoneNumber: z.string().trim().min(1, "El teléfono es requerido"),
});

export type CreateAdminFormValues = z.infer<typeof createAdminSchema>;