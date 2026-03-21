import { index } from "./pinecone"

export async function retrieveMemories(userId: string, query: string) {
  if (!userId || !query?.trim()) return [];

  const results = await index.namespace(userId).searchRecords({
    query: {
      topK: 12,
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