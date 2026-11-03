"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import Loading from "@/@core/view/components/Loading";
import { AnalyticsService } from "../../data/services/analytics_service";
import { AnalyticsQuery, ProfessorActivityAnalytics } from "../../main/types/analytics.types";

interface ProfessorDashboardProps {
  communityId: string | null;
  query: AnalyticsQuery;
}

const weekdayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const activityColors = ["#2563eb", "#7c3aed", "#059669", "#ea580c", "#db2777", "#0891b2", "#ca8a04"];

function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ChartError() {
  return (
    <div className="flex h-80 items-center justify-center rounded-xl bg-red-50 px-4 text-center text-sm text-red-700">
      No se pudieron cargar los datos de esta métrica. Intenta actualizar los filtros.
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-80 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
      No hay datos para los filtros seleccionados.
    </div>
  );
}

function ActivityChart({ data }: { data: ProfessorActivityAnalytics }) {
  const chartData = useMemo(() => {
    const values = new Map(
      data.map((item) => [`${item.weekday}:${item.hour}`, item.completedLessons]),
    );

    return Array.from({ length: 24 }, (_, hour) => {
      const item: Record<string, number> = { hour };
      for (let weekday = 0; weekday < 7; weekday += 1) {
        item[weekdayNames[weekday]] = values.get(`${weekday + 1}:${hour}`) ?? 0;
      }
      return item;
    });
  }, [data]);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
          <YAxis allowDecimals={false} />
          <Tooltip
            labelFormatter={(hour) => `${hour}:00`}
            formatter={(value, name) => [value, name]}
          />
          <Legend />
          {weekdayNames.map((weekday, index) => (
            <Line
              key={weekday}
              type="monotone"
              dataKey={weekday}
              stroke={activityColors[index]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProfessorDashboard({ communityId, query }: ProfessorDashboardProps) {
  const courses = AnalyticsService.useProfessorCourses(communityId);
  const bottlenecks = AnalyticsService.useProfessorBottlenecks(communityId, query);
  const studentRisk = AnalyticsService.useProfessorStudentRisk(communityId, query);
  const activity = AnalyticsService.useProfessorActivity(communityId, query);

  const bottleneckData = useMemo(
    () =>
      (bottlenecks.data ?? []).map((item) => ({
        ...item,
        failedRatePercent: item.failedRate,
      })),
    [bottlenecks.data],
  );

  const isLoading =
    courses.isLoading ||
    bottlenecks.isLoading ||
    studentRisk.isLoading ||
    activity.isLoading;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard
        title="Cuellos de botella por quiz"
        description="Identifica los quizzes con menor desempeño y mayor proporción de intentos reprobados."
      >
        {bottlenecks.isError ? (
          <ChartError />
        ) : bottleneckData.length ? (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bottleneckData}
                layout="vertical"
                margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, "dataMax"]} />
                <YAxis type="category" dataKey="quiz" width={130} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) => [
                    name === "Puntaje promedio" ? Number(value).toFixed(2) : `${Number(value).toFixed(1)}%`,
                    name
                  ]}
                />
                <Legend />
                <Bar dataKey="averageScore" name="Puntaje promedio" fill="#2563eb" />
                <Bar dataKey="failedRatePercent" name="Tasa reprobada" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyChart />
        )}
      </ChartCard>

      <ChartCard
        title="Estudiantes en riesgo"
        description="El cuadrante inferior izquierdo representa menor avance y calificaciones más bajas."
      >
        {studentRisk.isError ? (
          <ChartError />
        ) : studentRisk.data?.length ? (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="courseProgress"
                  name="Avance del curso"
                  unit="%"
                  domain={[0, 100]}
                />
                <YAxis
                  type="number"
                  dataKey="averageScore"
                  name="Puntaje promedio"
                  domain={[0, 100]}
                  unit="%"
                />
                <ZAxis type="number" range={[60, 60]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter name="Estudiantes" data={studentRisk.data} fill="#7c3aed">
                  {studentRisk.data.map((student) => (
                    <Cell key={student.studentId} fill={
                      student.courseProgress < 50 && student.averageScore < 50
                        ? "#dc2626"
                        : "#7c3aed"
                    } />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyChart />
        )}
      </ChartCard>

      <div className="lg:col-span-2">
        <ChartCard
          title="Frecuencia de conexión"
          description="Lecciones completadas por hora, agrupadas por día de la semana."
        >
          {activity.isError ? (
            <ChartError />
          ) : activity.data?.length ? (
            <ActivityChart data={activity.data} />
          ) : (
            <EmptyChart />
          )}
        </ChartCard>
      </div>
    </div>
  );
}
