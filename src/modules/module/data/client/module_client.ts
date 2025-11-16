import { HttpClient } from '@/@core/data/client/http_client';
import { API_ENDPOINTS } from '@/@core/data/client/endpoints';
import { CreateModuleRequest, Module, UpdateModuleRequest } from '../../main/types/module.types';
import apiClient from '@/@core/data/client/api_client';

export class ModuleClient {
  /**
   * Crear un nuevo módulo
   */
  static async createModule(data: CreateModuleRequest): Promise<Module> {
     const response = await apiClient.post<Module>(`${API_ENDPOINTS.MODULE}`, data);
     return response.data;
  }

  /**
   * Obtener todos los módulos
   */
  static async getModules(): Promise<Module[]> {
    const response = await apiClient.get<Module[]>(`${API_ENDPOINTS.MODULE}`);
    return response.data;
  }

  /**
   * Obtener un módulo por ID
   */
  static async getModuleById(id: string): Promise<Module> {
    const response = await apiClient.get<Module>(`${API_ENDPOINTS.MODULE}/${id}`);
    return response.data;
  }

  /**
   * Actualizar un módulo
   */
  static async updateModule(id: string, data: UpdateModuleRequest): Promise<Module> {
    const response = await apiClient.patch<Module>(`${API_ENDPOINTS.MODULE}/${id}`, data);
    return response.data;
  }

  /**
   * Eliminar un módulo
   */
  static async deleteModule(id: string): Promise<void> {
    const response = await apiClient.delete<void>(`${API_ENDPOINTS.MODULE}/${id}`);
    return response.data;
  }
}
