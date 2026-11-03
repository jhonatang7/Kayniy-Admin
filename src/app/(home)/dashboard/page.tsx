"use client";

import { useMemo, useState } from "react";
import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import { AuthService } from "@/modules/auth/data/services/auth_service";
import { getRoleName } from "@/modules/auth/main/authorization";
import { AnalyticsService } from "@/modules/analytics/data/services/analytics_service";
import { AnalyticsQuery } from "@/modules/analytics/main/types/analytics.types";
import { AdminDashboard } from "@/modules/analytics/view/components/admin_dashboard";
import { ProfessorDashboard } from "@/modules/analytics/view/components/professor_dashboard";

export default function DashboardPage() {
  const { data: user } = AuthService.useMe();
  const roleName = getRoleName(user?.role);
  const isAdmin = roleName === "admin" || roleName === "superAdmin";
  const isProfessor = roleName === "teacher" || roleName === "professor";
  const { data: courses = [], isError: coursesError } = AnalyticsService.useAdminCourses(isAdmin);
  const { data: communities = [], isError: communitiesError } = AnalyticsService.useAdminCommunities(isAdmin);
  const professorCommunityId = user?.community?.id ?? null;
  const { data: professorCourses = [], isError: professorCoursesError } =
    AnalyticsService.useProfessorCourses(professorCommunityId, isProfessor);
  const [courseId, setCourseId] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const adminQuery = useMemo<AnalyticsQuery>(
    () => ({
      ...(courseId ? { courseId } : {}),
      ...(communityId ? { communityId } : {}),
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
    }),
    [courseId, communityId, startDate, endDate],
  );

  const professorQuery = useMemo<AnalyticsQuery>(
    () => ({
      ...(courseId ? { courseId } : {}),
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
    }),
    [courseId, startDate, endDate],
  );

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-8">
      <RouteBreadCrumb />
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue-600">
          Panel de administración
        </p>
        <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">Dashboard</h1>
        <p className="mt-2 text-slate-600">
          Consulta el rendimiento de las inscripciones y el progreso de aprendizaje.
        </p>
      </header>

      {isAdmin ? (
        <>
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-semibold text-slate-900">Filtros de métricas</h2>
                <p className="text-sm text-slate-500">
                  Ajusta el periodo y el alcance de los datos mostrados.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCourseId("");
                  setCommunityId("");
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Limpiar filtros
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-sm font-medium text-slate-700">
                Curso
                <select
                  value={courseId}
                  onChange={(event) => setCourseId(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Todos los cursos</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                Comunidad
                <select
                  value={communityId}
                  onChange={(event) => setCommunityId(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Todas las comunidades</option>
                  {communities.map((community) => (
                    <option key={community.id} value={community.id}>
                      {community.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                Desde
                <input
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Hasta
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>
            {(coursesError || communitiesError) && (
              <p className="mt-3 text-sm text-amber-700">
                No se pudieron cargar todas las opciones de filtro. Las métricas siguen disponibles.
              </p>
            )}
          </section>
          <AdminDashboard query={adminQuery} />
        </>
      ) : isProfessor ? (
        <>
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-semibold text-slate-900">Filtros de métricas</h2>
                <p className="text-sm text-slate-500">
                  Las métricas están limitadas a tu comunidad.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCourseId("");
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Limpiar filtros
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-sm font-medium text-slate-700">
                Curso
                <select
                  value={courseId}
                  onChange={(event) => setCourseId(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Todos los cursos</option>
                  {professorCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                Comunidad
                <input
                  value={user?.community?.name ?? "Comunidad no disponible"}
                  disabled
                  readOnly
                  className="mt-1.5 w-full cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 px-3 py-2.5 text-slate-500"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Desde
                <input
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Hasta
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-normal text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>
            {professorCoursesError && (
              <p className="mt-3 text-sm text-amber-700">
                No se pudieron cargar los cursos de tu comunidad.
              </p>
            )}
          </section>
          <ProfessorDashboard communityId={professorCommunityId} query={professorQuery} />
        </>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Métricas no disponibles</h2>
          <p className="mt-2 text-slate-600">
            El dashboard para el rol {roleName || "actual"} estará disponible próximamente.
          </p>
        </section>
      )}
    </div>
  );
}
