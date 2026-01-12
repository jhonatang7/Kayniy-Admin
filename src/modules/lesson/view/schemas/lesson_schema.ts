import { z } from "zod";
import { LessonType } from "../../main/lesson.types";

// Schema base sin validación de URL (se validará según el tipo)
export const lessonSchema = z.object({
  title: z
    .string()
    .min(1, { message: "El título de la lección es requerido" })
    .min(3, { message: "El título debe tener al menos 3 caracteres" })
    .max(100, { message: "El título no puede exceder 100 caracteres" }),

  description: z
    .string()
    .min(1, { message: "La descripción es requerida" })
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .max(500, { message: "La descripción no puede exceder 500 caracteres" }),

  type: z.enum([LessonType.VIDEO, LessonType.DOCUMENT], {
    message: "Selecciona un tipo de lección válido",
  }),

  urlContent: z.string().optional(),

  duration: z
    .number({
      message: "La duración debe ser un número",
    })
    .min(1, { message: "La duración debe ser al menos 1 minuto" })
    .max(300, { message: "La duración no puede exceder 300 minutos" }),
}).superRefine((data, ctx) => {
  // Validar URL solo si es tipo VIDEO
  if (data.type === LessonType.VIDEO) {
    if (!data.urlContent || data.urlContent.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La URL del video es requerida",
        path: ["urlContent"],
      });
      return;
    }
    
    // Validar formato de URL
    try {
      new URL(data.urlContent);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Debe ser una URL válida",
        path: ["urlContent"],
      });
    }
  }
  
  // Para DOCUMENT, la validación del archivo se hace en el componente
});

export type LessonFormValues = z.infer<typeof lessonSchema>;
