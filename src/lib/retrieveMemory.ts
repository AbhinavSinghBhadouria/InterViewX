import { index } from "./pinecone"

export async function retrieveMemories(chatId: string, query: string) {
  const results = await index.namespace(chatId).searchRecords({
    query: {
      topK: 5,
      inputs: {
        text: query,
      },
    },
    fields: ["text"],
  })

  return results.result.hits
    .map((hit) => (hit.fields as { text?: string }).text)
    .filter((text): text is string => typeof text === "string")
}


//retrieving the top chunks matching with the query