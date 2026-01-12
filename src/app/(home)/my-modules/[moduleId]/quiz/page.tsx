"use client";

import { use } from "react";
import { QuizService } from "@/modules/quiz/data/services/quiz_service";
import Loading from "@/@core/view/components/Loading";
import QuizDetails from "@/modules/quiz/view/components/quiz_details";
import EmptyQuizState from "@/modules/quiz/view/components/empty_quiz_state";
import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";

export default function QuizPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const resolvedParams = use(params);
  const { moduleId } = resolvedParams;

  const {
    data: quiz,
    isLoading,
    isError,
  } = QuizService.useQuizByModule(moduleId);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">Error al cargar el cuestionario</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <RouteBreadCrumb />
      {quiz ? (
        <QuizDetails quiz={quiz} moduleId={moduleId} />
      ) : (
        <EmptyQuizState moduleId={moduleId} />
      )}
    </div>
  );
}
