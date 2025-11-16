import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ModuleClient } from '../client/module_client';
import { CreateModuleRequest, Module, UpdateModuleRequest } from '../../main/types/module.types';

const QUERY_KEYS = {
  MODULES: ['modules'],
  MODULE: (id: string) => ['module', id],
} as const;

/**
 * Hook para crear un módulo
 */
export const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateModuleRequest) => ModuleClient.createModule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MODULES });
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
  useModule,
  useUpdateModule,
  useDeleteModule,
};
