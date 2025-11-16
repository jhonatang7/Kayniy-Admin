import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { ModuleService } from "../../data/services/module_service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import { useState } from "react";

export default function DeleteModule({
  moduleId,
  moduleTitle,
}: {
  moduleId: string;
  moduleTitle: string;
}) {
  const [openModal, setOpenModal] = useState(false);
  const { mutate: deleteModule, isPending: isDeleting } =
    ModuleService.useDeleteModule();
  const router = useRouter();

  const handleDelete = () => {
    deleteModule(moduleId, {
      onSuccess: () => {
        toast.success("Módulo eliminado exitosamente");
        router.push("/my-modules");
      },
      onError: (error: any) => {
        toast.error("Error al eliminar el módulo");
        console.error(
          "Error al eliminar el módulo:",
          error?.response?.data?.message || error.message
        );
      },
    });
  };

  return (
    <>
      <Button
        type="button"
        disabled={isDeleting}
        color="red"
        onClick={() => setOpenModal(true)}
        className="max-w-xs self-center w-full lg:self-end"
      >
        <HiTrash className="mr-2 h-5 w-5" />
        {isDeleting ? "Eliminando..." : "Eliminar Módulo"}
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
              {moduleTitle}
            </h2>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Estas seguro que quieres eliminar este módulo?
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
              <Button color="alternative" onClick={() => setOpenModal(false)}>
                No, cancelar
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
