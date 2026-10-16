"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Modal, ModalBody, ModalHeader, Spinner, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, TextInput } from "flowbite-react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import toast from "react-hot-toast";
import { LiveClassService } from "../../data/services/live_class_service";
import { LiveClass } from "../../main/types/live_class.types";
import LiveClassForm from "./live_class_form";

interface LiveClassListProps {
  communityId: string;
  professorId: string;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function LiveClassList({ communityId, professorId }: LiveClassListProps) {
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLiveClass, setEditingLiveClass] = useState<LiveClass | undefined>();
  const [deletingLiveClass, setDeletingLiveClass] = useState<LiveClass | null>(null);
  const { data: liveClasses = [], isLoading, isError } = LiveClassService.useLiveClassesByCommunity(communityId);
  const { mutate: deleteLiveClass, isPending: isDeleting } = LiveClassService.useDeleteLiveClass();

  const visibleLiveClasses = useMemo(() => {
    const query = search.trim().toLowerCase();
    return liveClasses
      .filter((liveClass) => !liveClass.isDeleted)
      .filter((liveClass) => `${liveClass.title} ${liveClass.description}`.toLowerCase().includes(query))
      .sort((first, second) => new Date(second.registeredDate).getTime() - new Date(first.registeredDate).getTime());
  }, [liveClasses, search]);

  const openCreate = () => {
    setEditingLiveClass(undefined);
    setIsFormOpen(true);
  };

  const openEdit = (liveClass: LiveClass) => {
    setEditingLiveClass(liveClass);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingLiveClass(undefined);
  };

  const handleDelete = () => {
    if (!deletingLiveClass) return;
    deleteLiveClass(deletingLiveClass.id, {
      onSuccess: () => {
        toast.success("Clase en vivo eliminada correctamente");
        setDeletingLiveClass(null);
      },
      onError: () => toast.error("No fue posible eliminar la clase en vivo"),
    });
  };

  return (
    <section className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">GESTIÓN ACADÉMICA</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clases en vivo</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Programa y administra las transmisiones de tu comunidad.</p>
        </div>
        <Button onClick={openCreate}><FaPlus className="mr-2" /> Nueva clase en vivo</Button>
      </div>

      <div className="max-w-xl">
        <TextInput id="live-class-search" type="search" icon={FaSearch} placeholder="Buscar por título o descripción" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      {isLoading ? <div className="flex justify-center p-12"><Spinner size="xl" /></div> : isError ? (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">No fue posible cargar las clases en vivo.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>Título</TableHeadCell>
                <TableHeadCell>Inicio</TableHeadCell>
                <TableHeadCell>Duración</TableHeadCell>
                <TableHeadCell>Finaliza</TableHeadCell>
                <TableHeadCell>Estado</TableHeadCell>
                <TableHeadCell>Acciones</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {visibleLiveClasses.length > 0 ? visibleLiveClasses.map((liveClass) => (
                <TableRow key={liveClass.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-semibold text-gray-900 dark:text-white">{liveClass.title}</p>
                      <p className="line-clamp-2 text-sm text-gray-500">{liveClass.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(liveClass.startedDate)}</TableCell>
                  <TableCell className="whitespace-nowrap">{liveClass.duration} min</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(liveClass.expiresAt)}</TableCell>
                  <TableCell><Badge color={new Date(liveClass.expiresAt) < new Date() ? "gray" : "success"}>{new Date(liveClass.expiresAt) < new Date() ? "Finalizada" : "Programada"}</Badge></TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button color="light" size="xs" onClick={() => openEdit(liveClass)}><FaEdit className="mr-2" /> Editar</Button>
                      <Button color="failure" size="xs" onClick={() => setDeletingLiveClass(liveClass)}><FaTrash className="mr-2" /> Eliminar</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell colSpan={6} className="py-10 text-center text-gray-500 dark:text-gray-400">
                    {search ? "No se encontraron clases con esa búsqueda." : "Aún no hay clases en vivo programadas."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Modal show={isFormOpen} size="lg" onClose={closeForm}>
        <ModalHeader>{editingLiveClass ? "Editar clase en vivo" : "Nueva clase en vivo"}</ModalHeader>
        <ModalBody>
          <LiveClassForm communityId={communityId} professorId={professorId} liveClass={editingLiveClass} onSuccess={closeForm} onCancel={closeForm} />
        </ModalBody>
      </Modal>

      <Modal show={Boolean(deletingLiveClass)} size="md" popup onClose={() => setDeletingLiveClass(null)}>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">¿Eliminar esta clase en vivo?</h2>
            <p className="mb-5 mt-2 text-gray-500 dark:text-gray-400">{deletingLiveClass?.title}</p>
            <p className="mb-5 text-base italic text-gray-500 dark:text-gray-400"><span className="font-semibold">Nota:</span> Esta acción no se podrá deshacer.</p>
            <div className="flex justify-center gap-4">
              <Button color="red" disabled={isDeleting} onClick={handleDelete}>{isDeleting ? <Spinner size="sm" /> : "Sí, estoy seguro"}</Button>
              <Button color="alternative" disabled={isDeleting} onClick={() => setDeletingLiveClass(null)}>No, cancelar</Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </section>
  );
}
