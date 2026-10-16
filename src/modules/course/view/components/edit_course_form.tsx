"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Select,
  Spinner,
  TextInput,
  Textarea,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineBookOpen,
  HiOutlineExclamationCircle,
  HiPencilAlt,
  HiTrash,
} from "react-icons/hi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CourseService } from "../../data/services/course_service";
import { CourseFormValues, courseSchema } from "../schemas/course_schema";
import CourseModuleOrderModal from "./course_module_order_modal";

const levelOptions = [
  { value: "Basic", label: "Básico" },
  { value: "Medium", label: "Medio" },
  { value: "Hard", label: "Difícil" },
] as const;

interface EditCourseFormProps {
  courseId: string;
}

export default function EditCourseForm({ courseId }: EditCourseFormProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { data: course, isLoading, isError } = CourseService.useCourse(courseId);
  const { mutate: updateCourse, isPending: isUpdating } = CourseService.useUpdateCourse();
  const { mutate: deleteCourse, isPending: isDeleting } = CourseService.useDeleteCourse();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (course) {
      reset({
        name: course.name,
        description: course.description,
        level: course.level,
      });
    }
  }, [course, reset]);

  const onSubmit = (data: CourseFormValues) => {
    updateCourse(
      { id: courseId, data },
      {
        onSuccess: () => {
          toast.success("Curso actualizado correctamente");
          router.push("/course");
        },
        onError: () => toast.error("No fue posible actualizar el curso"),
      },
    );
  };

  const handleDelete = () => {
    deleteCourse(courseId, {
      onSuccess: () => {
        toast.success("Curso eliminado correctamente");
        router.push("/course");
      },
      onError: () => toast.error("No fue posible eliminar el curso"),
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center gap-2 p-8 text-gray-500"><Spinner size="sm" /> Cargando curso...</div>;
  }

  if (isError || !course) {
    return <p className="p-8 text-center text-sm text-red-600">No fue posible cargar el curso.</p>;
  }

  const isBusy = isUpdating || isDeleting;

  return (
    <div className="flex w-full flex-1 items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <div className="mb-6 rounded-lg border border-gray-200 p-6 shadow-lg dark:border-gray-700 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Orden de módulos</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Organiza la secuencia en la que se mostrarán los módulos del curso.
              </p>
            </div>
            <Button type="button" color="light" disabled={isBusy} onClick={() => setIsOrderModalOpen(true)}>
              Editar orden
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6 rounded-lg p-6 shadow-lg md:p-8">
          <div>
            <Label htmlFor="course-name" className="mb-2">Nombre del curso</Label>
            <TextInput id="course-name" {...register("name")} placeholder="Ej. Inglés conversacional" color={errors.name ? "failure" : "gray"} icon={HiOutlineBookOpen} />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="course-description" className="mb-2">Descripción</Label>
            <Textarea id="course-description" {...register("description")} placeholder="Describe qué aprenderán los estudiantes" rows={5} color={errors.description ? "failure" : "gray"} />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="course-level" className="mb-2">Nivel</Label>
            <Select id="course-level" {...register("level")} color={errors.level ? "failure" : "gray"}>
              <option value="">Selecciona un nivel</option>
              {levelOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </Select>
            {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>}
          </div>

          <Button type="submit" disabled={!isValid || isBusy} color={isValid ? "blue" : "gray"}>
            <HiPencilAlt className="mr-2 h-5 w-5" />
            {isUpdating ? "Guardando..." : "Guardar cambios"}
          </Button>

          <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Eliminar curso</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Esta acción eliminará el curso de forma permanente.</p>
              </div>
              <Button type="button" color="red" disabled={isBusy} onClick={() => setIsDeleteModalOpen(true)}>
                <HiTrash className="mr-2 h-5 w-5" />
                Eliminar
              </Button>
            </div>
          </div>
        </form>
      </div>

      <CourseModuleOrderModal
        courseId={courseId}
        modules={course.courseModules}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />

      <Modal show={isDeleteModalOpen} size="md" popup onClose={() => setIsDeleteModalOpen(false)}>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">¿Eliminar este curso?</h2>
            <p className="mb-5 mt-2 text-gray-500 dark:text-gray-400">{course.name}</p>
            <p className="mb-5 text-base italic text-gray-500 dark:text-gray-400"><span className="font-semibold">Nota:</span> Esta acción no se podrá deshacer.</p>
            <div className="flex justify-center gap-4">
              <Button color="red" disabled={isDeleting} onClick={handleDelete}>{isDeleting ? "Eliminando..." : "Sí, estoy seguro"}</Button>
              <Button color="alternative" disabled={isDeleting} onClick={() => setIsDeleteModalOpen(false)}>No, cancelar</Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}