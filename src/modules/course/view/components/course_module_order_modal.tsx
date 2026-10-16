"use client";

import { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "flowbite-react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import toast from "react-hot-toast";
import { CourseModuleRelation } from "../../main/types/course.types";
import { CourseService } from "../../data/services/course_service";

interface CourseModuleOrderModalProps {
  courseId: string;
  modules: CourseModuleRelation[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseModuleOrderModal({
  courseId,
  modules,
  isOpen,
  onClose,
}: CourseModuleOrderModalProps) {
  const [orderedModules, setOrderedModules] = useState<CourseModuleRelation[]>([]);
  const { mutate: reorderModules, isPending } = CourseService.useReorderCourseModules();

  useEffect(() => {
    if (isOpen) {
      setOrderedModules([...modules].sort((first, second) => first.order - second.order));
    }
  }, [isOpen, modules]);

  const moveModule = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= orderedModules.length) return;

    setOrderedModules((current) => {
      const reordered = [...current];
      [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
      return reordered;
    });
  };

  const handleSave = () => {
    reorderModules(
      {
        courseId,
        modules: orderedModules.map((courseModule, index) => ({
          moduleId: courseModule.module.id,
          order: index + 1,
        })),
      },
      {
        onSuccess: () => {
          toast.success("Orden de módulos actualizado");
          onClose();
        },
        onError: () => toast.error("No fue posible actualizar el orden"),
      },
    );
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <ModalHeader>Ordenar módulos</ModalHeader>
      <ModalBody>
        <div className="space-y-3">
          {orderedModules.length > 0 ? orderedModules.map((courseModule, index) => (
            <div
              key={courseModule.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
            >
              <span className="w-6 font-bold text-blue-600">{index + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900 dark:text-white">
                  {courseModule.module.title}
                </p>
                <p className="truncate text-sm text-gray-500">{courseModule.module.description}</p>
              </div>
              <Button
                size="xs"
                color="light"
                aria-label={`Subir ${courseModule.module.title}`}
                disabled={index === 0 || isPending}
                onClick={() => moveModule(index, -1)}
              >
                <HiChevronUp />
              </Button>
              <Button
                size="xs"
                color="light"
                aria-label={`Bajar ${courseModule.module.title}`}
                disabled={index === orderedModules.length - 1 || isPending}
                onClick={() => moveModule(index, 1)}
              >
                <HiChevronDown />
              </Button>
            </div>
          )) : <p className="text-sm text-gray-500">Este curso no tiene módulos para ordenar.</p>}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button color="light" onClick={onClose} disabled={isPending}>Cancelar</Button>
          <Button onClick={handleSave} disabled={isPending || orderedModules.length === 0}>
            {isPending ? <Spinner size="sm" /> : "Guardar orden"}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}
