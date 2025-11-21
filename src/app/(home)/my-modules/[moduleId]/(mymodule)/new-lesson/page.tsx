"use client";

import LessonForm from "@/modules/lesson/view/components/lesson_form";
import { use } from "react";

export default function NewLessonPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const resolvedParams = use(params);
  const moduleId = resolvedParams.moduleId;

  return <LessonForm moduleId={moduleId} />;
}