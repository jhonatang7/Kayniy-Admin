"use client";

import { Button, Card } from "flowbite-react";
import { HiPlus, HiClipboardList } from "react-icons/hi";
import { useRouter } from "next/navigation";

interface EmptyQuizStateProps {
  moduleId: string;
}

export default function EmptyQuizState({ moduleId }: EmptyQuizStateProps) {
  const router = useRouter();

  const handleCreateQuiz = () => {
    router.push(`/my-modules/${moduleId}/quiz/new-quiz`);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <div className="flex flex-col justify-center text-center space-y-6 p-8">
          <div className="flex justify-center">
            <HiClipboardList className="h-24 w-24 text-gray-400 dark:text-gray-600" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No hay cuestionario creado
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Este módulo aún no tiene un cuestionario. Crea uno para evaluar el conocimiento de los estudiantes.
            </p>
          </div>

          <Button color="blue" size="lg" onClick={handleCreateQuiz} className="max-w-sm self-center w-full">
            <HiPlus className="mr-2 h-5 w-5" />
            Crear Cuestionario
          </Button>
        </div>
      </Card>
    </div>
  );
}
