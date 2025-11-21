"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import QuestionForm from "@/modules/quiz/view/components/question_form";
import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";

export default function NewQuestionPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const resolvedParams = use(params);
  const { moduleId } = resolvedParams;
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");

  if (!quizId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">
          Error: ID de cuestionario no proporcionado
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <RouteBreadCrumb />
      <QuestionForm quizId={quizId} moduleId={moduleId} />
    </div>
  );
}
