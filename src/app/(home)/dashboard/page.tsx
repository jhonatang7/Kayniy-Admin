import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";

export default function DashboardPage() {
  return (
    <div className="h-full">
      <RouteBreadCrumb />
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600">Bienvenido a la plataforma administrativa</p>
    </div>
  );
}
