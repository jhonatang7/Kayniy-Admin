"use client";

import Loading from "@/@core/view/components/Loading";
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TeacherService } from "../../data/services/teacher_service";
import TeacherForm from "./teacher_form";

export default function TeacherEdit({ teacherId }: { teacherId: string }) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    data: teacher,
    isLoading,
    isError,
  } = TeacherService.useTeacher(teacherId);
  const { mutate: deleteTeacher, isPending: isDeleting } =
    TeacherService.useDeleteTeacher();
  if (isLoading) return <Loading />;
  if (isError || !teacher)
    return (
      <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
        No fue posible cargar este profesor.
      </p>
    );
  return (
    <div className="mx-auto mt-6 max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        Editar profesor
      </h1>
      <p className="mb-6 text-gray-500">
        Actualiza la información de contacto y acceso no sensible.
      </p>
      <TeacherForm teacher={teacher} />

      <div className="mt-6 rounded-lg border border-red-200 bg-white p-6 shadow-sm dark:border-red-900 dark:bg-gray-800 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Eliminar profesor
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Esta acción eliminará permanentemente el perfil del profesor.
            </p>
          </div>
          <Button
            type="button"
            color="red"
            disabled={isDeleting}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <HiTrash className="mr-2 h-5 w-5" />
            Eliminar
          </Button>
        </div>
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
              ¿Eliminar este profesor?
            </h2>
            <p className="mb-5 mt-2 text-gray-500 dark:text-gray-400">
              {teacher.firstName} {teacher.lastName}
            </p>
            <p className="mb-5 text-base italic text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Nota:</span> Esta acción no se podrá deshacer.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                color="red"
                disabled={isDeleting}
                onClick={() =>
                  deleteTeacher(teacherId, {
                    onSuccess: () => {
                      toast.success("Profesor eliminado correctamente");
                      router.push("/teacher");
                    },
                    onError: () => toast.error("No fue posible eliminar al profesor"),
                  })
                }
              >
                {isDeleting ? <Spinner size="sm" /> : "Sí, estoy seguro"}
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
