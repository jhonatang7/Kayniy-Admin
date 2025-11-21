"use client";

import { use } from "react";
import QuizForm from "@/modules/quiz/view/components/quiz_form";
import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";

export default function NewQuizPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const resolvedParams = use(params);
  const { moduleId } = resolvedParams;

  return (
    <div className="w-full h-full flex flex-col">
      <RouteBreadCrumb />
      <QuizForm moduleId={moduleId} />
    </div>
  );
}
