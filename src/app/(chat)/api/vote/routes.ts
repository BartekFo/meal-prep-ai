import { MealPrepingAIError } from "@/lib/error";
import {
  getChatById,
  getVotesByChatId,
  voteMessage,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new MealPrepingAIError(
      "bad_request:api",
      "Parameter chatId is required.",
    ).toResponse();
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new MealPrepingAIError("unauthorized:vote").toResponse();
  }

  const [chat] = await getChatById({ id: chatId });

  if (!chat) {
    return new MealPrepingAIError("not_found:chat").toResponse();
  }

  if (chat.userId !== user.id) {
    return new MealPrepingAIError("forbidden:vote").toResponse();
  }

  const votes = await getVotesByChatId({ id: chatId });

  return Response.json(votes, { status: 200 });
}

export async function PATCH(request: Request) {
  const {
    chatId,
    messageId,
    type,
  }: { chatId: string; messageId: string; type: "up" | "down" } =
    await request.json();

  if (!chatId || !messageId || !type) {
    return new MealPrepingAIError(
      "bad_request:api",
      "Parameters chatId, messageId, and type are required.",
    ).toResponse();
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new MealPrepingAIError("unauthorized:vote").toResponse();
  }

  const [chat] = await getChatById({ id: chatId });

  if (!chat) {
    return new MealPrepingAIError("not_found:vote").toResponse();
  }

  if (chat.userId !== user.id) {
    return new MealPrepingAIError("forbidden:vote").toResponse();
  }

  await voteMessage({
    chatId,
    messageId,
    type: type,
  });

  return new Response("Message voted", { status: 200 });
}
