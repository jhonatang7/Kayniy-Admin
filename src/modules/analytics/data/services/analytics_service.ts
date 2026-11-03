"use client";

import { useQuery } from "@tanstack/react-query";
import { AnalyticsClient } from "../client/analytics_client";
import { AnalyticsQuery } from "../../main/types/analytics.types";

const ADMIN_ANALYTICS_KEYS = {
  courses: ["analytics", "admin", "courses"] as const,
  communities: ["analytics", "admin", "communities"] as const,
  funnel: (query: AnalyticsQuery) => ["analytics", "admin", "funnel", query],
  cohorts: (query: AnalyticsQuery) => ["analytics", "admin", "cohorts", query],
  treemap: (query: AnalyticsQuery) => ["analytics", "admin", "treemap", query],
} as const;

const professorKey = (name: string, communityId: string, query?: AnalyticsQuery) =>
  ["analytics", "professor", communityId, name, query] as const;

export const useAdminCourses = (enabled = true) =>
  useQuery({
    queryKey: ADMIN_ANALYTICS_KEYS.courses,
    queryFn: () => AnalyticsClient.getAdminCourses(),
    enabled,
  });

export const useAdminCommunities = (enabled = true) =>
  useQuery({
    queryKey: ADMIN_ANALYTICS_KEYS.communities,
    queryFn: () => AnalyticsClient.getAdminCommunities(),
    enabled,
  });

export const useAdminFunnel = (query: AnalyticsQuery) =>
  useQuery({
    queryKey: ADMIN_ANALYTICS_KEYS.funnel(query),
    queryFn: () => AnalyticsClient.getAdminFunnel(query),
  });

export const useAdminCohorts = (query: AnalyticsQuery) =>
  useQuery({
    queryKey: ADMIN_ANALYTICS_KEYS.cohorts(query),
    queryFn: () => AnalyticsClient.getAdminCohorts(query),
  });

export const useAdminTreemap = (query: AnalyticsQuery) =>
  useQuery({
    queryKey: ADMIN_ANALYTICS_KEYS.treemap(query),
    queryFn: () => AnalyticsClient.getAdminTreemap(query),
  });

export const useProfessorCourses = (communityId: string | null, enabled = true) =>
  useQuery({
    queryKey: professorKey("courses", communityId ?? ""),
    queryFn: () => AnalyticsClient.getProfessorCourses(communityId as string),
    enabled: enabled && !!communityId,
  });

export const useProfessorBottlenecks = (
  communityId: string | null,
  query: AnalyticsQuery,
  enabled = true,
) =>
  useQuery({
    queryKey: professorKey("bottlenecks", communityId ?? "", query),
    queryFn: () => AnalyticsClient.getProfessorBottlenecks(communityId as string, query),
    enabled: enabled && !!communityId,
  });

export const useProfessorStudentRisk = (
  communityId: string | null,
  query: AnalyticsQuery,
  enabled = true,
) =>
  useQuery({
    queryKey: professorKey("student-risk", communityId ?? "", query),
    queryFn: () => AnalyticsClient.getProfessorStudentRisk(communityId as string, query),
    enabled: enabled && !!communityId,
  });

export const useProfessorActivity = (
  communityId: string | null,
  query: AnalyticsQuery,
  enabled = true,
) =>
  useQuery({
    queryKey: professorKey("activity", communityId ?? "", query),
    queryFn: () => AnalyticsClient.getProfessorActivity(communityId as string, query),
    enabled: enabled && !!communityId,
  });

export const AnalyticsService = {
  useAdminCourses,
  useAdminCommunities,
  useAdminFunnel,
  useAdminCohorts,
  useAdminTreemap,
  useProfessorCourses,
  useProfessorBottlenecks,
  useProfessorStudentRisk,
  useProfessorActivity,
};
