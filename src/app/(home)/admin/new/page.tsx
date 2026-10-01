import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import AdminForm from "@/modules/admin/view/components/admin_form";

export default function NewAdminPage() {
  return (
    <div className="min-h-full p-4 md:p-8">
      <RouteBreadCrumb />
      <div className="mx-auto mt-6 max-w-3xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Nuevo administrador
        </h1>
        <AdminForm />
      </div>
    </div>
  );
}