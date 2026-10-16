import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CourseClient } from "../client/course_client";
import {
  CreateCourseRequest,
  ReorderCourseModulesRequest,
  UpdateCourseRequest,
} from "../../main/types/course.types";

const COURSE_QUERY_KEY = ["courses"] as const;
const courseQueryKey = (id: string) => [...COURSE_QUERY_KEY, id] as const;

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: courseQueryKey(id),
    queryFn: () => CourseClient.getCourse(id),
    enabled: !!id,
  });
};

export const useCoursesByCommunityId = (communityId: string | null) => {
  return useQuery({
    queryKey: communityId
      ? [...COURSE_QUERY_KEY, "community", communityId]
      : [...COURSE_QUERY_KEY, "community", null],
    queryFn: () => CourseClient.getCoursesByCommunityId(communityId as string),
    enabled: !!communityId,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseRequest) => CourseClient.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEY });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseRequest }) =>
      CourseClient.updateCourse(id, data),
    onSuccess: (course) => {
      queryClient.setQueryData(courseQueryKey(course.id), course);
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEY });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CourseClient.deleteCourse(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: courseQueryKey(id) });
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEY });
    },
  });
};

export const useReorderCourseModules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderCourseModulesRequest) =>
      CourseClient.reorderCourseModules(data),
    onSuccess: (course, variables) => {
      queryClient.setQueryData(courseQueryKey(variables.courseId), course);
      queryClient.invalidateQueries({ queryKey: COURSE_QUERY_KEY });
    },
  });
};

export const CourseService = {
  useCoursesByCommunityId,
  useCourse,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
  useReorderCourseModules,
};