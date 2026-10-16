import { z } from "zod";

export const liveClassSchema = z.object({
  title: z.string().trim().min(3, "El título debe tener al menos 3 caracteres").max(150),
  description: z.string().trim().min(10, "La descripción debe tener al menos 10 caracteres").max(1000),
  startedDate: z.string().min(1, "La fecha de inicio es requerida"),
  transmitionLink: z.url("Ingresa un enlace válido"),
  duration: z.number().int().positive("La duración debe ser mayor que cero"),
});

export type LiveClassFormValues = z.infer<typeof liveClassSchema>;