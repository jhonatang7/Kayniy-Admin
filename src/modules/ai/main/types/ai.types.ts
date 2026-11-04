import { QuizBottleneckAnalytics } from "@/modules/analytics/main/types/analytics.types";

export interface ChatSource {
  sourceId: string;
  distance: number;
}

export interface ChatResponse {
  answer: string;
  sources?: ChatSource[];
  metrics?: QuizBottleneckAnalytics[][];
}

export interface ChatRequest {
  communityId: string;
  message: string;
}
