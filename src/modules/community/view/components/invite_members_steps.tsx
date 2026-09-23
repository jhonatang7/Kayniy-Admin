"use client";

import { Button, Card, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { FaCheck, FaSearch, FaUserGraduate, FaUserTie } from "react-icons/fa";
import { CommunityService } from "@/modules/community/data/services/community_service";
import toast from "react-hot-toast";
import {
  Community,
  CommunityMember,
} from "@/modules/community/main/types/community.types";
import { useRouter } from "next/navigation";

type MemberType = "TEACHER" | "STUDENT";

export default function InviteMembersSteps() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);
  const [selectedMemberType, setSelectedMemberType] =
    useState<MemberType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(
    null,
  );
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null,
  );
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<CommunityMember[]>([]);
  const {
    mutate: addCommunityMembers,
    isPending: isAddingMembers,
    isError: isAddMembersError,
  } = CommunityService.useAddCommunityMembers();

  const {
    data: filteredCommunities = [],
    isLoading: isLoadingCommunities,
    isError: isCommunitiesError,
  } = CommunityService.useFilteredCommunities(searchQuery);

  const {
    data: filteredMembers = [],
    isLoading: isLoadingMembers,
    isError: isMembersError,
  } = CommunityService.useFilteredMembers(
    selectedMemberType,
    memberSearchQuery,
  );

  const step1IsComplete = selectedMemberType !== null;
  const step2IsComplete = selectedCommunityId !== null;
  const step3IsComplete = selectedMembers.length > 0;

  const visibleCommunities = filteredCommunities.slice(0, 5);
  const hasMoreCommunities =
    filteredCommunities.length > visibleCommunities.length;
  const visibleMembers = filteredMembers.slice(0, 5);
  const visibleSelectedMembers = selectedMembers.slice(0, 5);
  const hasMoreMembers = filteredMembers.length > visibleMembers.length;

  const handleMemberTypeChange = (memberType: MemberType) => {
    setActiveStep(1);
    setSelectedMemberType(memberType);
    setSelectedCommunityId(null);
    setSelectedCommunity(null);
    setMemberSearchQuery("");
    setSelectedMembers([]);
  };

  const handleContinue = () => {
    if (activeStep === 1 && step1IsComplete) {
      setActiveStep(2);
      return;
    }

    if (activeStep === 2 && step2IsComplete) {
      setActiveStep(3);
      return;
    }

    if (activeStep === 3 && step3IsComplete) {
      setActiveStep(4);
    }
  };

  const handleFinalize = () => {
    if (!selectedMemberType || !selectedCommunityId || !step3IsComplete) {
      return;
    }

    addCommunityMembers(
      {
        communityRole: selectedMemberType,
        communityId: selectedCommunityId,
        userIds: selectedMembers.map((member) => member.id),
      },
      {
        onSuccess: () => {
          toast.success("Miembros añadidos exitosamente");
          setActiveStep(1);
          setSelectedMemberType(null);
          setSelectedCommunityId(null);
          setSelectedCommunity(null);
          setMemberSearchQuery("");
          setSelectedMembers([]);
          router.push("/community");
        },
        onError: (error: any) => {
          toast.error("Error al añadir miembros");
          console.error(
            "Error al añadir miembros:",
            error?.response?.data?.message || error.message,
          );
        },
      },
    );
  };

  const toggleMember = (member: CommunityMember) => {
    setSelectedMembers((currentMembers) => {
      const isSelected = currentMembers.some(
        (selectedMember) => selectedMember.id === member.id,
      );

      return isSelected
        ? currentMembers.filter(
            (selectedMember) => selectedMember.id !== member.id,
          )
        : [...currentMembers, member];
    });
  };

  return (
    <div className="space-y-6">
      {activeStep === 1 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
              Paso 1
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                step1IsComplete
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {step1IsComplete ? "Completado" : "Pendiente"}
            </span>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Selecciona el tipo de miembro
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Elige si vas a invitar a un profesor o a un estudiante antes de
            continuar con la comunidad.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => handleMemberTypeChange("TEACHER")}
              className={`flex min-h-[120px] flex-col items-start justify-between rounded-2xl border p-5 text-left transition-all cursor-pointer ${
                selectedMemberType === "TEACHER"
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200 dark:border-blue-500 dark:bg-blue-900/20 dark:ring-blue-800"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  <FaUserTie />
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Profesor
                </span>
              </div>

              <span className="text-sm text-gray-600 dark:text-gray-300">
                Asigna acceso como docente o coordinador.
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleMemberTypeChange("STUDENT")}
              className={`flex min-h-[120px] flex-col items-start justify-between rounded-2xl border p-5 text-left transition-all cursor-pointer ${
                selectedMemberType === "STUDENT"
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200 dark:border-blue-500 dark:bg-blue-900/20 dark:ring-blue-800"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                  <FaUserGraduate />
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Estudiante
                </span>
              </div>

              <span className="text-sm text-gray-600 dark:text-gray-300">
                Invita a alumnos para acceder a la comunidad.
              </span>
            </button>
          </div>
        </div>
      )}

      {activeStep === 2 && (
        <>
          <div
            className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all dark:border-gray-700 dark:bg-gray-800 ${
              !step1IsComplete ? "opacity-75" : "opacity-100"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
                Paso 2
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  step2IsComplete
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {step2IsComplete ? "Completado" : "Pendiente"}
              </span>
            </div>

            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Selecciona tu comunidad
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Busca la comunidad a la que deseas agregar miembros.
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <Label htmlFor="search-community" title="Buscar comunidad" />
              <TextInput
                id="search-community"
                type="search"
                icon={FaSearch}
                placeholder="Busca una comunidad"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                disabled={!step1IsComplete}
              />
            </div>

            {!step1IsComplete ? (
              <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-900/30 dark:text-gray-300">
                Primero completa el paso 1 para poder seleccionar una comunidad.
              </div>
            ) : isLoadingCommunities ? (
              <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-900/30 dark:text-gray-300">
                Cargando comunidades...
              </div>
            ) : isCommunitiesError ? (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                No fue posible cargar las comunidades. Intenta nuevamente.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {visibleCommunities.length > 0 ? (
                  <>
                    {visibleCommunities.map((community) => {
                      const isSelected = selectedCommunityId === community.id;

                      return (
                        <button
                          key={community.id}
                          type="button"
                          onClick={() => {
                            setSelectedCommunityId(community.id);
                            setSelectedCommunity(community);
                          }}
                          className={`w-full rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200 dark:border-blue-500 dark:bg-blue-900/20 dark:ring-blue-800"
                              : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-blue-500"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-base font-semibold text-gray-900 dark:text-white">
                                {community.name}
                              </p>
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                {community.description}
                              </p>
                            </div>

                            {isSelected ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                <FaCheck />
                                Seleccionada
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                Elegir
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}

                    {hasMoreCommunities && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Mostrando 5 de {filteredCommunities.length} resultados.
                        Refiná la búsqueda para ver más.
                      </p>
                    )}
                  </>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-900/30 dark:text-gray-300">
                    No se encontraron comunidades con ese criterio de búsqueda.
                  </div>
                )}
              </div>
            )}
          </div>

          <Card
            className={`${selectedCommunity ? "border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20" : "border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/30"}`}
          >
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Comunidad seleccionada
            </h4>

            {selectedCommunity ? (
              <div className="mt-3 space-y-1">
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedCommunity.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedCommunity.description}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Aún no has seleccionado una comunidad.
              </p>
            )}
          </Card>
        </>
      )}

      {activeStep === 3 && (
        <div
          className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all dark:border-gray-700 dark:bg-gray-800 ${
            !step2IsComplete ? "opacity-75" : "opacity-100"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
              Paso 3
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                step3IsComplete
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {step3IsComplete ? "Completado" : "Pendiente"}
            </span>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Selecciona los miembros
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Busca y selecciona todas las personas que deseas invitar.
          </p>

          <div className="mt-5 flex flex-col gap-2">
            <Label htmlFor="search-member" title="Buscar miembro" />
            <TextInput
              id="search-member"
              type="search"
              icon={FaSearch}
              placeholder="Busca por nombre o correo"
              value={memberSearchQuery}
              onChange={(event) => setMemberSearchQuery(event.target.value)}
              disabled={!step2IsComplete}
            />
          </div>

          {!step2IsComplete ? (
            <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-900/30 dark:text-gray-300">
              Primero selecciona una comunidad para poder elegir miembros.
            </div>
          ) : isLoadingMembers ? (
            <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-900/30 dark:text-gray-300">
              Cargando miembros...
            </div>
          ) : isMembersError ? (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
              No fue posible cargar los miembros. Intenta nuevamente.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {visibleMembers.length > 0 ? (
                visibleMembers.map((member) => {
                  const isSelected = selectedMembers.some(
                    (selectedMember) => selectedMember.id === member.id,
                  );
                  const fullName =
                    `${member.firstName} ${member.lastName}`.trim();

                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => toggleMember(member)}
                      className={`w-full rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200 dark:border-blue-500 dark:bg-blue-900/20 dark:ring-blue-800"
                          : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/40 dark:border-gray-700 dark:bg-gray-900/40 dark:hover:border-blue-500"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-gray-900 dark:text-white">
                            {fullName || member.email}
                          </p>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            {member.email}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                          {isSelected ? (
                            <>
                              <FaCheck /> Seleccionado
                            </>
                          ) : (
                            "Elegir"
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-900/30 dark:text-gray-300">
                  No se encontraron miembros con ese criterio de búsqueda.
                </div>
              )}
              {hasMoreMembers && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Mostrando 5 de {filteredMembers.length} resultados. Refiná la
                  búsqueda para ver más.
                </p>
              )}
            </div>
          )}

          <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Miembros seleccionados ({selectedMembers.length})
            </p>
            {visibleSelectedMembers.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {visibleSelectedMembers.map((member) => (
                  <span
                    key={member.id}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                  >
                    {`${member.firstName} ${member.lastName}`.trim()} -{" "}
                    {member.email}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Selecciona al menos un miembro para continuar.
              </p>
            )}
          </div>
        </div>
      )}

      {activeStep === 4 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
              Resumen
            </span>
            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
              Listo para finalizar
            </span>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Revisa la invitación
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Confirma la información antes de finalizar.
          </p>

          <div className="mt-6 divide-y divide-gray-200 rounded-xl border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Tipo de miembro
              </p>
              <p className="mt-1 font-medium text-gray-900 dark:text-white">
                {selectedMemberType === "STUDENT" ? "Estudiante" : "Profesor"}
              </p>
            </div>

            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Comunidad
              </p>
              <p className="mt-1 font-medium text-gray-900 dark:text-white">
                {selectedCommunity?.name}
              </p>
            </div>

            <div className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Miembros seleccionados ({selectedMembers.length})
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedMembers.map((member) => (
                  <span
                    key={member.id}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                  >
                    {`${member.firstName} ${member.lastName}`.trim()} -{" "}
                    {member.email}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between gap-3">
        {activeStep > 1 ? (
          <Button
            color="light"
            size="lg"
            onClick={() => setActiveStep((currentStep) => currentStep - 1)}
          >
            Atrás
          </Button>
        ) : (
          <span />
        )}
        <Button
          size="lg"
          onClick={activeStep === 4 ? handleFinalize : handleContinue}
          disabled={
            (activeStep === 1 && !step1IsComplete) ||
            (activeStep === 2 && !step2IsComplete) ||
            (activeStep === 3 && !step3IsComplete) ||
            isAddingMembers
          }
          className="min-w-[180px]"
        >
          {isAddingMembers
            ? "Añadiendo..."
            : activeStep === 4
              ? "Finalizar"
              : "Continuar"}
        </Button>
      </div>
      {isAddMembersError && (
        <p className="text-right text-sm text-red-600 dark:text-red-400">
          No fue posible añadir los miembros. Intenta nuevamente.
        </p>
      )}
    </div>
  );
}
