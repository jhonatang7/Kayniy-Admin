"use client";

import { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, Spinner } from "flowbite-react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import toast from "react-hot-toast";
import { Lesson, LessonOrderItem } from "../../main/lesson.types";
import { LessonService } from "../../data/services/lesson_service";

interface LessonOrderModalProps {
  moduleId: string;
  lessons: Lesson[];
  isOpen: boolean;
  onClose: () => void;
}

export default function LessonOrderModal({
  moduleId,
  lessons,
  isOpen,
  onClose,
}: LessonOrderModalProps) {
  const [orderedLessons, setOrderedLessons] = useState<Lesson[]>([]);
  const { mutate: reorderLessons, isPending } = LessonService.useReorderLessons();

  useEffect(() => {
    if (isOpen) {
      setOrderedLessons([...lessons].sort((first, second) => first.order - second.order));
    }
  }, [isOpen, lessons]);

  const moveLesson = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= orderedLessons.length) return;

    setOrderedLessons((current) => {
      const reordered = [...current];
      [reordered[index], reordered[nextIndex]] = [reordered[nextIndex], reordered[index]];
      return reordered;
    });
  };

  const handleSave = () => {
    const lessonOrder: LessonOrderItem[] = orderedLessons.map((lesson, index) => ({
      lessonId: lesson.id,
      order: index + 1,
    }));

    reorderLessons(
      { moduleId, lessons: lessonOrder },
      {
        onSuccess: () => {
          toast.success("Orden de lecciones actualizado");
          onClose();
        },
        onError: () => toast.error("No fue posible actualizar el orden"),
      },
    );
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="lg">
      <ModalHeader>Ordenar lecciones</ModalHeader>
      <ModalBody>
        <div className="space-y-3">
          {orderedLessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
            >
              <span className="w-6 font-bold text-blue-600">{index + 1}</span>
              <span className="min-w-0 flex-1 truncate font-medium">{lesson.title}</span>
              <Button
                size="xs"
                color="light"
                aria-label={`Subir ${lesson.title}`}
                disabled={index === 0}
                onClick={() => moveLesson(index, -1)}
              >
                <HiChevronUp />
              </Button>
              <Button
                size="xs"
                color="light"
                aria-label={`Bajar ${lesson.title}`}
                disabled={index === orderedLessons.length - 1}
                onClick={() => moveLesson(index, 1)}
              >
                <HiChevronDown />
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button color="light" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={isPending || orderedLessons.length === 0}>
            {isPending ? <Spinner size="sm" /> : "Guardar orden"}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}
