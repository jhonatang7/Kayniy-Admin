"use client";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Community } from "../../main/types/community.types";
import { FaArrowDown, FaArrowUp, FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface CommunityListProps {
  communities: Community[];
  sortDirection: "asc" | "desc";
  onSortChange: (direction: "asc" | "desc") => void;
}

export default function CommunityList({
  communities,
  sortDirection,
  onSortChange,
}: CommunityListProps) {
  const router = useRouter();
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Table hoverable>
        <TableHead>
          <TableRow>
            <TableHeadCell>
              <div className="flex items-center gap-2">
                <span>Nombre</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label="Ordenar nombre ascendente"
                    onClick={() => onSortChange("asc")}
                    className={`rounded p-0.5 transition ${
                      sortDirection === "asc"
                        ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
                        : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FaArrowUp size={10} />
                  </button>
                  <button
                    type="button"
                    aria-label="Ordenar nombre descendente"
                    onClick={() => onSortChange("desc")}
                    className={`rounded p-0.5 transition ${
                      sortDirection === "desc"
                        ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
                        : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FaArrowDown size={10} />
                  </button>
                </div>
              </div>
            </TableHeadCell>
            <TableHeadCell>Descripción</TableHeadCell>
            <TableHeadCell>Acciones</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {communities.length > 0 ? (
            communities.map((community) => (
              <TableRow
                key={community.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {community.name}
                </TableCell>
                <TableCell>{community.description}</TableCell>
                <TableCell>
                  <Button
                    size="xs"
                    color="dark"
                    className="flex items-center gap-2 "
                    onClick={() => router.push(`/community/${community.id}`)}
                  >
                    <FaEdit />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell
                colSpan={3}
                className="py-8 text-center text-gray-500 dark:text-gray-400"
              >
                No se encontraron comunidades
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
