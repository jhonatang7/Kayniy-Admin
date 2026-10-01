"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaPhone, FaSave, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TeacherService } from "../../data/services/teacher_service";
import { Teacher } from "../../main/types/teacher.types";
import {
  CreateTeacherFormValues,
  createTeacherSchema,
} from "../schemas/teacher_schema";

interface TeacherFormProps {
  teacher?: Teacher;
}

export default function TeacherForm({ teacher }: TeacherFormProps) {
  const router = useRouter();
  const isEditing = Boolean(teacher);
  const { mutate: createTeacher, isPending: isCreating } =
    TeacherService.useCreateTeacher();
  const { mutate: updateTeacher, isPending: isUpdating } =
    TeacherService.useUpdateTeacher();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateTeacherFormValues>({
    resolver: zodResolver(createTeacherSchema),
    mode: "onChange",
    defaultValues: {
      firstName: teacher?.firstName ?? "",
      lastName: teacher?.lastName ?? "",
      email: teacher?.email ?? "",
      phoneNumber: teacher?.phoneNumber ?? "",
    },
  });

  const onSubmit = (data: CreateTeacherFormValues) => {
    if (teacher) {
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      };

      updateTeacher(
        { id: teacher.id, data: updateData },
        {
          onSuccess: () => {
            toast.success("Profesor actualizado correctamente");
            router.push("/teacher");
          },
          onError: () => toast.error("No fue posible actualizar al profesor"),
        },
      );
      return;
    }

    createTeacher(data, {
      onSuccess: () => {
        toast.success("Profesor creado correctamente");
        router.push("/teacher");
      },
      onError: () => toast.error("No fue posible crear al profesor"),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="firstName" className="mb-2 block">
            Nombres
          </Label>
          <TextInput
            id="firstName"
            type="text"
            icon={FaUser}
            placeholder="Ej. María"
            color={errors.firstName ? "failure" : "gray"}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="lastName" className="mb-2 block">
            Apellidos
          </Label>
          <TextInput
            id="lastName"
            type="text"
            icon={FaUser}
            placeholder="Ej. García López"
            color={errors.lastName ? "failure" : "gray"}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="mb-2 block">
            Correo electrónico
          </Label>
          <TextInput
            id="email"
            type="email"
            icon={FaEnvelope}
            placeholder="profesor@ejemplo.com"
            color={isEditing ? "gray" : errors.email ? "failure" : "gray"}
            readOnly={isEditing}
            className={
              isEditing
                ? "cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                : ""
            }
            {...register("email")}
          />
          {errors.email && !isEditing && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
          {isEditing && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              El correo no se puede modificar.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phoneNumber" className="mb-2 block">
            Teléfono
          </Label>
          <TextInput
            id="phoneNumber"
            type="tel"
            icon={FaPhone}
            placeholder="Ej. 300 123 4567"
            color={errors.phoneNumber ? "failure" : "gray"}
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-700">
        <Button type="button" color="light" onClick={() => router.push("/teacher")}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!isValid || isPending}>
          <FaSave className="mr-2" />
          {isPending
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Crear profesor"}
        </Button>
      </div>
    </form>
  );
}