"use client";

import { useChat } from "@ai-sdk/react";
import { Messages } from "./messages";

interface ChatProps {
  id: string;
}

export function Chat({ id }: ChatProps) {
  const { messages, setMessages, status, reload } = useChat({
    id,
  });

  return (
    <div className="flex min-w-0 flex-col bg-background">
      <Messages
        chatId={id}
        status={status}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
      />
      chat
    </div>
  );
}
