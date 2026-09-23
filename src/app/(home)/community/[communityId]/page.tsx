import { use } from "react";
import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import EditCommunityForm from "@/modules/community/view/components/edit_community_form";

export default function CommunityPage({
  params,
}: {
  params: Promise<{ communityId: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <div className="flex h-full flex-col">
      <RouteBreadCrumb />
      <div className="flex flex-1 flex-col items-center p-4 md:p-8">
        <h1 className="w-full text-left text-2xl font-bold md:text-3xl">
          Editar Comunidad
        </h1>
        <EditCommunityForm communityId={resolvedParams.communityId} />
      </div>
    </div>
  );
}
