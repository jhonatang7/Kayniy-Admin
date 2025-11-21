"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quizSchema, QuizFormValues } from "../schemas/quiz_schema";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { HiPencilAlt, HiClipboardList } from "react-icons/hi";
import { QuizService } from "../../data/services/quiz_service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Quiz } from "../../main/types/quiz.types";
import { useEffect } from "react";
import { PiStudentFill } from "react-icons/pi";

interface QuizFormProps {
  moduleId: string;
  quiz?: Quiz;
}

export default function QuizForm({ moduleId, quiz }: QuizFormProps) {
  const router = useRouter();
  const isEditing = !!quiz;
  
  const { mutate: createQuiz, isPending: isCreating } = QuizService.useCreateQuiz();
  const { mutate: updateQuiz, isPending: isUpdating } = QuizService.useUpdateQuiz();
  
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    mode: "onChange",
    defaultValues: {
      name: quiz?.name || "",
      description: quiz?.description || "",
      passingScore: quiz?.passingScore || 70,
    },
  });

  // Actualizar valores cuando cambie el quiz
  useEffect(() => {
    if (quiz) {
      setValue("name", quiz.name);
      setValue("description", quiz.description);
      setValue("passingScore", quiz.passingScore);
    }
  }, [quiz, setValue]);

  const onSubmit = (data: QuizFormValues) => {
    if (isEditing && quiz) {
      // Actualizar quiz existente
      updateQuiz(
        {
          id: quiz.id,
          data: {
            name: data.name,
            description: data.description,
            passingScore: data.passingScore,
          },
        },
        {
          onSuccess: () => {
            toast.success("Cuestionario actualizado exitosamente");
            router.push(`/my-modules/${moduleId}/quiz`);
          },
          onError: (error: any) => {
            toast.error("Error al actualizar el cuestionario");
            console.error(
              "Error al actualizar el cuestionario:",
              error?.response?.data?.message || error.message
            );
          },
        }
      );
    } else {
      // Crear nuevo quiz
      createQuiz(
        { 
          name: data.name,
          description: data.description,
          passingScore: data.passingScore,
          moduleId 
        },
        {
          onSuccess: () => {
            toast.success("Cuestionario creado exitosamente");
            reset();
            router.push(`/my-modules/${moduleId}/quiz`);
          },
          onError: (error: any) => {
            toast.error("Error al crear el cuestionario");
            console.error(
              "Error al crear el cuestionario:",
              error?.response?.data?.message || error.message
            );
          },
        }
      );
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center lg:text-left">
          {isEditing ? "Editar Cuestionario" : "Crear Nuevo Cuestionario"}
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-6 p-6 md:p-8 rounded-lg shadow-lg"
        >
          {/* Campo: Nombre del cuestionario */}
          <div>
            <Label htmlFor="name" className="mb-2">
              Nombre del Cuestionario
            </Label>
            <TextInput
              id="name"
              {...register("name")}
              type="text"
              placeholder="Ejemplo: Evaluación Final - Saludos"
              color={errors.name ? "failure" : "gray"}
              icon={HiClipboardList}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Campo: Descripción */}
          <div>
            <Label htmlFor="description" className="mb-2">
              Descripción
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe el propósito y contenido del cuestionario..."
              rows={4}
              color={errors.description ? "failure" : "gray"}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Campo: Puntuación mínima para aprobar */}
          <div>
            <Label htmlFor="passingScore" className="mb-2">
              Puntuación Mínima para Aprobar (%)
            </Label>
            <TextInput
              id="passingScore"
              {...register("passingScore", { valueAsNumber: true })}
              type="number"
              min="0"
              max="100"
              placeholder="70"
              color={errors.passingScore ? "failure" : "gray"}
              icon={PiStudentFill}
            />
            {errors.passingScore && (
              <p className="mt-1 text-sm text-red-600">
                {errors.passingScore.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Los estudiantes deben alcanzar este porcentaje para aprobar el cuestionario.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              disabled={!isValid || isPending}
              color={isValid && !isPending ? "blue" : "gray"}
              className="flex-1"
            >
              <HiPencilAlt className="mr-2 h-5 w-5" />
              {isPending
                ? isEditing
                  ? "Actualizando..."
                  : "Creando..."
                : isEditing
                ? "Actualizar Cuestionario"
                : "Crear Cuestionario"}
            </Button>

            <Button
              type="button"
              color="gray"
              onClick={() => router.push(`/my-modules/${moduleId}/quiz`)}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
