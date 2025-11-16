import { z } from "zod";
import { ModuleState } from "../../main/types/module.types";

export const moduleSchema = z.object({
  title: z
    .string()
    .min(1, { message: "El nombre del módulo es requerido" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(100, { message: "El nombre no puede exceder 100 caracteres" }),

  description: z
    .string()
    .min(1, { message: "La descripción es requerida" })
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .max(500, { message: "La descripción no puede exceder 500 caracteres" }),
});

export const updateModuleSchema = moduleSchema.extend({
  state: z.nativeEnum(ModuleState, {
    message: "Selecciona un estado válido",
  }),
});

export type ModuleFormValues = z.infer<typeof moduleSchema>;
export type UpdateModuleFormValues = z.infer<typeof updateModuleSchema>;
