import * as v from "valibot";

const textPartSchema = v.object({
  text: v.pipe(v.string(), v.minLength(1), v.maxLength(2000)),
  type: v.picklist(["text"]),
});

export const postRequestBodySchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  message: v.object({
    id: v.pipe(v.string(), v.uuid()),
    createdAt: v.pipe(
      v.string(),
      v.transform((value) => new Date(value)),
    ),
    role: v.picklist(["user"]),
    content: v.pipe(v.string(), v.minLength(1), v.maxLength(2000)),
    parts: v.array(textPartSchema),
  }),
  selectedChatModel: v.picklist(["chat-model", "chat-model-reasoning"]),
});

export type PostRequestBody = v.InferOutput<typeof postRequestBodySchema>;
