"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, Modal, ModalBody, ModalHeader, Spinner, TextInput, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineExclamationCircle, HiPencilAlt, HiTrash, HiUserGroup } from "react-icons/hi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CommunityService } from "../../data/services/community_service";
import { communitySchema, CommunityFormValues } from "../schemas/community_schema";

interface EditCommunityFormProps {
  communityId: string;
}

export default function EditCommunityForm({ communityId }: EditCommunityFormProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    data: community,
    isLoading: isLoadingCommunity,
    isError: isCommunityError,
  } = CommunityService.useCommunity(communityId);
  const { mutate: updateCommunity, isPending: isUpdating } =
    CommunityService.useUpdateCommunity();
  const { mutate: deleteCommunity, isPending: isDeleting } =
    CommunityService.useDeleteCommunity();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CommunityFormValues>({
    resolver: zodResolver(communitySchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (community) {
      reset({
        name: community.name,
        description: community.description,
      });
    }
  }, [community, reset]);

  const onSubmit = (data: CommunityFormValues) => {
    updateCommunity(
      { id: communityId, data },
      {
        onSuccess: () => {
          toast.success("Comunidad actualizada exitosamente");
          router.push("/community");
        },
        onError: () => toast.error("Error al actualizar la comunidad"),
      },
    );
  };

  const handleDelete = () => {
    deleteCommunity(communityId, {
      onSuccess: () => {
        toast.success("Comunidad eliminada exitosamente");
        router.push("/community");
      },
      onError: () => toast.error("No fue posible eliminar la comunidad"),
    });
  };

  if (isLoadingCommunity) {
    return (
      <div className="flex items-center justify-center gap-2 p-8 text-gray-500">
        <Spinner size="sm" /> Cargando comunidad...
      </div>
    );
  }

  if (isCommunityError || !community) {
    return (
      <p className="p-8 text-center text-sm text-red-600">
        No fue posible cargar la comunidad.
      </p>
    );
  }

  return (
    <div className="flex w-full flex-1 items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-6 rounded-lg p-6 shadow-lg md:p-8"
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

          <Button
            type="submit"
            disabled={!isValid || isUpdating || isDeleting}
            color={isValid ? "blue" : "gray"}
          >
            <HiPencilAlt className="mr-2 h-5 w-5" />
            {isUpdating ? "Guardando..." : "Guardar cambios"}
          </Button>

          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Eliminar comunidad
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Esta acción eliminará la comunidad de forma permanente.
                </p>
              </div>
              <Button
                type="button"
                color="red"
                disabled={isUpdating || isDeleting}
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <HiTrash className="mr-2 h-5 w-5" />
                Eliminar
              </Button>
            </div>
          </div>
        </form>
      </div>

      <Modal
        show={isDeleteModalOpen}
        size="md"
        popup
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              ¿Eliminar esta comunidad?
            </h2>
            <p className="mb-5 mt-2 text-gray-500 dark:text-gray-400">
              {community.name}
            </p>
            <p className="mb-5 text-base italic text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Nota:</span> Esta acción no se podrá deshacer.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                color="red"
                disabled={isDeleting}
                onClick={() => {
                  handleDelete();
                  setIsDeleteModalOpen(false);
                }}
              >
                {isDeleting ? "Eliminando..." : "Sí, estoy seguro"}
              </Button>
              <Button
                color="alternative"
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                No, cancelar
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
