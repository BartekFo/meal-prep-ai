import type { ChatModel } from "./models";

interface Entitlements {
  maxMessagesPerDay: number;
  availableChatModelIds: Array<ChatModel["id"]>;
}

export const entitlementsByUserType = {
  regular: {
    maxMessagesPerDay: 100,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },
} as const;
