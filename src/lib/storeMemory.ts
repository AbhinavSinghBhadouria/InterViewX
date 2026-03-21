import { index } from "./pinecone"

export async function storeMemory(
  userId: string,
  chatId: string,
  message: string,
  role: "user" | "assistant"
) {
  const text = message?.trim();
  if (!userId || !chatId || !text) {
    return;
  }
  const createdAt = Date.now();

  await index.namespace(userId).upsertRecords({
    records: [
      {
        id: crypto.randomUUID(),
        userId,
        chatId,
        role,
        createdAt,
        text,
      },
    ],
  })
}

//here we are sending the data to the pinecone