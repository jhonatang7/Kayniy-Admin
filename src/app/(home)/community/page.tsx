"use client";
import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import CardAddMember from "@/modules/community/view/components/card_add_member";
import CommunityList from "@/modules/community/view/components/community_list";
import SearchCommunity from "@/modules/community/view/components/search_community";
import { Button } from "flowbite-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Community } from "@/modules/community/main/types/community.types";

const MOCK_COMMUNITIES: Community[] = [
  {
    id: "com-001",
    name: "Programación Web",
    description:
      "Comunidad para compartir avances, recursos y dudas sobre desarrollo web.",
    createdAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "com-002",
    name: "Diseño UI",
    description:
      "Espacio para prototipos, referencias visuales y revisiones de interfaz.",
    createdAt: "2026-08-03T14:30:00.000Z",
  },
  {
    id: "com-003",
    name: "Base de Datos",
    description:
      "Grupo de estudio para modelado, consultas SQL y buenas prácticas.",
    createdAt: "2026-08-05T08:20:00.000Z",
  },
  {
    id: "com-004",
    name: "Matemáticas Aplicadas",
    description:
      "Comunidad orientada a ejercicios, talleres y resolución de problemas.",
    createdAt: "2026-08-07T16:45:00.000Z",
  },
];

export default function CommunityPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCommunities = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return MOCK_COMMUNITIES;
    }

    return MOCK_COMMUNITIES.filter((community) => {
      return (
        community.name.toLowerCase().includes(normalizedQuery) ||
        community.description.toLowerCase().includes(normalizedQuery) ||
        community.id.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [searchQuery]);

  return (
    <div className="h-full">
      <RouteBreadCrumb />
      <div className="flex flex-col p-8 space-y-4">
        <h2 className="text-3xl text-gray-900 dark:text-white font-semibold">
          Comunidades
        </h2>
        <div className="flex items-end space-x-6">
          <SearchCommunity onSearchChange={setSearchQuery} />
          <Button
            size="lg"
            className="max-w-xs"
            onClick={() => router.push("/my-modules/new")}
          >
            Crear nueva comunidad
          </Button>
        </div>
        <CardAddMember />
        <CommunityList communities={filteredCommunities} />
      </div>
    </div>
  );
}
