"use client";

import { useMemo } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { ResponsiveTreeMap } from "@nivo/treemap";
import {
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AnalyticsService } from "../../data/services/analytics_service";
import {
  AdminCohortsResponse,
  AnalyticsQuery,
  FunnelMetric,
} from "../../main/types/analytics.types";
import Loading from "@/@core/view/components/Loading";

interface AdminDashboardProps {
  query: AnalyticsQuery;
}

const funnelColors = ["#2563eb", "#7c3aed", "#059669"];

const formatStage = (stage: FunnelMetric["stage"]) => {
  const labels: Record<FunnelMetric["stage"], string> = {
    enrolled: "Inscritos",
    moduleActivity: "Actividad en módulos",
    completed: "Completados",
  };
  return labels[stage];
};

const formatMonth = (month: string) => {
  const date = new Date(`${month}-01T00:00:00`);
  return Number.isNaN(date.getTime())
    ? month
    : date.toLocaleDateString("es", { month: "short", year: "numeric" });
};

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
    <div className="flex h-72 items-center justify-center rounded-xl bg-red-50 px-4 text-center text-sm text-red-700">
      No se pudieron cargar los datos de esta gráfica. Intenta actualizar los
      filtros.
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-72 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
      No hay datos para los filtros seleccionados.
    </div>
  );
}

function Heatmap({ data }: { data: AdminCohortsResponse }) {
  const heatmapData = useMemo(() => {
    const values = new Map<string, number>();

    data.forEach((item) => {
      const key = `${item.registrationMonth}::${item.completionMonth}`;
      values.set(key, (values.get(key) ?? 0) + item.completedLessons);
    });

    const registrations = [...new Set(data.map((item) => item.registrationMonth))];
    const completions = [...new Set(data.map((item) => item.completionMonth))];

    return registrations.map((registrationMonth) => ({
      id: formatMonth(registrationMonth),
      data: completions.map((completionMonth) => ({
        x: formatMonth(completionMonth),
        y: values.get(`${registrationMonth}::${completionMonth}`) ?? 0,
      })),
    }));
  }, [data]);

  return (
    <div className="h-80">
      <ResponsiveHeatMap
        data={heatmapData}
        margin={{ top: 20, right: 20, bottom: 60, left: 100 }}
        valueFormat=" >-.0f"
        axisTop={null}
        axisRight={null}
        axisBottom={{ tickRotation: -35, legend: "Mes de finalización", legendOffset: 50, legendPosition: "middle" }}
        axisLeft={{ legend: "Mes de registro", legendOffset: -85, legendPosition: "middle" }}
        colors={{ type: "sequential", scheme: "blues" }}
        emptyColor="#f1f5f9"
        borderColor="#ffffff"
        borderWidth={2}
        enableLabels
        labelTextColor="#0f172a"
        tooltip={({ cell }) => (
          <div className="rounded bg-slate-900 px-3 py-2 text-xs text-white">
            {cell.serieId} / {cell.data.x}: {cell.value} lecciones
          </div>
        )}
      />
    </div>
  );
}

export function AdminDashboard({ query }: AdminDashboardProps) {
  const funnel = AnalyticsService.useAdminFunnel(query);
  const cohorts = AnalyticsService.useAdminCohorts(query);
  const treemap = AnalyticsService.useAdminTreemap(query);

  const treemapData = useMemo(
    () => ({
      name: "Inscripciones",
      children: (treemap.data ?? []).map((item) => ({
        name: `${item.course} · ${item.community} · ${item.level}`,
        value: item.enrollments,
      })),
    }),
    [treemap.data],
  );

  const isLoading = funnel.isLoading || cohorts.isLoading || treemap.isLoading;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard
        title="Embudo de aprendizaje"
        description="Conversión desde la inscripción hasta la finalización."
      >
        {funnel.isError ? (
          <ChartError />
        ) : funnel.data?.stages.length ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip formatter={(value, name) => [value, name === "count" ? "Usuarios" : name]} />
                <Funnel
                  data={funnel.data.stages}
                  dataKey="count"
                  nameKey="stage"
                  isAnimationActive
                >
                  <LabelList
                    position="right"
                    fill="#334155"
                    stroke="none"
                    dataKey="stage"
                    formatter={(value) => formatStage(value as FunnelMetric["stage"])}
                  />
                  {funnel.data.stages.map((stage, index) => (
                    <Cell key={stage.stage} fill={funnelColors[index % funnelColors.length]} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-slate-500">
              {funnel.data.totalEnrollments.toLocaleString("es")} inscripciones ·{" "}
              {(funnel.data.dropoutRate).toFixed(1)}% de abandono
            </p>
          </div>
        ) : (
          <EmptyChart />
        )}
      </ChartCard>

      <ChartCard
        title="Actividad temporal por cohortes"
        description="Lecciones completadas según el mes de registro y finalización."
      >
        {cohorts.isError ? (
          <ChartError />
        ) : cohorts.data?.length ? (
          <Heatmap data={cohorts.data} />
        ) : (
          <EmptyChart />
        )}
      </ChartCard>

      <div className="lg:col-span-2">
        <ChartCard
          title="Inscripciones por comunidad y nivel"
          description="Distribución de inscripciones en cada comunidad."
        >
          {treemap.isError ? (
            <ChartError />
          ) : treemap.data?.length ? (
            <div className="h-96">
              <ResponsiveTreeMap
                data={treemapData}
                identity="name"
                value="value"
                valueFormat=" >-.0f"
                label={(node) => `${node.id}: ${node.formattedValue}`}
                labelSkipSize={24}
                parentLabel={(node) => node.id}
                parentLabelPosition="left"
                parentLabelTextColor="#0f172a"
                colors={{ scheme: "tableau10" }}
                borderColor="#ffffff"
                borderWidth={2}
                enableLabel={true}
                labelTextColor="#ffffff"
                tooltip={({ node }) => (
                  <div className="rounded bg-slate-900 px-3 py-2 text-xs text-white">
                    {node.id}: {node.formattedValue} inscripciones
                  </div>
                )}
              />
            </div>
          ) : (
            <EmptyChart />
          )}
        </ChartCard>
      </div>
    </div>
  );
}
