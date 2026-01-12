import { z } from "zod";
import { QuestionType } from "../../main/types/question.types";

// Schema para una opción individual
export const optionSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "La opción no puede estar vacía"),
  isCorrect: z.boolean(),
});

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
  points: z
    .number({ error: "Los puntos deben ser un número" })
    .min(1, "Los puntos deben ser al menos 1")
    .max(100, "Los puntos no pueden exceder 100"),
  options: z.array(optionSchema).min(2, "Debe haber al menos 2 opciones"),
}).superRefine((data, ctx) => {
  // Validar que al menos una opción esté marcada como correcta
  const hasCorrectOption = data.options.some(option => option.isCorrect);
  if (!hasCorrectOption) {
    ctx.addIssue({
      code: "custom",
      message: "Debe seleccionar al menos una respuesta correcta",
      path: ["options"],
    });
  }

  // Validar que todas las opciones tengan contenido
  data.options.forEach((option, index) => {
    if (!option.content || option.content.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "La opción no puede estar vacía",
        path: ["options", index, "content"],
      });
    }
  });
});

export type QuestionFormValues = z.infer<typeof questionSchema>;
export type OptionFormValues = z.infer<typeof optionSchema>;
