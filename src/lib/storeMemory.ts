import { index } from "./pinecone"

export async function storeMemory(
  chatId: string,
  message: string,
  role: "user" | "assistant"
) {
  const text = message?.trim();
  if (!chatId || !text) {
    return;
  }
  const createdAt = Date.now();

  await index.namespace(chatId).upsertRecords({
    records: [
      {
        id: crypto.randomUUID(),
        chatId,
        role,
        createdAt,
        text,
      },
    ],
  })
}

//here we are sending the data to the pinecone