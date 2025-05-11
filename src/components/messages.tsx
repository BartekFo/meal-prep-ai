import { useMessages } from "@/hooks/use-messages";
import type { UseChatHelpers } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import equal from "fast-deep-equal";
import { memo } from "react";
import { Greeting } from "./greeting";

interface MessagesProps {
  chatId: string;
  status: UseChatHelpers["status"];
  messages: Array<UIMessage>;
  setMessages: UseChatHelpers["setMessages"];
  reload: UseChatHelpers["reload"];
}

function PureMessages({ chatId, status, messages }: MessagesProps) {
  const {
    containerRef: messagesContainerRef,
    endRef: messagesEndRef,
    onViewportEnter,
    onViewportLeave,
    hasSentMessage,
  } = useMessages({
    chatId,
    status,
  });
  return (
    <div
      ref={messagesContainerRef}
      className="relative flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-4"
    >
      {messages.length === 0 && <Greeting />}
      messages
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.status && nextProps.status) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;

  return true;
});
