"use client";

import { ModuleService } from "@/modules/module/data/services/module_service";
import UpdateModuleForm from "@/modules/module/view/components/update_module_form";
import Loading from "@/@core/view/components/Loading";
import React, { use } from "react";
import DeleteModule from "@/modules/module/view/components/delete_module";
import { Breadcrumb, Button } from "flowbite-react";
import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";

export default function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const resolvedParams = use(params);
  const moduleId = resolvedParams.moduleId;
  const { data: module, isLoading } = ModuleService.useModule(moduleId);

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
        <UpdateModuleForm module={module} />

        {/* Línea divisoria vertical - Solo visible en desktop */}
        <div className="hidden lg:block w-px bg-gray-300 dark:bg-gray-600 self-stretch"></div>

        {/* Lista de Lecciones - Lado Derecho */}
        <div className="w-full lg:w-2/5 flex flex-col mt-8 lg:mt-0">
          <div className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center lg:text-left">
              Lecciones
            </h2>

            {module.lessons && module.lessons.length > 0 && (
              <div className="mt-6 mb-2 flex flex-col space-y-4">
                <Button className="w-full">Prueba de módulo</Button>
                <div className="flex">
                  <Button color="blue" className="w-full max-w-xs">
                    Agregar Nueva Lección
                  </Button>

                  <Button color="gray" className="ml-4 w-full max-w-xs">
                    Administrar
                  </Button>
                </div>
              </div>
            )}

            <div className="p-6 md:p-8 rounded-lg shadow-lg">
              {/* Aquí irá la lista de lecciones */}
              {module.lessons && module.lessons.length > 0 ? (
                <div className="space-y-4">
                  {module.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <h3 className="font-semibold text-lg">
                        Lección {index + 1}: {lesson.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {lesson.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 flex flex-col items-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Este módulo aún no tiene lecciones
                  </p>
                  <Button color="blue">Crear Primera Lección</Button>
                </div>
              )}
            </div>
          </div>
          <DeleteModule moduleId={module.id} moduleTitle={module.title} />
        </div>
      </div>
    </div>
  );
}
