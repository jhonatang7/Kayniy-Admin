"use client";

import { Button, Modal, ModalBody, ModalHeader, Spinner } from "flowbite-react";
import { AiService } from "../../data/services/ai_service";
import toast from "react-hot-toast";

interface IndexContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IndexContentModal({ isOpen, onClose }: IndexContentModalProps) {
  const ingest = AiService.useIngest();

  const handleIngest = () => {
    ingest.mutate(undefined, {
      onSuccess: () => {
        toast.success("Contenido indexado correctamente.");
        onClose();
      }
    });
  };

  return (
    <Modal show={isOpen} size="md" popup onClose={onClose} className="!text-white">
      <ModalHeader className="!border-gray-700 !bg-gray-900 !text-white" />
      <ModalBody className="!bg-gray-900 !text-white">
        <div className="space-y-5 text-center">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Indexar contenido
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              ¿Deseas confirmar la indexación del contenido para la inteligencia
              artificial?
            </p>
          </div>
          {ingest.isError && (
            <p className="rounded-lg border border-red-800 bg-red-950/60 px-3 py-2 text-sm text-red-200">
              No se pudo indexar el contenido. Intenta nuevamente.
            </p>
          )}
          <div className="flex justify-center gap-3">
            <Button
              color="light"
              onClick={onClose}
              disabled={ingest.isPending}
              className="!border-gray-600 !bg-gray-700 !text-gray-100 hover:!bg-gray-600"
            >
              Rechazar
            </Button>
            <Button
              onClick={handleIngest}
              disabled={ingest.isPending}
              className="!bg-blue-600 !text-white hover:!bg-blue-700"
            >
              {ingest.isPending && <Spinner size="sm" className="mr-2" />}
              Confirmar indexación
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
