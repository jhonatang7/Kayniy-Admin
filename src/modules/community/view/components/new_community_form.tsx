"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  communitySchema,
  CommunityFormValues,
} from "../schemas/community_schema";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { HiDocumentText, HiPencilAlt, HiUserGroup } from "react-icons/hi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CommunityService } from "../../data/services/community_service";

export default function NewCommunityForm() {
  const router = useRouter();
  const { mutate: createCommunity, isPending } =
    CommunityService.useCreateCommunity();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CommunityFormValues>({
    resolver: zodResolver(communitySchema),
    mode: "onChange",
  });

  const onSubmit = (data: CommunityFormValues) => {
    createCommunity(
      { ...data },
      {
        onSuccess: () => {
          console.log("Comunidad creada exitosamente");
          reset();
          toast.success("Comunidad creada exitosamente");
          router.push("/community");
        },
        onError: (error: any) => {
          toast.error("Error al crear la comunidad");
          console.error(
            "Error al crear la comunidad:",
            error?.response?.data?.message || error.message,
          );
        },
      },
    );
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 w-full">
      <div className="w-full max-w-2xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-6 p-6 md:p-8 rounded-lg shadow-lg"
        >
          <div>
            <Label htmlFor="name" className="mb-2">
              Nombre de la Comunidad
            </Label>
            <TextInput
              id="name"
              {...register("name")}
              type="text"
              placeholder="Ej: Comunidad de programación"
              color={errors.name ? "failure" : "gray"}
              icon={HiUserGroup}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="mb-2">
              Descripción
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe la comunidad, sus objetivos y temática..."
              rows={5}
              color={errors.description ? "failure" : "gray"}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              type="submit"
              disabled={!isValid}
              color={isValid ? "blue" : "gray"}
              className="flex-1"
            >
              <HiPencilAlt className="mr-2 h-5 w-5" />
              Crear Comunidad
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
