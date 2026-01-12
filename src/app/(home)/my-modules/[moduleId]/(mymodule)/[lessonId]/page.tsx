"use client";

import LessonForm from "@/modules/lesson/view/components/lesson_form";
import Loading from "@/@core/view/components/Loading";
import { LessonService } from "@/modules/lesson/data/services/lesson_service";
import { use } from "react";
import DeleteLesson from "@/modules/lesson/view/components/delete_lesson";

export default function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const resolvedParams = use(params);
  const { moduleId, lessonId } = resolvedParams;
  const { data: lesson, isLoading } = LessonService.useLesson(lessonId);

  if (isLoading) {
    return <Loading />;
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Lección no encontrada</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <LessonForm moduleId={moduleId} lesson={lesson} />
      <DeleteLesson lessonId={lesson.id} lessonTitle={lesson.title} moduleId={moduleId} />
    </div>
  );
}
