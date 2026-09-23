import { z } from "zod";

export const communitySchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre de la comunidad es requerido" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(100, { message: "El nombre no puede exceder 100 caracteres" }),

  description: z
    .string()
    .min(1, { message: "La descripción es requerida" })
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .max(500, { message: "La descripción no puede exceder 500 caracteres" }),
});

export type CommunityFormValues = z.infer<typeof communitySchema>;
