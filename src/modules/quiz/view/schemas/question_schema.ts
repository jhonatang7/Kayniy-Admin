import { z } from "zod";
import { QuestionType } from "../../main/types/question.types";

export const questionSchema = z.object({
  title: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(200, "El título no puede exceder 200 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres"),
  type: z.enum([QuestionType.UNIQUE_SELECTION, QuestionType.MULTIPLE_SELECTION], {
    message: "Selecciona un tipo de pregunta válido",
  }),
});

export type QuestionFormValues = z.infer<typeof questionSchema>;
