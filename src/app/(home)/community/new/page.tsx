import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import NewCommunityForm from "@/modules/community/view/components/new_community_form";

export default function NewCommunityPage() {
  return (
    <div className="h-full flex flex-col">
      <RouteBreadCrumb />
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-left w-full">
          Crear Nueva Comunidad
        </h1>
        <NewCommunityForm />
      </div>
    </div>
  );
}
