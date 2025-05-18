import "server-only";

import { MealPrepingAIError } from "../error";
import type { Tables } from "./database.types";
import { createClient } from "./server";

export async function getChatById({ id }: { id: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("chat").select("*").eq("id", id);

  if (error) {
    throw new MealPrepingAIError(
      "bad_request:database",
      "Failed to get chat by id",
    );
  }

  const [chat] = data;

  return chat;
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("stream")
    .insert({ id: streamId, chatId, createdAt: new Date().toISOString() });

  if (error) {
    throw new MealPrepingAIError(
      "bad_request:database",
      "Failed to create stream id",
    );
  }
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vote")
    .select("*")
    .eq("message_id", messageId);

  if (error) {
    throw new MealPrepingAIError(
      "bad_request:database",
      "Failed to get vote by message id",
    );
  }

  if (data) {
    return await supabase
      .from("vote")
      .update({ isUpvoted: type === "up" })
      .eq("message_id", messageId)
      .eq("chat_id", chatId);
  }
  return await supabase.from("vote").insert({
    chatId,
    messageId,
    isUpvoted: type === "up",
  });
}

export async function getVotesByChatId({ id }: { id: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vote")
    .select("*")
    .eq("chat_id", id);

  if (error) {
    throw new MealPrepingAIError(
      "bad_request:database",
      "Failed to get votes by chat id",
    );
  }

  return data;
}

export async function getMessageById({ id }: { id: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("message")
    .select("*")
    .eq("id", id);

  if (error) {
    throw new MealPrepingAIError(
      "bad_request:database",
      "Failed to get message by id",
    );
  }

  return data;
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stream")
    .select("id")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new MealPrepingAIError(
      "bad_request:database",
      "Failed to get stream ids by chat id",
    );
  }

  return data.map(({ id }) => id);
}

export async function saveChat({
  id,
  userId,
  title,
}: {
  id: string;
  userId: string;
  title: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("chat").insert({
    id,
    createdAt: new Date().toISOString(),
    userId,
    title,
  });

  if (error) {
    throw new MealPrepingAIError("bad_request:database", "Failed to save chat");
  }

  return data;
}

export async function saveMessages({
  messages,
}: {
  messages: Array<Tables<"message">>;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("message").insert(messages);

  if (error) {
    throw new MealPrepingAIError(
      "bad_request:database",
      "Failed to save messages",
    );
  }

  return data;
}

export async function deleteChatById({ id }: { id: string }) {
  const supabase = await createClient();
  await supabase.from("vote").delete().eq("chat_id", id);
  await supabase.from("message").delete().eq("chat_id", id);
  await supabase.from("stream").delete().eq("chat_id", id);

  const { data, error } = await supabase
    .from("chat")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    throw new MealPrepingAIError(
      "bad_request:database",
      "Failed to delete chat by id",
    );
  }

  return data;
}

export async function getMessagesByChatId({ id }: { id: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("message")
    .select()
    .eq("chat_id", id)
    .order("created_at", { ascending: true });
  if (error) {
    throw new MealPrepingAIError(
      "bad_request:database",
      "Failed to get messages by chat id",
    );
  }
  return data;
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: { id: string; differenceInHours: number }) {
  const twentyFourHoursAgo = new Date(
    Date.now() - differenceInHours * 60 * 60 * 1000,
  ).toISOString();

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("message")
    .select(
      `
      chatId, 
      chats!inner ( 
        userId 
      )
    `,
      { count: "exact", head: false },
    )
    .eq("chats.userId", id)
    .gte("createdAt", twentyFourHoursAgo)
    .eq("role", "user");

  if (error) {
    throw new MealPrepingAIError(
      "bad_request:database",
      "Failed to get message count by user id",
    );
  }
  return count ?? 0;
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("message")
      .select("id")
      .eq("chat_id", chatId)
      .gte("created_at", timestamp.toISOString());

    if (error) {
      throw new MealPrepingAIError(
        "bad_request:database",
        "Failed to get message ids by chat id after timestamp",
      );
    }
    const messageIds = data.map((message) => message.id);

    if (messageIds.length > 0) {
      await supabase.from("vote").delete().in("message_id", messageIds);

      return await supabase.from("message").delete().in("id", messageIds);
    }
  } catch (error) {
    throw new MealPrepingAIError(
      "bad_request:database",
      "Failed to delete messages by chat id after timestamp",
    );
  }
}
