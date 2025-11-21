"use client";

import {
  Button,
  Card,
} from "flowbite-react";
import { HiPencilAlt, HiClipboardList } from "react-icons/hi";
import { Quiz } from "../../main/types/quiz.types";
import { useRouter } from "next/navigation";
import QuestionList from "./question_list";

interface QuizDetailsProps {
  quiz: Quiz;
  moduleId: string;
}

export default function QuizDetails({ quiz, moduleId }: QuizDetailsProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/my-modules/${moduleId}/quiz/${quiz.id}`);
  };

  return (
    <div className="flex-1 flex items-start justify-center">
      <div className="w-full max-w-3xl mt-5 space-y-3">
        <div className="flex items-center justify-end mb-4">
          <Button color="blue" onClick={handleEdit}>
            <HiPencilAlt className="mr-2 h-5 w-5" />
            Editar Cuestionario
          </Button>
        </div>

        <Card className="p-6 md:p-8">
          <div className="space-y-6">
            {/* Nombre del cuestionario */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HiClipboardList className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {quiz.name}
                </h2>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {quiz.description}
              </p>
            </div>

            {/* Puntuación mínima */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Puntuación Mínima para Aprobar
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Los estudiantes deben alcanzar este porcentaje
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {quiz.passingScore}
                  </span>
                  <span className="text-xl text-gray-600 dark:text-gray-400">
                    /100
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <QuestionList quizId={quiz.id} moduleId={moduleId} />
      </div>
    </div>
  );
}
