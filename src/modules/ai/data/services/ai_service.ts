"use client";

import { useMutation } from "@tanstack/react-query";
import { AiClient } from "../client/ai_client";
import { ChatRequest } from "../../main/types/ai.types";

export const AiService = {
  useIngest() {
    return useMutation({
      mutationFn: () => AiClient.ingest(),
    });
  },

  useChat() {
    return useMutation({
      mutationFn: (data: ChatRequest) => AiClient.chat(data),
    });
  },
};
