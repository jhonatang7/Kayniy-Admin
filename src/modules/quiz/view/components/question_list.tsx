"use client";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Badge,
} from "flowbite-react";
import { HiPlus, HiPencilAlt, HiTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { QuestionService } from "../../data/services/question_service";
import { QuestionType } from "../../main/types/question.types";

interface QuestionListProps {
  quizId: string;
  moduleId: string;
}

export default function QuestionList({ quizId, moduleId }: QuestionListProps) {
  const router = useRouter();
  const { data: questions = [], isLoading } =
    QuestionService.useQuestionsByQuiz(quizId);
  const { mutate: deleteQuestion } = QuestionService.useDeleteQuestion();

  // Calcular el total de puntos
  const totalPoints = questions.reduce((sum, question) => sum + (question.points || 0), 0);

  const handleAddQuestion = () => {
    router.push(
      `/my-modules/${moduleId}/quiz/question/new-question?quizId=${quizId}`
    );
  };

  const handleEditQuestion = (questionId: string) => {
    router.push(`/my-modules/${moduleId}/quiz/question/${questionId}`);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta pregunta?")) {
      deleteQuestion(questionId);
    }
  };

  return (
    <div className="relative overflow-x-auto">
      <div className="p-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Preguntas del Cuestionario
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Total de puntos: <span className={`font-semibold ${totalPoints > 100 ? 'text-red-600' : totalPoints === 100 ? 'text-green-600' : 'text-blue-600'}`}>
              {totalPoints}/100
            </span>
          </p>
        </div>
        <Button color="blue" onClick={handleAddQuestion}>
          <HiPlus className="mr-2 h-5 w-5" />
          Añadir Pregunta
        </Button>
      </div>

      {isLoading ? (
        <div className="p-4 text-center text-gray-500">
          Cargando preguntas...
        </div>
      ) : questions.length === 0 ? (
        <div className="p-8 text-center justify-center items-center flex flex-col">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No hay preguntas en este cuestionario
          </p>
          <Button
            color="blue"
            className="max-w-sm w-full"
            onClick={handleAddQuestion}
          >
            <HiPlus className="mr-2 h-5 w-5" />
            Crear Primera Pregunta
          </Button>
        </div>
      ) : (
        <Table hoverable>
          <TableHead>
            <tr>
              <TableHeadCell className="w-16"></TableHeadCell>
              <TableHeadCell>Título</TableHeadCell>
              <TableHeadCell>Tipo</TableHeadCell>
              <TableHeadCell>Opciones</TableHeadCell>
              <TableHeadCell>Puntos</TableHeadCell>
              <TableHeadCell>Acciones</TableHeadCell>
            </tr>
          </TableHead>
          <TableBody className="divide-y">
            {questions.map((question) => (
              <TableRow
                key={question.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell className="text-center font-semibold text-gray-700 dark:text-gray-300">
                  {question.order}
                </TableCell>
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {question.title}
                </TableCell>
                <TableCell>
                  <Badge
                    color={
                      question.type === QuestionType.UNIQUE_SELECTION
                        ? "success"
                        : "failure"
                    }
                    className="rounded-full"
                  >
                    {question.type === QuestionType.UNIQUE_SELECTION
                      ? "Única"
                      : "Múltiple"}
                  </Badge>
                </TableCell>
                <TableCell>{question.options?.length || 0} opciones</TableCell>
                <TableCell>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {question.points || 0} pts
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="xs"
                      color="blue"
                      onClick={() => handleEditQuestion(question.id)}
                    >
                      <HiPencilAlt className="h-4 w-4" />
                    </Button>
                    <Button
                      size="xs"
                      color="red"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      <HiTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
