"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateModuleSchema,
  UpdateModuleFormValues,
} from "../schemas/module_schema";
import { Button, Label, TextInput, Textarea, Select } from "flowbite-react";
import { HiPencilAlt, HiTrash } from "react-icons/hi";
import { RiPuzzleFill } from "react-icons/ri";
import { ModuleService } from "../../data/services/module_service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Module, ModuleState } from "../../main/types/module.types";
import { useEffect } from "react";

interface UpdateModuleFormProps {
  module: Module;
}

export default function UpdateModuleForm({ module }: UpdateModuleFormProps) {
  const router = useRouter();
  const { mutate: updateModule, isPending: isUpdating } =
    ModuleService.useUpdateModule();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<UpdateModuleFormValues>({
    resolver: zodResolver(updateModuleSchema),
    mode: "onChange",
    defaultValues: {
      title: module.title,
      description: module.description,
      state: module.state,
    },
  });

  // Actualizar valores cuando cambie el módulo
  useEffect(() => {
    setValue("title", module.title);
    setValue("description", module.description);
    setValue("state", module.state);
  }, [module, setValue]);

  const onSubmit = (data: UpdateModuleFormValues) => {
    updateModule(
      {
        id: module.id,
        data: {
          title: data.title,
          description: data.description,
          state: data.state,
        },
      },
      {
        onSuccess: () => {
          toast.success("Módulo actualizado exitosamente");
          router.push("/my-modules");
        },
        onError: (error: any) => {
          toast.error("Error al actualizar el módulo");
          console.error(
            "Error al actualizar el módulo:",
            error?.response?.data?.message || error.message
          );
        },
      }
    );
  };

  return (
    <div className="w-full lg:w-3/5 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center lg:text-left px-6 md:px-8">
          Editar Módulo
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

          {/* Campo: Estado */}
          <div>
            <Label htmlFor="state" className="mb-2">
              Estado
            </Label>
            <Select
              id="state"
              {...register("state")}
              color={errors.state ? "failure" : "gray"}
            >
              <option value={ModuleState.VERIFIED}>Verificado</option>
              <option value={ModuleState.NOT_VERIFIED}>No Verificado</option>
            </Select>
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">
                {errors.state.message}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={!isValid || isUpdating}
              color={isValid && !isUpdating ? "blue" : "gray"}
              className="flex-1 max-w-xs"
            >
              <HiPencilAlt className="mr-2 h-5 w-5" />
              {isUpdating ? "Actualizando..." : "Actualizar Módulo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
