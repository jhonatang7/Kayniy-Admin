"use client";

import Loading from "@/@core/view/components/Loading";
import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { useMemo, useState } from "react";
import { FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Admin } from "../../main/types/admin.types";
import { AdminService } from "../../data/services/admin_service";

export default function AdminList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const { data: admins, isLoading, isError } = AdminService.useAdmins();
  const { mutate: deleteAdmin, isPending: isDeleting } = AdminService.useDeleteAdmin();

  const filteredAdmins = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (admins ?? []).filter((admin) =>
      `${admin.firstName} ${admin.lastName} ${admin.email} ${admin.phoneNumber ?? ""}`
        .toLowerCase()
        .includes(query),
    );
  }, [admins, search]);

  const handleDelete = () => {
    if (!selectedAdmin) return;
    deleteAdmin(selectedAdmin.id, {
      onSuccess: () => {
        toast.success("Administrador eliminado correctamente");
        setSelectedAdmin(null);
      },
      onError: () => toast.error("No fue posible eliminar al administrador"),
    });
  };

  if (isLoading) return <Loading />;

  return (
    <section className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">GESTIÓN DEL SISTEMA</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Administradores</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Administra las cuentas con acceso administrativo.</p>
        </div>
        <Button onClick={() => router.push("/admin/new")}>
          <FaPlus className="mr-2" /> Nuevo administrador
        </Button>
      </div>

      <div className="max-w-xl">
        <TextInput
          id="admin-search"
          type="search"
          icon={FaSearch}
          placeholder="Buscar por nombre, correo o teléfono"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {isError ? (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">No fue posible cargar la lista de administradores.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>Administrador</TableHeadCell>
                <TableHeadCell>Correo</TableHeadCell>
                <TableHeadCell>Teléfono</TableHeadCell>
                <TableHeadCell>Rol</TableHeadCell>
                <TableHeadCell>Acciones</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {filteredAdmins.length > 0 ? filteredAdmins.map((admin) => (
                <TableRow key={admin.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{admin.firstName} {admin.lastName}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.phoneNumber || "Sin registrar"}</TableCell>
                  <TableCell><Badge color="info" className="w-fit">Administrador</Badge></TableCell>
                  <TableCell>
                    <Button color="failure" size="xs" onClick={() => setSelectedAdmin(admin)}>
                      <FaTrash className="mr-2" /> Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                    {search ? "No se encontraron administradores con esa búsqueda." : "Aún no hay administradores registrados."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Modal show={Boolean(selectedAdmin)} size="md" popup onClose={() => setSelectedAdmin(null)}>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">¿Eliminar este administrador?</h2>
            <p className="mb-5 mt-2 text-gray-500 dark:text-gray-400">
              {selectedAdmin?.firstName} {selectedAdmin?.lastName}
            </p>
            <p className="mb-5 text-base italic text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Nota:</span> Esta acción no se podrá deshacer.
            </p>
            <div className="flex justify-center gap-4">
              <Button color="red" disabled={isDeleting} onClick={handleDelete}>
                {isDeleting ? <Spinner size="sm" /> : "Sí, estoy seguro"}
              </Button>
              <Button color="alternative" disabled={isDeleting} onClick={() => setSelectedAdmin(null)}>
                No, cancelar
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </section>
  );
}