import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ModuleClient } from '../client/module_client';
import { CreateModuleRequest, UpdateModuleRequest } from '../../main/types/module.types';

const QUERY_KEYS = {
  MODULES: ['modules'],
  MODULES_BY_COMMUNITY: (communityId: string) => ['modules', 'community', communityId],
  ALL_MODULES_BY_COMMUNITY: (communityId: string) => ['modules', 'community', 'all', communityId],
  MODULE: (id: string) => ['module', id],
} as const;

/**
 * Hook para crear un módulo
 */
export const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateModuleRequest) => ModuleClient.createModule(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULES });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MODULES_BY_COMMUNITY(variables.communityId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ALL_MODULES_BY_COMMUNITY(variables.communityId),
      });
    },
  });
};

/**
 * Hook para obtener todos los módulos
 */
export const useModules = () => {
  return useQuery({
    queryKey: QUERY_KEYS.MODULES,
    queryFn: () => ModuleClient.getModules(),
  });
};

export const useModulesByCommunityId = (communityId: string | null) => {
  return useQuery({
    queryKey: communityId
      ? QUERY_KEYS.MODULES_BY_COMMUNITY(communityId)
      : ['modules', 'community', null],
    queryFn: () => ModuleClient.getModulesByCommunityId(communityId as string),
    enabled: !!communityId,
  });
};

export const useAllModulesByCommunityId = (communityId: string | null) => {
  return useQuery({
    queryKey: communityId
      ? QUERY_KEYS.ALL_MODULES_BY_COMMUNITY(communityId)
      : ['modules', 'community', 'all', null],
    queryFn: () => ModuleClient.getAllModulesByCommunityId(communityId as string),
    enabled: !!communityId,
  });
};

/**
 * Hook para obtener un módulo por ID
 */
export const useModule = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.MODULE(id),
    queryFn: () => ModuleClient.getModuleById(id),
    enabled: !!id,
  });
};

/**
 * Hook para actualizar un módulo
 */
export const useUpdateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateModuleRequest }) =>
      ModuleClient.updateModule(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULE(variables.id) });
    },
  });
};

/**
 * Hook para eliminar un módulo
 */
export const useDeleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ModuleClient.deleteModule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULES });
    },
  });
};

export const ModuleService = {
  useCreateModule,
  useModules,
  useModulesByCommunityId,
  useAllModulesByCommunityId,
  useModule,
  useUpdateModule,
  useDeleteModule,
};
