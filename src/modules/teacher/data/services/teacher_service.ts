import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TeacherClient } from "../client/teacher_client";
import {
  CreateTeacherRequest,
  UpdateTeacherRequest,
} from "../../main/types/teacher.types";

const TEACHER_KEYS = {
  all: ["teachers"] as const,
  detail: (id: string) => ["teacher", id] as const,
};

const useTeachers = () =>
  useQuery({
    queryKey: TEACHER_KEYS.all,
    queryFn: TeacherClient.getTeachers,
  });

const useTeacher = (id: string) =>
  useQuery({
    queryKey: TEACHER_KEYS.detail(id),
    queryFn: () => TeacherClient.getTeacherById(id),
    enabled: Boolean(id),
  });

const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeacherRequest) => TeacherClient.createTeacher(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.all }),
  });
};

const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeacherRequest }) =>
      TeacherClient.updateTeacher(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.detail(variables.id) });
    },
  });
};

const useDeleteTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TeacherClient.deleteTeacher(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TEACHER_KEYS.all }),
  });
};

export const TeacherService = {
  useTeachers,
  useTeacher,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
};