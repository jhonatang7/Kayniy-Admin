import { z } from "zod";
import { CourseLevel } from "../../main/types/course.types";

export const courseSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre del curso es requerido" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(100, { message: "El nombre no puede exceder 100 caracteres" }),
  description: z
    .string()
    .min(1, { message: "La descripción es requerida" })
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .max(500, { message: "La descripción no puede exceder 500 caracteres" }),
  level: z.enum(["Basic", "Medium", "Hard"] as [CourseLevel, ...CourseLevel[]], {
    message: "Selecciona un nivel válido",
  }),
});

export type CourseFormValues = z.infer<typeof courseSchema>;