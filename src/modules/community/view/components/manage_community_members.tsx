"use client";

import { CommunityService } from "@/modules/community/data/services/community_service";
import {
  Community,
  CommunityMemberWithCommunity,
} from "@/modules/community/main/types/community.types";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  TextInput,
} from "flowbite-react";
import { useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import toast from "react-hot-toast";

export default function ManageCommunityMembers() {
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [selectedCommunityId, setSelectedCommunityId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [memberToDelete, setMemberToDelete] =
    useState<CommunityMemberWithCommunity | null>(null);
  const {
    data: communities = [],
    isLoading: isLoadingCommunities,
    isError: isCommunitiesError,
  } = CommunityService.useFilteredCommunities(searchQuery);
  const {
    data: members = [],
    isLoading: isLoadingMembers,
    isError: isMembersError,
  } = CommunityService.useMembersByCommunity(
    activeStep === 2 ? selectedCommunityId || null : null,
  );
  const { mutate: deleteMember, isPending: isDeleting } =
    CommunityService.useDeleteMember();

  const visibleCommunities = communities.slice(0, 5);
  const normalizedMemberQuery = memberSearchQuery.trim().toLowerCase();
  const filteredMembers = members.filter((member) =>
    `${member.id} ${member.user.firstName} ${member.user.lastName} ${member.user.email} ${member.user.phoneNumber ?? ""}`
      .toLowerCase()
      .includes(normalizedMemberQuery),
  );
  const selectedCommunity = communities.find(
    (community) => community.id === selectedCommunityId,
  );

  const handleDelete = (member: CommunityMemberWithCommunity) => {
    if (!selectedCommunityId) return;

    deleteMember(
      { communityId: selectedCommunityId, memberId: member.id },
      {
        onSuccess: () => toast.success("Miembro eliminado de la comunidad"),
        onError: () => toast.error("No fue posible eliminar el miembro"),
      },
    );
  };

  const handleCommunitySelect = (communityId: string) => {
    setSelectedCommunityId(communityId);
    setActiveStep(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-sm font-semibold text-gray-500 dark:text-gray-400">
        <span
          className={activeStep === 1 ? "text-blue-600 dark:text-blue-400" : ""}
        >
          Paso 1: Comunidad
        </span>
        <span>/</span>
        <span
          className={activeStep === 2 ? "text-blue-600 dark:text-blue-400" : ""}
        >
          Paso 2: Miembros
        </span>
      </div>

      {activeStep === 1 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <Label htmlFor="community-search" title="Buscar comunidad" />
          <TextInput
            id="community-search"
            className="mt-2"
            icon={FaSearch}
            placeholder="Busca por nombre"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          {isCommunitiesError && (
            <p className="mt-2 text-sm text-red-600">
              No fue posible cargar las comunidades.
            </p>
          )}
          {isLoadingCommunities ? (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Spinner size="sm" /> Cargando comunidades...
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {visibleCommunities.map((community: Community) => (
                <button
                  key={community.id}
                  type="button"
                  onClick={() => handleCommunitySelect(community.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    selectedCommunityId === community.id
                      ? "border-blue-600 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
                      : "border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-500"
                  }`}
                >
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {community.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {community.description}
                  </p>
                </button>
              ))}
              {!visibleCommunities.length && (
                <p className="text-sm text-gray-500">
                  No se encontraron comunidades.
                </p>
              )}
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => setActiveStep(2)}
              disabled={!selectedCommunityId}
            >
              Continuar
            </Button>
          </div>
        </section>
      )}

      {activeStep === 2 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Miembros de la comunidad
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {selectedCommunity
                  ? selectedCommunity.name
                  : "Selecciona una comunidad para continuar"}
              </p>
            </div>
            <TextInput
              id="member-search"
              className="md:w-80"
              icon={FaSearch}
              placeholder="Buscar miembro"
              value={memberSearchQuery}
              onChange={(event) => setMemberSearchQuery(event.target.value)}
            />
          </div>

          {isLoadingMembers ? (
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
              <Spinner size="sm" /> Cargando miembros...
            </div>
          ) : isMembersError ? (
            <p className="mt-6 text-sm text-red-600">
              No fue posible cargar los miembros de esta comunidad.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <div className="max-h-[680px] min-w-[760px] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                  <thead className="sticky top-0 bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                    <tr>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3">Apellido</th>
                      <th className="px-4 py-3">Correo</th>
                      <th className="px-4 py-3">Teléfono</th>
                      <th className="px-4 py-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="border-t border-gray-200 dark:border-gray-700"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                          {member.user.firstName || "-"}
                        </td>
                        <td className="px-4 py-3">
                          {member.user.lastName || "-"}
                        </td>
                        <td className="px-4 py-3">
                          {member.user.email || "-"}
                        </td>
                        <td className="px-4 py-3">
                          {member.user.phoneNumber || "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            color="red"
                            size="sm"
                            onClick={() => setMemberToDelete(member)}
                            disabled={isDeleting}
                          >
                            <FaTrash className="mr-2" />
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!filteredMembers.length && (
                  <p className="p-5 text-sm text-gray-500">
                    No se encontraron miembros.
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="mt-6 flex justify-start">
            <Button color="light" onClick={() => setActiveStep(1)}>
              Atrás
            </Button>
          </div>
        </section>
      )}

      <Modal
        show={memberToDelete !== null}
        size="md"
        onClose={() => setMemberToDelete(null)}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              ¿Eliminar miembro de la comunidad?
            </h2>
            <p className="mb-5 mt-2 text-gray-500 dark:text-gray-400">
              {memberToDelete?.user.firstName} {memberToDelete?.user.lastName}
            </p>
            <p className="mb-5 text-base italic text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Nota:</span> Esta acción no se
              podrá deshacer.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                color="alternative"
                disabled={isDeleting}
                onClick={() => setMemberToDelete(null)}
              >
                No, cancelar
              </Button>
              <Button
                color="red"
                disabled={isDeleting || memberToDelete === null}
                onClick={() => {
                  if (memberToDelete) { 
                    handleDelete(memberToDelete);
                    setMemberToDelete(null);
                  }
                }}
              >
                {isDeleting ? "Eliminando..." : "Sí, estoy seguro"}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
