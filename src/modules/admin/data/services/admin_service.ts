import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminClient } from "../client/admin_client";
import { CreateAdminRequest } from "../../main/types/admin.types";

const ADMIN_KEYS = {
  all: ["admins"] as const,
};

const useAdmins = () =>
  useQuery({
    queryKey: ADMIN_KEYS.all,
    queryFn: AdminClient.getAdmins,
  });

const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminRequest) => AdminClient.createAdmin(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.all }),
  });
};

const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AdminClient.deleteAdmin(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.all }),
  });
};

export const AdminService = {
  useAdmins,
  useCreateAdmin,
  useDeleteAdmin,
};