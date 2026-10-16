"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Card, Spinner, TextInput } from "flowbite-react";
import {
  HiChevronRight,
  HiClipboardList,
  HiOutlineBookOpen,
  HiOutlinePencilAlt,
  HiOutlineSearch,
  HiVideoCamera,
} from "react-icons/hi";
import { GrDocumentPdf } from "react-icons/gr";
import { CourseLevel, CourseWithContent } from "../../main/types/course.types";
import { CourseService } from "../../data/services/course_service";
import { AuthService } from "@/modules/auth/data/services/auth_service";

const levelLabels: Record<CourseLevel, string> = {
  Basic: "Básico",
  Medium: "Medio",
  Hard: "Difícil",
};

function CourseCard({
  course,
  isSelected,
  onSelect,
  onEdit,
}: {
  course: CourseWithContent;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}) {
  return (
    <Card
      onClick={onSelect}
      className={`flex min-h-[300px] min-w-[290px] max-w-[330px] flex-shrink-0 cursor-pointer flex-col border-2 transition-colors ${
        isSelected
          ? "border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-gray-800"
          : "border-transparent hover:border-blue-200 dark:hover:border-blue-700"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <Badge color="info">{levelLabels[course.level]}</Badge>
        <span className="text-sm text-gray-500">{course.courseModules.length} módulos</span>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{course.name}</h3>
      <p className="min-h-12 flex-1 overflow-y-auto text-sm leading-6 text-gray-600 dark:text-gray-300">
        {course.description}
      </p>
      <div className="flex items-center gap-2 pt-4">
        <Button className="flex-1" color={isSelected ? "blue" : "light"} onClick={onSelect}>
          Ver contenido
          <HiChevronRight className="ml-2 h-5 w-5" />
        </Button>
        <Button
          color="light"
          title="Editar curso"
          aria-label={`Editar ${course.name}`}
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
        >
          <HiOutlinePencilAlt className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}

export default function CourseList() {
  const router = useRouter();
  const { data: user, isLoading: isLoadingUser } = AuthService.useMe();
  const communityId = user?.community?.id ?? null;
  const {
    data: courses = [],
    isLoading: isLoadingCourses,
    isError,
  } = CourseService.useCoursesByCommunityId(communityId);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const visibleCourses = courses.filter(
    (course) =>
      !course.isDeleted &&
      `${course.name} ${course.description} ${course.level}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );
  const selectedCourse = visibleCourses.find((course) => course.id === selectedCourseId) ?? visibleCourses[0];

  return (
    <div className="space-y-8 p-4 md:p-8">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">Aprendizaje</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">Cursos</h1>
          <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
            Explora los cursos disponibles y continúa aprendiendo a tu ritmo.
          </p>
        </div>
        <Button size="lg" className="shrink-0" onClick={() => router.push("/course/new")}>
          <HiOutlineBookOpen className="mr-2 h-5 w-5" />
          Crear nuevo curso
        </Button>
      </header>

      <div className="max-w-xl">
        <TextInput
          icon={HiOutlineSearch}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Buscar por nombre, descripción o nivel"
          aria-label="Buscar cursos"
        />
      </div>

      <section aria-labelledby="courses-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="courses-heading" className="text-2xl font-bold text-gray-900 dark:text-white">
            Cursos disponibles
          </h2>
          <span className="text-sm text-gray-500">{visibleCourses.length} resultados</span>
        </div>
        {isLoadingUser || isLoadingCourses ? (
          <div className="flex justify-center py-8"><Spinner size="xl" /></div>
        ) : !communityId ? (
          <p className="py-8 text-red-600">No perteneces a ninguna comunidad.</p>
        ) : isError ? (
          <p className="py-8 text-red-600">No fue posible cargar los cursos.</p>
        ) : <div className="flex gap-4 overflow-x-auto pb-3">
          {visibleCourses.length > 0 ? (
            visibleCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isSelected={course.id === selectedCourse?.id}
                onSelect={() => setSelectedCourseId(course.id)}
                onEdit={() => router.push(`/course/${course.id}`)}
              />
            ))
          ) : (
            <p className="py-8 text-gray-500">No se encontraron cursos con esa búsqueda.</p>
          )}
        </div>}
      </section>

      {selectedCourse && (
        <section className="border-t border-gray-200 pt-8 dark:border-gray-700" aria-labelledby="course-content-heading">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Contenido del curso</p>
              <h2 id="course-content-heading" className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedCourse.name}
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Registrado el {new Date(selectedCourse.registeredDate).toLocaleDateString("es-ES")}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {selectedCourse.courseModules.length > 0 ? (
              [...selectedCourse.courseModules].sort((first, second) => first.order - second.order).map((courseModule) => {
                const courseModuleContent = courseModule.module;
                return (
                <article key={courseModuleContent.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="mb-1 text-sm font-medium text-blue-600">Módulo {courseModule.order}</p>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{courseModuleContent.title}</h3>
                    </div>
                    <Badge color="gray">{courseModuleContent.lessons.length} lecciones</Badge>
                  </div>
                  <p className="mt-2 max-h-20 overflow-y-auto text-sm text-gray-600 dark:text-gray-300">
                    {courseModuleContent.description}
                  </p>
                  <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4 dark:border-gray-700">
                    {[...courseModuleContent.lessons].sort((first, second) => first.order - second.order).map((lesson) => (
                      <li key={lesson.id} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-blue-600">{lesson.order}.</span>
                        {lesson.type === "VIDEO" ? (
                          <HiVideoCamera className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-label="Video" />
                        ) : lesson.type === "DOCUMENT" ? (
                          <GrDocumentPdf className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-label="Documento PDF" />
                        ) : (
                          <HiClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-purple-600" aria-label="Cuestionario" />
                        )}
                        <span>{lesson.title}</span>
                        <span className="ml-auto whitespace-nowrap text-xs text-gray-500">{lesson.duration} min</span>
                      </li>
                    ))}
                  </ul>
                </article>
                );
              })
            ) : (
              <p className="text-gray-500">Este curso aún no tiene módulos disponibles.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}