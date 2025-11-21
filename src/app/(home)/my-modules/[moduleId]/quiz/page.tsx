"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuizService } from "@/modules/quiz/data/services/quiz_service";
import Loading from "@/@core/view/components/Loading";
import QuizDetails from "@/modules/quiz/view/components/quiz_details";
import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";

export default function QuizPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const resolvedParams = use(params);
  const { moduleId } = resolvedParams;
  const router = useRouter();

  const {
    data: quiz,
    isLoading,
    isError,
  } = QuizService.useQuizByModule(moduleId);

  console.log(quiz)
  useEffect(() => {
    // Si no hay quiz y ya terminó de cargar, redirigir a crear nuevo quiz
    if (!isLoading && !quiz && !isError) {
      console.log("Redirigiendo a crear nuevo quiz");
      router.push(`/my-modules/${moduleId}/quiz/new-quiz`);
    }
  }, [quiz, isLoading, moduleId]);

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

  // Si no hay quiz, mostrar loading mientras redirige
  if (!quiz) {
    return <Loading />;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <RouteBreadCrumb />
      <QuizDetails quiz={quiz} moduleId={moduleId} />
    </div>
  );
}
