"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionSchema, QuestionFormValues } from "../schemas/question_schema";
import {
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Card,
} from "flowbite-react";
import {
  HiPencilAlt,
  HiQuestionMarkCircle,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import { QuestionService } from "../../data/services/question_service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Question, QuestionType } from "../../main/types/question.types";
import { useEffect, useState } from "react";

interface QuestionFormProps {
  quizId: string;
  moduleId: string;
  question?: Question;
}

interface OptionInput {
  id: string;
  text: string;
  isCorrect: boolean;
}

export default function QuestionForm({
  quizId,
  moduleId,
  question,
}: QuestionFormProps) {
  const router = useRouter();
  const isEditing = !!question;

  const { mutate: createQuestion, isPending: isCreating } =
    QuestionService.useCreateQuestion();
  const { mutate: updateQuestion, isPending: isUpdating } =
    QuestionService.useUpdateQuestion();

  const isPending = isCreating || isUpdating;

  // Estado para el tipo de pregunta seleccionado
  const [selectedType, setSelectedType] = useState<QuestionType>(
    question?.type || QuestionType.UNIQUE_SELECTION
  );

  // Estado para las opciones
  const [options, setOptions] = useState<OptionInput[]>(
    question?.options.map((opt) => ({
      id: opt.id,
      text: opt.text,
      isCorrect: opt.isCorrect,
    })) || [
      { id: "1", text: "", isCorrect: false },
      { id: "2", text: "", isCorrect: false },
    ]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    mode: "onChange",
    defaultValues: {
      title: question?.title || "",
      description: question?.description || "",
      type: question?.type || QuestionType.UNIQUE_SELECTION,
    },
  });

  // Actualizar valores cuando cambie la pregunta
  useEffect(() => {
    if (question) {
      setValue("title", question.title);
      setValue("description", question.description);
      setValue("type", question.type);
      setSelectedType(question.type);
    }
  }, [question, setValue]);

  // Actualizar el tipo en el formulario cuando cambie
  useEffect(() => {
    setValue("type", selectedType);
  }, [selectedType, setValue]);

  const addOption = () => {
    setOptions([
      ...options,
      { id: Date.now().toString(), text: "", isCorrect: false },
    ]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) {
      toast.error("Debe haber al menos 2 opciones");
      return;
    }
    setOptions(options.filter((opt) => opt.id !== id));
  };

  const updateOptionText = (id: string, text: string) => {
    setOptions(
      options.map((opt) => (opt.id === id ? { ...opt, text } : opt))
    );
  };

  const toggleOptionCorrect = (id: string) => {
    if (selectedType === QuestionType.UNIQUE_SELECTION) {
      // Solo una opción puede ser correcta
      setOptions(
        options.map((opt) => ({
          ...opt,
          isCorrect: opt.id === id,
        }))
      );
    } else {
      // Múltiples opciones pueden ser correctas
      setOptions(
        options.map((opt) =>
          opt.id === id ? { ...opt, isCorrect: !opt.isCorrect } : opt
        )
      );
    }
  };

  const onSubmit = (data: QuestionFormValues) => {
    // Validar opciones
    const filledOptions = options.filter((opt) => opt.text.trim() !== "");
    if (filledOptions.length < 2) {
      toast.error("Debe haber al menos 2 opciones con texto");
      return;
    }

    const hasCorrectOption = filledOptions.some((opt) => opt.isCorrect);
    if (!hasCorrectOption) {
      toast.error("Debe seleccionar al menos una respuesta correcta");
      return;
    }

    const questionData = {
      title: data.title,
      description: data.description,
      type: data.type,
      quizId,
      options: filledOptions.map((opt) => ({
        text: opt.text,
        isCorrect: opt.isCorrect,
      })),
    };

    if (isEditing && question) {
      // Actualizar pregunta existente
      updateQuestion(
        {
          id: question.id,
          data: {
            title: data.title,
            description: data.description,
            type: data.type,
            options: filledOptions.map((opt) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          },
        },
        {
          onSuccess: () => {
            toast.success("Pregunta actualizada exitosamente");
            router.push(`/my-modules/${moduleId}/quiz`);
          },
          onError: (error: any) => {
            toast.error("Error al actualizar la pregunta");
            console.error(
              "Error al actualizar la pregunta:",
              error?.response?.data?.message || error.message
            );
          },
        }
      );
    } else {
      // Crear nueva pregunta
      createQuestion(questionData, {
        onSuccess: () => {
          toast.success("Pregunta creada exitosamente");
          reset();
          router.push(`/my-modules/${moduleId}/quiz`);
        },
        onError: (error: any) => {
          toast.error("Error al crear la pregunta");
          console.error(
            "Error al crear la pregunta:",
            error?.response?.data?.message || error.message
          );
        },
      });
    }
  };

  return (
    <div className="flex-1 p-4">
      <div className="w-full max-w-7xl mx-auto flex flex-col h-full justify-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center lg:text-left">
          {isEditing ? "Editar Pregunta" : "Crear Nueva Pregunta"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Columna Izquierda: Información de la pregunta */}
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <HiQuestionMarkCircle className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Información de la pregunta
                  </h2>
                </div>

                {/* Campo: Título */}
                <div>
                  <Label htmlFor="title" className="mb-2">
                    Título de la Pregunta
                  </Label>
                  <TextInput
                    id="title"
                    {...register("title")}
                    type="text"
                    placeholder="Ej: ¿Cuál es la capital de Francia?"
                    color={errors.title ? "failure" : "gray"}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.title.message}
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
                    placeholder="Proporciona contexto o instrucciones adicionales..."
                    rows={4}
                    color={errors.description ? "failure" : "gray"}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Campo: Tipo de pregunta */}
                <div>
                  <Label htmlFor="type" className="mb-2">
                    Tipo de Pregunta
                  </Label>
                  <Select
                    id="type"
                    {...register("type")}
                    value={selectedType}
                    onChange={(e) =>
                      setSelectedType(e.target.value as QuestionType)
                    }
                    color={errors.type ? "failure" : "gray"}
                  >
                    <option value={QuestionType.UNIQUE_SELECTION}>
                      Selección Única (una sola respuesta correcta)
                    </option>
                    <option value={QuestionType.MULTIPLE_SELECTION}>
                      Selección Múltiple (varias respuestas correctas)
                    </option>
                  </Select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.type.message}
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Columna Derecha: Opciones de respuesta */}
            <Card className="p-6">
              <div className="space-y-4 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Opciones de Respuesta
                  </h2>
                  <Button type="button" size="xs" color="blue" onClick={addOption}>
                    <HiPlus className="mr-1 h-4 w-4" />
                    Añadir
                  </Button>
                </div>

                {/* Nota informativa */}
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    {selectedType === QuestionType.UNIQUE_SELECTION ? (
                      <>
                        <strong>Selección Única:</strong> Solo se puede
                        seleccionar una opción como correcta.
                      </>
                    ) : (
                      <>
                        <strong>Selección Múltiple:</strong> Se pueden
                        seleccionar múltiples opciones como correctas.
                      </>
                    )}
                  </p>
                </div>

                {/* Lista de opciones */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {options.map((option, index) => (
                    <div
                      key={option.id}
                      className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      {/* Radio o Checkbox */}
                      <div className="flex items-center pt-2">
                        {selectedType === QuestionType.UNIQUE_SELECTION ? (
                          <Radio
                            checked={option.isCorrect}
                            onChange={() => toggleOptionCorrect(option.id)}
                            name="correctOption"
                          />
                        ) : (
                          <Checkbox
                            checked={option.isCorrect}
                            onChange={() => toggleOptionCorrect(option.id)}
                          />
                        )}
                      </div>

                      {/* Input de texto */}
                      <div className="flex-1">
                        <TextInput
                          value={option.text}
                          onChange={(e) =>
                            updateOptionText(option.id, e.target.value)
                          }
                          placeholder={`Opción ${index + 1}`}
                          sizing="sm"
                        />
                      </div>

                      {/* Botón eliminar */}
                      {options.length > 2 && (
                        <Button
                          type="button"
                          size="xs"
                          color="failure"
                          onClick={() => removeOption(option.id)}
                        >
                          <HiTrash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              disabled={isPending}
              color={!isPending ? "blue" : "gray"}
              className="sm:flex-1"
            >
              <HiPencilAlt className="mr-2 h-5 w-5" />
              {isPending
                ? isEditing
                  ? "Actualizando..."
                  : "Creando..."
                : isEditing
                ? "Actualizar Pregunta"
                : "Crear Pregunta"}
            </Button>

            <Button
              type="button"
              color="gray"
              onClick={() => router.push(`/my-modules/${moduleId}/quiz`)}
              className="sm:flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
