'use client';
import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { LessonService } from "../../data/services/lesson_service";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DeleteLesson({
  lessonId,
  lessonTitle,
  moduleId,
}: {
  lessonId: string;
  lessonTitle: string;
  moduleId: string;
}) {
    const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const { mutate: deleteLesson, isPending } = LessonService.useDeleteLesson();
  const handleDelete = () => {;
    deleteLesson(lessonId, {
      onSuccess: () => {
        toast.success("Lección eliminada exitosamente");
        router.push(`/my-modules/${moduleId}`);
      },
      onError: (error: any) => {
        toast.error("Error al eliminar la lección");
        console.error(
          "Error al eliminar la lección:",
          error?.response?.data?.message || error.message
        );
      },
    });
  };
  return (
    <div className="flex-1 flex items-start justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center lg:text-left">
          Eliminar Lección
        </h1>
        <div className="flex space-x-2 p-6 md:p-8 rounded-lg shadow-lg items-center justify-end">
          <h4 className=" italic text-gray-700 dark:text-gray-300">
            Quiero eliminar esta lección
          </h4>
          <Button
            onClick={() => setOpenModal(true)}
            className="w-full max-w-3xs"
            color="red"
            size="sm"
          >
            Eliminar
          </Button>
          <Modal
            show={openModal}
            size="md"
            onClose={() => setOpenModal(false)}
            popup
          >
            <ModalHeader />
            <ModalBody>
              <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {lessonTitle}
                </h2>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  ¿Estas seguro que quieres eliminar esta lección?
                </h3>
                <h3 className="mb-5 text-base font-normal text-start italic text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Nota:</span> Esta acción no se
                  podrá deshacer.
                </h3>
                <div className="flex justify-center gap-4">
                  <Button
                    color="red"
                    onClick={() => {
                      handleDelete();
                      setOpenModal(false);
                    }}
                  >
                    Si, estoy seguro
                  </Button>
                  <Button
                    color="alternative"
                    onClick={() => setOpenModal(false)}
                  >
                    No, cancelar
                  </Button>
                </div>
              </div>
            </ModalBody>
          </Modal>
        </div>
      </div>
    </div>
  );
}
