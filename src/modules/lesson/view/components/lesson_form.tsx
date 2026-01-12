"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonSchema, LessonFormValues } from "../schemas/lesson_schema";
import { Button, Label, TextInput, Textarea, ButtonGroup } from "flowbite-react";
import { HiPencilAlt, HiVideoCamera, HiDocumentText, HiExternalLink } from "react-icons/hi";
import { LessonService } from "../../data/services/lesson_service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Lesson, LessonType } from "../../main/lesson.types";
import { useState, useEffect } from "react";
import FileUpload from "./file_upload";

interface LessonFormProps {
  moduleId: string;
  lesson?: Lesson;
}

export default function LessonForm({ moduleId, lesson }: LessonFormProps) {
  const router = useRouter();
  const isEditing = !!lesson;
  
  const { mutate: createLesson, isPending: isCreating } = LessonService.useCreateLesson();
  const { mutate: updateLesson, isPending: isUpdating } = LessonService.useUpdateLesson();
  
  const isPending = isCreating || isUpdating;

  // Estado para el tipo de lección seleccionado
  const [selectedType, setSelectedType] = useState<LessonType>(
    lesson?.type || LessonType.VIDEO
  );

  // Estado para el archivo PDF seleccionado
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
    clearErrors,
    setError,
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    mode: "onChange",
    defaultValues: {
      title: lesson?.title || "",
      description: lesson?.description || "",
      type: lesson?.type || LessonType.VIDEO,
      urlContent: lesson?.urlContent || "",
      duration: lesson?.duration || 0,
    },
  });

  // Actualizar valores cuando cambie la lección
  useEffect(() => {
    if (lesson) {
      setValue("title", lesson.title);
      setValue("description", lesson.description);
      setValue("type", lesson.type);
      setValue("urlContent", lesson.urlContent);
      setValue("duration", lesson.duration);
      setSelectedType(lesson.type);
    }
  }, [lesson, setValue]);

  // Actualizar el tipo en el formulario cuando cambie
  useEffect(() => {
    setValue("type", selectedType);
    // Limpiar errores y archivos cuando cambia el tipo
    if (selectedType === LessonType.VIDEO) {
      setPdfFile(null);
      setFileError("");
    } else if (selectedType === LessonType.DOCUMENT && !isEditing) {
      setValue("urlContent", "");
      clearErrors("urlContent");
    }
  }, [selectedType, setValue, clearErrors, isEditing]);

  const handleFileSelect = (file: File | null, url: string) => {
    setPdfFile(file);
    if (file) {
      //setValue("urlContent", url);
      setFileError("");
    } else {
      setValue("urlContent", "");
    }
  };

  const onSubmit = (data: LessonFormValues) => {
    // Validación adicional para documentos
    if (data.type === LessonType.DOCUMENT && !pdfFile) {
      setFileError("Debes seleccionar un archivo PDF");
      toast.error("Debes seleccionar un archivo PDF");
      return;
    }

    // Asegurar que urlContent tenga un valor
    const urlContent = data.urlContent || "";

    if (isEditing && lesson) {
      // Actualizar lección existente
      updateLesson(
        {
          id: lesson.id,
          data: {
            title: data.title,
            description: data.description,
            type: data.type,
            urlContent: urlContent,
            duration: data.duration,
            file: pdfFile || undefined, // Incluir archivo si existe
          },
        },
        {
          onSuccess: () => {
            toast.success("Lección actualizada exitosamente");
            router.push(`/my-modules/${moduleId}`);
          },
          onError: (error: any) => {
            toast.error("Error al actualizar la lección");
            console.error(
              "Error al actualizar la lección:",
              error?.response?.data?.message || error.message
            );
          },
        }
      );
    } else {
      // Crear nueva lección
      createLesson(
        { 
          title: data.title,
          description: data.description,
          type: data.type,
          urlContent: urlContent,
          duration: data.duration,
          moduleId,
          file: pdfFile || undefined, // Incluir archivo si existe
        },
        {
          onSuccess: () => {
            toast.success("Lección creada exitosamente");
            reset();
            setPdfFile(null);
            setFileError("");
            router.push(`/my-modules/${moduleId}`);
          },
          onError: (error: any) => {
            toast.error("Error al crear la lección");
            console.error(
              "Error al crear la lección:",
              error?.response?.data?.message || error.message
            );
          },
        }
      );
    }
  };

  return (
    <div className="flex-1 flex items-start justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center lg:text-left">
          {isEditing ? "Editar Lección" : "Crear Nueva Lección"}
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-8 p-6 md:p-8 rounded-lg shadow-lg"
        >
          {/* Paso 1: Selección de tipo de lección */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Paso 1: Tipo de Lección
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Selecciona el tipo de contenido que deseas crear.
              </p>
            </div>

            <ButtonGroup className="w-full max-w-sm" outline>
              <Button
                color={selectedType === LessonType.VIDEO ? "blue" : "gray"}
                onClick={() => setSelectedType(LessonType.VIDEO)}
                disabled={isEditing}
                className="flex-1"
                type="button"
              >
                <HiVideoCamera className="mr-2 h-5 w-5" />
                Video
              </Button>
              <Button
                color={selectedType === LessonType.DOCUMENT ? "blue" : "gray"}
                onClick={() => setSelectedType(LessonType.DOCUMENT)}
                disabled={isEditing}
                className="flex-1"
                type="button"
              >
                <HiDocumentText className="mr-2 h-5 w-5" />
                Documento PDF
              </Button>
            </ButtonGroup>
          </div>

          {/* Paso 2: Información básica */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Paso 2: Información Básica
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Completa los datos principales de tu lección.
              </p>
            </div>

            {/* Campo: Título de la lección */}
            <div>
              <Label htmlFor="title" className="mb-2">
                Título de la Lección
              </Label>
              <TextInput
                id="title"
                {...register("title")}
                type="text"
                placeholder="Ej: Introducción a los verbos"
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
                placeholder="Describe el contenido de la lección..."
                rows={4}
                color={errors.description ? "failure" : "gray"}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Campo: Duración */}
            <div>
              <Label htmlFor="duration" className="mb-2">
                Duración (minutos)
              </Label>
              <TextInput
                id="duration"
                {...register("duration", { valueAsNumber: true })}
                type="number"
                min="1"
                max="300"
                placeholder="30"
                color={errors.duration ? "failure" : "gray"}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.duration.message}
                </p>
              )}
            </div>
          </div>

          {/* Paso 3: Contenido según tipo */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Paso 3: Contenido de la Lección
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {selectedType === LessonType.VIDEO
                  ? "Proporciona la URL del video que se mostrará en esta lección."
                  : "Sube el documento PDF que se mostrará en esta lección."}
              </p>
            </div>

            {selectedType === LessonType.VIDEO ? (
              /* Campo: URL del video */
              <div>
                <Label htmlFor="urlContent" className="mb-2">
                  URL del Video
                </Label>
                
                {/* Mostrar enlace actual si está editando */}
                {isEditing && lesson?.urlContent && (
                  <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Video actual:
                    </p>
                    <a
                      href={lesson.urlContent}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-2"
                    >
                      <HiExternalLink className="h-4 w-4" />
                      {lesson.urlContent}
                    </a>
                  </div>
                )}

                <TextInput
                  id="urlContent"
                  {...register("urlContent")}
                  type="url"
                  placeholder="https://ejemplo.com/video.mp4"
                  color={errors.urlContent ? "failure" : "gray"}
                  icon={HiVideoCamera}
                />
                {errors.urlContent && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.urlContent.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Puedes usar enlaces de YouTube, Vimeo o cualquier video compatible.
                </p>
              </div>
            ) : (
              /* Campo: Subir documento PDF */
              <div>
                {/* Mostrar enlace actual si está editando */}
                {isEditing && lesson?.urlContent && (
                  <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Documento actual:
                    </p>
                    <a
                      href={lesson.urlContent}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 dark:text-green-400 hover:underline text-sm flex items-center gap-2"
                    >
                      <HiExternalLink className="h-4 w-4" />
                      {lesson.urlContent.split('/').pop() || lesson.urlContent}
                    </a>
                  </div>
                )}

                <FileUpload 
                  onFileSelect={handleFileSelect}
                  error={fileError}
                />
                
                {errors.urlContent && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.urlContent.message}
                  </p>
                )}
              </div>
            )}
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
                ? "Actualizar Lección"
                : "Crear Lección"}
            </Button>

            <Button
              type="button"
              color="gray"
              onClick={() => router.push(`/my-modules/${moduleId}`)}
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
