import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Community } from "../../main/types/community.types";

interface CommunityListProps {
  communities: Community[];
}

export default function CommunityList({ communities }: CommunityListProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <Table hoverable>
        <TableHead>
          <TableHeadCell>Nombre</TableHeadCell>
          <TableHeadCell>Descripción</TableHeadCell>
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
              </TableRow>
            ))
          ) : (
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell
                colSpan={2}
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
