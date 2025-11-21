"use client";

import QuizForm from "@/modules/quiz/view/components/quiz_form";
import Loading from "@/@core/view/components/Loading";
import { QuizService } from "@/modules/quiz/data/services/quiz_service";
import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import { useParams } from "next/navigation";

export default function EditQuizPage() {
  const { moduleId, quizId } = useParams<{
    moduleId: string;
    quizId: string;
  }>();

  const { data: quiz, isLoading } = QuizService.useQuiz(quizId);

  if (isLoading) {
    return <Loading />;
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Cuestionario no encontrado</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <RouteBreadCrumb />
      <QuizForm moduleId={moduleId} quiz={quiz} />
    </div>
  );
}
