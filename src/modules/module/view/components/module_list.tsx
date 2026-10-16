'use client';
import { Button } from "flowbite-react";
import { CardModule } from "./card_module";
import SearchModules from "./search_modules";
import { useRouter } from "next/navigation";
import { ModuleService } from "../../data/services/module_service";
import { ModuleState } from "../../main/types/module.types";
import Loading from "@/@core/view/components/Loading";
import { useState } from "react";
import { AuthService } from "@/modules/auth/data/services/auth_service";

export default function ModuleList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: user, isLoading: isLoadingUser } = AuthService.useMe();
  const communityId = user?.community?.id ?? null;
  const {
    data: listModules = [],
    isLoading: isLoadingModules,
    isError,
  } = ModuleService.useAllModulesByCommunityId(communityId);

  if (isLoadingUser || isLoadingModules) {
    return <Loading/>;
  }

  if (!communityId) {
    return <p className="p-8 text-red-600">No perteneces a ninguna comunidad.</p>;
  }

  if (isError) {
    return <p className="p-8 text-red-600">No fue posible cargar los módulos.</p>;
  }

  // Filtrar módulos por búsqueda (case-insensitive)
  const filteredModules = listModules.filter(module =>
    searchQuery === "" || 
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Filtrar módulos según su estado
  const verifiedModules = filteredModules.filter(module => module.state === ModuleState.VERIFIED);
  const notVerifiedModules = filteredModules.filter(module => module.state === ModuleState.NOT_VERIFIED);

  return (
    <div className="flex flex-col p-8 space-y-4">
      <div className="flex items-end space-x-6">
        <SearchModules onSearchChange={setSearchQuery} />
        <Button size="lg" className="max-w-xs" onClick={() => router.push('/my-modules/new')}> Crear nuevo módulo</Button>
      </div>

      {/* Módulos Aprobados */}
      <h2 className="text-3xl text-gray-900 dark:text-white font-semibold">
        Aprobados
      </h2>
      <section className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {verifiedModules.length > 0 ? (
          verifiedModules.map((module) => (
            <CardModule 
              key={module.id} 
              moduleId={module.id} 
              name={module.title} 
              countLessons={module.lessons.length} 
            />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? "No se encontraron módulos aprobados" : "No hay módulos aprobados"}
          </p>
        )}
      </section>

      {/* Módulos No Aprobados */}
      <h2 className="text-3xl text-gray-900 dark:text-white font-semibold">
        No aprobados
      </h2>
      <section className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {notVerifiedModules.length > 0 ? (
          notVerifiedModules.map((module) => (
            <CardModule 
              key={module.id} 
              moduleId={module.id} 
              name={module.title} 
              countLessons={module.lessons.length} 
            />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? "No se encontraron módulos sin aprobar" : "No hay módulos sin aprobar"}
          </p>
        )}
      </section>
    </div>
  );
}
