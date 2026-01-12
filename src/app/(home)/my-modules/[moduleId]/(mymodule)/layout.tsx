"use client";

import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import Loading from "@/@core/view/components/Loading";
import LessonList from "@/modules/lesson/view/components/lesson_list";
import { ModuleService } from "@/modules/module/data/services/module_service";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function ModuleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ moduleId: string }>;
}) {
  const resolvedParams = use(params);
  const moduleId = resolvedParams.moduleId;
  const { data: module, isLoading } = ModuleService.useModule(moduleId);
  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  if (!module) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Módulo no encontrado</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <RouteBreadCrumb />
      <div className="flex-1 flex flex-col lg:flex-row gap-0 lg:gap-8 p-4 md:p-8">
        {/* Lista de Lecciones - Lado Izquierdo (40%) */}
        <div className="w-full lg:w-2/5 flex flex-col mb-8 lg:mb-0 space-y-1 items-center">
          <div className="w-full p-6 md:p-8 rounded-lg shadow-lg">
            <LessonList moduleId={moduleId} />
          </div>
          <Button
            onClick={() => router.push(`/my-modules/${moduleId}/new-lesson`)}
            className="max-w-sm w-full"
          >
            Agregar una Lección
          </Button>
          <Button className="max-w-sm w-full">Cambiar orden</Button>
        </div>

        {/* Línea divisoria vertical - Solo visible en desktop */}
        <div className="hidden lg:block w-px bg-gray-300 dark:bg-gray-600 self-stretch"></div>

        {/* Contenido - Lado Derecho (60%) */}
        <div className="w-full lg:w-3/5 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
