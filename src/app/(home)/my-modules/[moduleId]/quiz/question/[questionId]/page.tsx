"use client";

import { use } from "react";
import QuestionForm from "@/modules/quiz/view/components/question_form";
import Loading from "@/@core/view/components/Loading";
import { QuestionService } from "@/modules/quiz/data/services/question_service";
import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";

export default function EditQuestionPage({
  params,
}: {
  params: Promise<{ moduleId: string; questionId: string }>;
}) {
  const resolvedParams = use(params);
  const { moduleId, questionId } = resolvedParams;

  const { data: question, isLoading } = QuestionService.useQuestion(questionId);

  if (isLoading) {
    return <Loading />;
  }

  if (!question) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Pregunta no encontrada</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <RouteBreadCrumb />
      <QuestionForm
        quizId={question.quizId}
        moduleId={moduleId}
        question={question}
      />
    </div>
  );
}
