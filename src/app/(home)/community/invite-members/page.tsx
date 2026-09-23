import { RouteBreadCrumb } from "@/@core/view/components/layout/breadcrumb/breadcrumb";
import InviteMembersSteps from "@/modules/community/view/components/invite_members_steps";

export default function InviteMembersPage() {
  return (
    <div className="h-full flex flex-col">
      <RouteBreadCrumb />
      <div className="flex flex-col p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl text-gray-900 dark:text-white font-semibold">
            Miembros
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Gestiona la invitación de nuevos miembros a tus comunidades.
          </p>
        </div>
        <InviteMembersSteps />
      </div>
    </div>
  );
}
