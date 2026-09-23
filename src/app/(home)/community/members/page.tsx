import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import ManageCommunityMembers from "@/modules/community/view/components/manage_community_members";

export default function MembersPage() {
  return (
    <div className="h-full flex flex-col">
      <RouteBreadCrumb />
      <main className="flex flex-col gap-6 p-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Editar miembros</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Selecciona una comunidad y administra sus miembros.</p>
        </div>
        <ManageCommunityMembers />
      </main>
    </div>
  );
}
