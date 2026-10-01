"use client";

import Loading from "@/@core/view/components/Loading";
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { useMemo, useState } from "react";
import { FaEdit, FaPlus, FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { TeacherService } from "../../data/services/teacher_service";

export default function TeacherList() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data: teachers, isLoading, isError } = TeacherService.useTeachers();

  const filteredTeachers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (teachers ?? []).filter((teacher) =>
      `${teacher.firstName} ${teacher.lastName} ${teacher.email} ${teacher.phoneNumber ?? ""}`
        .toLowerCase()
        .includes(query),
    );
  }, [search, teachers]);

  if (isLoading) return <Loading />;

  return (
    <section className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">GESTIÓN ACADÉMICA</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profesores
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Administra los perfiles y accesos de los profesores.
          </p>
        </div>
        <Button onClick={() => router.push("/teacher/new")}>
          <FaPlus className="mr-2" /> Nuevo profesor
        </Button>
      </div>
      <div className="max-w-xl">
        <TextInput
          id="teacher-search"
          type="search"
          icon={FaSearch}
          placeholder="Buscar por nombre, correo o teléfono"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      {isError ? (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          No fue posible cargar la lista de profesores.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>Profesor</TableHeadCell>
                <TableHeadCell>Correo</TableHeadCell>
                <TableHeadCell>Teléfono</TableHeadCell>
                <TableHeadCell>Rol</TableHeadCell>
                <TableHeadCell>Acciones</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <TableRow
                    key={teacher.id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {teacher.firstName} {teacher.lastName}
                    </TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.phoneNumber || "Sin registrar"}</TableCell>
                    <TableCell>
                      <Badge color="info" className="w-fit">
                        Profesor
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          color="light"
                          size="xs"
                          onClick={() => router.push(`/teacher/${teacher.id}`)}
                        >
                          <FaEdit className="mr-2" /> Editar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    {search
                      ? "No se encontraron profesores con esa búsqueda."
                      : "Aún no hay profesores registrados."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
