"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
import { useEffect } from "react";

interface QuestionFormProps {
  quizId: string;
  moduleId: string;
  question?: Question;
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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
    setValue,
    watch,
    trigger,
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      title: question?.title || "",
      description: question?.description || "",
      type: question?.type || QuestionType.UNIQUE_SELECTION,
      points: question?.points || 1,
      options: question?.options.map((opt) => ({
        id: opt.id,
        content: opt.content,
        isCorrect: opt.isCorrect,
      })) || [
        { id: crypto.randomUUID(), content: "", isCorrect: false },
        { id: crypto.randomUUID(), content: "", isCorrect: false },
      ],
    },
  });

  const { fields, append, replace } = useFieldArray({
    control,
    name: "options",
  });

  const selectedType = watch("type");
  const options = watch("options");

  // Actualizar valores cuando cambie la pregunta
  useEffect(() => {
    if (question) {
      setValue("title", question.title);
      setValue("description", question.description);
      setValue("type", question.type);
      setValue("points", question.points);
      setValue("options", question.options.map((opt) => ({
        id: opt.id,
        content: opt.content,
        isCorrect: opt.isCorrect,
      })));
    }
  }, [question, setValue]);

  const addOption = () => {
    append({ id: crypto.randomUUID(), content: "", isCorrect: false }, { 
      shouldFocus: true 
    });
  };

  const removeOption = (index: number) => {
    if (fields.length <= 2) {
      toast.error("Debe haber al menos 2 opciones");
      return;
    }
    // Usar replace para reemplazar todo el array y forzar detección de cambios
    const newOptions = options.filter((_, idx) => idx !== index);
    replace(newOptions);
    // Forzar revalidación después de eliminar
    //setTimeout(() => trigger(), 0);
  };

  const toggleOptionCorrect = (index: number) => {
    if (selectedType === QuestionType.UNIQUE_SELECTION) {
      // Solo una opción puede ser correcta
      fields.forEach((_, idx) => {
        setValue(`options.${idx}.isCorrect`, idx === index, { shouldValidate: true });
      });
    } else {
      // Múltiples opciones pueden ser correctas
      const currentValue = options[index].isCorrect;
      setValue(`options.${index}.isCorrect`, !currentValue, { shouldValidate: true });
    }
    // Forzar revalidación del formulario completo
    trigger();
  };

  const onSubmit = (data: QuestionFormValues) => {
    const questionData = {
      title: data.title,
      description: data.description,
      type: data.type,
      quizId,
      points: data.points,
      options: data.options.map((opt) => ({
        content: opt.content,
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
            points: data.points,
            options: data.options.map((opt) => {
              // Si el id empieza con un UUID generado por crypto.randomUUID(), es una opción nueva
              const isNewOption = question.options.every(existingOpt => existingOpt.id !== opt.id);
              return {
                ...(isNewOption ? {} : { id: opt.id }), // Solo incluir id si es una opción existente
                content: opt.content,
                isCorrect: opt.isCorrect,
              };
            }),
          },
        },
        {
          onSuccess: () => {
            toast.success("Pregunta actualizada exitosamente");
            router.push(`/my-modules/${moduleId}/quiz`);
          },
          onError: (error: any) => {
            if (error?.response?.status === 422) {
              toast.error(
                "El total de puntos excede el l\u00edmite de 100. Por favor, reorganiza los puntos de tus preguntas antes de a\u00f1adir m\u00e1s.",
                { duration: 5000 }
              );
            } else {
              toast.error("Error al actualizar la pregunta");
            }
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
          router.push(`/my-modules/${moduleId}/quiz`);
        },
        onError: (error: any) => {
          if (error?.response?.status === 422) {
            toast.error(
              "El total de puntos excede el l\u00edmite de 100. Por favor, reorganiza los puntos de tus preguntas antes de a\u00f1adir m\u00e1s.",
              { duration: 5000 }
            );
          } else {
            toast.error("Error al crear la pregunta");
          }
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
                    color={errors.type ? "failure" : "gray"}
                    disabled={isEditing}
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

                {/* Campo: Puntos */}
                <div>
                  <Label htmlFor="points" className="mb-2">
                    Puntos de la Pregunta
                  </Label>
                  <TextInput
                    id="points"
                    {...register("points", { valueAsNumber: true })}
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Ej: 10"
                    color={errors.points ? "failure" : "gray"}
                  />
                  {errors.points && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.points.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    El total de puntos de todas las preguntas no debe exceder 100
                  </p>
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
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-start gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      {/* Radio o Checkbox */}
                      <div className="flex items-center pt-2">
                        {selectedType === QuestionType.UNIQUE_SELECTION ? (
                          <Radio
                            checked={options[index]?.isCorrect || false}
                            onChange={() => toggleOptionCorrect(index)}
                            name="correctOption"
                          />
                        ) : (
                          <Checkbox
                            checked={options[index]?.isCorrect || false}
                            onChange={() => toggleOptionCorrect(index)}
                          />
                        )}
                      </div>

                      {/* Input de texto */}
                      <div className="flex-1">
                        <TextInput
                          {...register(`options.${index}.content`)}
                          placeholder={`Opción ${index + 1}`}
                          sizing="sm"
                          color={errors.options?.[index]?.content ? "failure" : "gray"}
                        />
                        {errors.options?.[index]?.content && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.options[index]?.content?.message}
                          </p>
                        )}
                      </div>

                      {/* Botón eliminar */}
                      {fields.length > 2 && (
                        <Button
                          type="button"
                          size="xs"
                          color="failure"
                          onClick={() => removeOption(index)}
                        >
                          <HiTrash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mostrar errores generales de opciones */}
                {errors.options && typeof errors.options.message === 'string' && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      ⚠️ {errors.options.message}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              disabled={isPending || !isValid}
              color={!isPending && isValid ? "blue" : "gray"}
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
