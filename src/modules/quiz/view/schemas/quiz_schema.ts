import { z } from "zod";

export const quizSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres"),
  passingScore: z
    .number()
    .min(0, "La puntuación mínima es 0")
    .max(100, "La puntuación máxima es 100"),
});

export type QuizFormValues = z.infer<typeof quizSchema>;
