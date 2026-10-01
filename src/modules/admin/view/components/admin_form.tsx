"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaPhone, FaSave, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AdminService } from "../../data/services/admin_service";
import {
  createAdminSchema,
  CreateAdminFormValues,
} from "../schemas/admin_schema";

export default function AdminForm() {
  const router = useRouter();
  const { mutate: createAdmin, isPending } = AdminService.useCreateAdmin();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateAdminFormValues>({
    resolver: zodResolver(createAdminSchema),
    mode: "onChange",
  });

  const onSubmit = (data: CreateAdminFormValues) => {
    createAdmin(data, {
      onSuccess: () => {
        toast.success("Administrador creado correctamente");
        router.push("/admin");
      },
      onError: () => toast.error("No fue posible crear al administrador"),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Label htmlFor="firstName" className="mb-2 block">Nombres</Label>
          <TextInput
            id="firstName"
            type="text"
            icon={FaUser}
            placeholder="Ej. María"
            color={errors.firstName ? "failure" : "gray"}
            {...register("firstName")}
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
        </div>

        <div>
          <Label htmlFor="lastName" className="mb-2 block">Apellidos</Label>
          <TextInput
            id="lastName"
            type="text"
            icon={FaUser}
            placeholder="Ej. García López"
            color={errors.lastName ? "failure" : "gray"}
            {...register("lastName")}
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="mb-2 block">Correo electrónico</Label>
          <TextInput
            id="email"
            type="email"
            icon={FaEnvelope}
            placeholder="admin@ejemplo.com"
            color={errors.email ? "failure" : "gray"}
            {...register("email")}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="phoneNumber" className="mb-2 block">Teléfono</Label>
          <TextInput
            id="phoneNumber"
            type="tel"
            icon={FaPhone}
            placeholder="Ej. 300 123 4567"
            color={errors.phoneNumber ? "failure" : "gray"}
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-700">
        <Button type="button" color="light" onClick={() => router.push("/admin")}>Cancelar</Button>
        <Button type="submit" disabled={!isValid || isPending}>
          <FaSave className="mr-2" />
          {isPending ? "Guardando..." : "Crear administrador"}
        </Button>
      </div>
    </form>
  );
}