"use client";

import { use } from "react";
import QuestionForm from "@/modules/quiz/view/components/question_form";
import Loading from "@/@core/view/components/Loading";
import { QuestionService } from "@/modules/quiz/data/services/question_service";

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
    <QuestionForm
      quizId={question.quizId}
      moduleId={moduleId}
      question={question}
    />
  );
}