import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import AdminList from "@/modules/admin/view/components/admin_list";

export default function AdminPage() {
  return (
    <div className="h-full">
      <RouteBreadCrumb />
      <div className="flex flex-col space-y-4 p-8">
        <AdminList />
      </div>
    </div>
  );
}