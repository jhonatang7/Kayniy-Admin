"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { moduleSchema, ModuleFormValues } from "../schemas/module_schema";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { HiDocumentText, HiPencilAlt } from "react-icons/hi";
import { RiPuzzleFill } from "react-icons/ri";
import { ModuleService } from "../../data/services/module_service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewModuleForm() {
  const router = useRouter();
  const { mutate: createModule, isPending } = ModuleService.useCreateModule();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    mode: "onChange",
  });

  const onSubmit = (data: ModuleFormValues) => {
    createModule(
      { ...data, communityId: "a4cd8f98-a82a-4b80-b208-ecfef18aedcb" },
      {
        onSuccess: () => {
          console.log("Módulo creado exitosamente");
          reset();
          toast.success("Módulo creado exitosamente");
          router.push("/my-modules");
        },
        onError: (error: any) => {
          toast.error("Error al crear el módulo");
          console.error(
            "Error al crear el módulo:",
            error?.response?.data?.message || error.message
          );
        },
      }
    );
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Crear Nuevo Módulo
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-6 p-6 md:p-8 rounded-lg shadow-lg"
        >
          {/* Campo: Nombre del módulo */}
          <div>
            <Label htmlFor="title" className="mb-2">
              Nombre del Módulo
            </Label>
            <TextInput
              id="title"
              {...register("title")}
              type="text"
              placeholder="Ej: Saludos y presentaciones"
              color={errors.title ? "failure" : "gray"}
              icon={RiPuzzleFill}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Campo: Descripción */}
          <div>
            <Label htmlFor="description" className="mb-2">
              Descripción
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe el contenido y objetivos del módulo..."
              rows={5}
              color={errors.description ? "failure" : "gray"}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 mt-6">
            <Button
              type="submit"
              disabled={!isValid || isPending}
              color={isValid && !isPending ? "blue" : "gray"}
              className="flex-1"
            >
              <HiPencilAlt className="mr-2 h-5 w-5" />
              {isPending ? "Creando..." : "Crear Módulo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
