import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LiveClassClient } from "../client/live_class_client";
import {
  CreateLiveClassRequest,
  UpdateLiveClassRequest,
} from "../../main/types/live_class.types";

const QUERY_KEYS = {
  LIVE_CLASSES: ["live-classes"],
  BY_COMMUNITY: (communityId: string) => ["live-classes", "community", communityId],
} as const;

export const useLiveClassesByCommunity = (communityId: string | null) =>
  useQuery({
    queryKey: communityId ? QUERY_KEYS.BY_COMMUNITY(communityId) : ["live-classes", "community", null],
    queryFn: () => LiveClassClient.getByCommunityId(communityId as string),
    enabled: !!communityId,
  });

export const useCreateLiveClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLiveClassRequest) => LiveClassClient.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIVE_CLASSES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BY_COMMUNITY(variables.communityId) });
    },
  });
};

export const useUpdateLiveClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLiveClassRequest }) =>
      LiveClassClient.update(id, data),
    onSuccess: (liveClass) => {
      queryClient.setQueryData(["live-class", liveClass.id], liveClass);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIVE_CLASSES });
      queryClient.invalidateQueries({ queryKey: ["live-classes", "community"] });
    },
  });
};

export const useDeleteLiveClass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => LiveClassClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIVE_CLASSES });
    },
  });
};

export const LiveClassService = {
  useLiveClassesByCommunity,
  useCreateLiveClass,
  useUpdateLiveClass,
  useDeleteLiveClass,
};