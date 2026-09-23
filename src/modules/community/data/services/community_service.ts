import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  AddCommunityMembersRequest,
  Community,
  CommunityMember,
  CommunityMemberWithCommunity,
  CreateCommunityRequest,
} from "../../main/types/community.types";
import { CommunityClient } from "../client/community_client";

const QUERY_KEYS = {
  COMMUNITIES: ["communities"],
  COMMUNITY: (id: string) => ["community", id],
  MEMBERS: (memberType: string) => ["community-members", memberType],
  COMMUNITY_MEMBERS: (id: string) => ["community-members", "community", id],
} as const;

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommunityRequest) =>
      CommunityClient.createCommunity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMUNITIES });
    },
  });
};

export const useUpdateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CreateCommunityRequest;
    }) => CommunityClient.updateCommunity(id, data),
    onSuccess: (community) => {
      queryClient.setQueryData(QUERY_KEYS.COMMUNITY(community.id), community);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMUNITIES });
    },
  });
};

export const useDeleteCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CommunityClient.deleteCommunity(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.COMMUNITY(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMMUNITIES });
    },
  });
};

export const useAddCommunityMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddCommunityMembersRequest) =>
      CommunityClient.addMembers(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMMUNITY(variables.communityId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MEMBERS(variables.communityRole),
      });
    },
  });
};

export const useCommunities = () => {
  return useQuery({
    queryKey: QUERY_KEYS.COMMUNITIES,
    queryFn: () => CommunityClient.getCommunities(),
  });
};

export const useMembersByType = (memberType: string | null) => {
  return useQuery<CommunityMember[]>({
    queryKey: memberType
      ? QUERY_KEYS.MEMBERS(memberType)
      : ["community-members", null],
    queryFn: () =>
      CommunityClient.getMembersByType(memberType?.toLowerCase() as string),
    enabled: memberType !== null,
  });
};

export const useMembersByCommunity = (communityId: string | null) => {
  return useQuery<CommunityMemberWithCommunity[]>({
    queryKey: communityId
      ? QUERY_KEYS.COMMUNITY_MEMBERS(communityId)
      : ["community-members", "community", null],
    queryFn: () => CommunityClient.getMembersByCommunity(communityId as string),
    enabled: !!communityId,
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      communityId,
      memberId,
    }: {
      communityId: string;
      memberId: string;
    }) => CommunityClient.deleteMember(memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMMUNITY_MEMBERS(variables.communityId),
      });
    },
  });
};

export const useFilteredMembers = (
  memberType: string | null,
  searchQuery: string,
) => {
  const {
    data = [],
    isLoading,
    isError,
    error,
    ...rest
  } = useMembersByType(memberType);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredMembers = useMemo<CommunityMember[]>(() => {
    const filtered = normalizedQuery
      ? data.filter((member) =>
          `${member.firstName} ${member.lastName} ${member.email}`
            .toLowerCase()
            .includes(normalizedQuery),
        )
      : [...data];

    return filtered.sort((a, b) =>
      `${a.firstName} ${a.lastName}`.localeCompare(
        `${b.firstName} ${b.lastName}`,
        undefined,
        { sensitivity: "base" },
      ),
    );
  }, [data, normalizedQuery]);

  return { ...rest, data: filteredMembers, isLoading, isError, error };
};

export const useCommunity = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.COMMUNITY(id),
    queryFn: () => CommunityClient.getCommunity(id),
    enabled: !!id,
  });
};

export const useFilteredCommunities = (
  searchQuery: string,
  sortDirection: "asc" | "desc" = "asc",
) => {
  const { data = [], isLoading, isError, error, ...rest } = useCommunities();

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCommunities = useMemo<Community[]>(() => {
    const filtered = normalizedQuery
      ? data.filter((community) =>
          community.name.toLowerCase().includes(normalizedQuery),
        )
      : [...data];

    return [...filtered].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
      });

      return sortDirection === "asc" ? comparison : comparison * -1;
    });
  }, [data, normalizedQuery, sortDirection]);

  return {
    ...rest,
    data: filteredCommunities,
    isLoading,
    isError,
    error,
  };
};

export const CommunityService = {
  useCreateCommunity,
  useUpdateCommunity,
  useDeleteCommunity,
  useAddCommunityMembers,
  useCommunities,
  useMembersByType,
  useMembersByCommunity,
  useDeleteMember,
  useFilteredMembers,
  useCommunity,
  useFilteredCommunities,
};
