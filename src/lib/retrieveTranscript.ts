import { index } from "./pinecone"

type MemoryMetadata = {
  chatId?: string
  role?: "user" | "assistant"
  text?: string
  createdAt?: number
}

export async function retrieveTranscriptFromVectorDb(chatId: string) {
  if (!chatId) {
    return [] as string[]
  }

  const namespace = index.namespace(chatId)
  const lines: Array<{ role: "user" | "assistant"; text: string; createdAt: number }> = []

  let paginationToken: string | undefined
  let pageCount = 0

  do {
    const response = await namespace.fetchByMetadata({
      filter: { chatId: { $eq: chatId } },
      limit: 100,
      paginationToken,
    })

    const records = Object.values(response.records ?? {})
    for (const record of records) {
      const metadata = (record.metadata ?? {}) as MemoryMetadata
      const text = metadata.text?.trim()
      const role = metadata.role

      if (!text || (role !== "user" && role !== "assistant")) {
        continue
      }

      lines.push({
        role,
        text,
        createdAt: typeof metadata.createdAt === "number" ? metadata.createdAt : 0,
      })
    }

    paginationToken = response.pagination?.next
    pageCount += 1
  } while (paginationToken && pageCount < 20)

  return lines
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((line) => `${line.role}: ${line.text}`)
}
