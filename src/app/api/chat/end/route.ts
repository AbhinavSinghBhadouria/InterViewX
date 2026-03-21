import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import db from "@/src/lib/prisma";
import { groq } from "@/src/lib/groq";
import {
  getActiveChatMessages,
  markChatSessionFinalized,
  clearChatSessionCache,
} from "@/src/lib/redis/chat-session";

type IncomingMessage = {
  role?: string;
  content?: string;
};

async function generateTitleFromTranscript(transcriptLines: string[]) {
  if (!transcriptLines.length) return "AI Career Chat";

  const transcript = transcriptLines.join("\n").slice(0, 8000);

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.2,
    max_completion_tokens: 24,
    messages: [
      {
        role: "system",
        content:
          "Generate a concise career-chat title (max 8 words). Return title only, no quotes, no punctuation at ends.",
      },
      {
        role: "user",
        content: `Transcript:\n${transcript}`,
      },
    ],
  });

  const rawTitle = response.choices[0]?.message?.content?.trim();
  if (!rawTitle) return "AI Career Chat";

  return rawTitle.replace(/^['"\s]+|['"\s]+$/g, "").slice(0, 80) || "AI Career Chat";
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const chatId = body?.chatId as string | undefined;
    const clientMessages = Array.isArray(body?.messages) ? (body.messages as IncomingMessage[]) : [];

    if (!chatId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const dbUser = await db.user.findUnique({
      where: { authUserId: session.user._id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const chat = await db.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat || chat.userId !== dbUser.id) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    if (chat.isEnded) {
      // Idempotent end operation: if already ended, treat as success.
      return NextResponse.json({ success: true, alreadyEnded: true }, { status: 200 });
    }

   
    const redisMessages = await getActiveChatMessages(chatId);
    const sourceMessages =
      redisMessages.length > 0
        ? redisMessages
        : clientMessages.map((m) => ({
            id: crypto.randomUUID(),
            chatId,
            role: (m.role as "user" | "assistant" | "system") || "user",
            content: m.content || "",
            createdAt: new Date().toISOString(),
          }));

    // keep only valid db roles and non-empty content.
    const normalized = sourceMessages
      .filter((m) => (m.role === "user" || m.role === "assistant") && m.content?.trim().length > 0)
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content.trim(),
      }));

    // if no messages, just mark chat ended and cleanup redis.
    if (normalized.length === 0) {
      await db.chat.update({
        where: { id: chatId },
        data: {
          title: "AI Career Chat",
          isEnded: true,
        },
      });

      await markChatSessionFinalized(chatId);
      await clearChatSessionCache(chatId);

      return NextResponse.json({ success: true });
    }

    // build transcript directly from Redis transcript for title generation.
    const transcriptLines = normalized.map((m) => `${m.role}: ${m.content}`);

    let title = "AI Career Chat";
    try {
      title = await generateTitleFromTranscript(transcriptLines);
    } catch (error) {
      console.error("TITLE GENERATION ERROR:", error);
      const firstUserMessage = normalized.find((m) => m.role === "user")?.content;
      title = firstUserMessage?.slice(0, 50) || "AI Career Chat";
    }

    // persist transcript + end chat atomically.
    await db.$transaction([
        //storing all the messages
      db.message.createMany({
        data: normalized.map((m) => ({
          chatId,
          role: m.role,
          content: m.content,
        })),
      }),
      //storing the chat
      db.chat.update({
        where: { id: chatId },
        data: {
          title,
          isEnded: true,
        },
      }),
    ]);

    //cleaning up redis after successful db write
    try {
      await markChatSessionFinalized(chatId);
      await clearChatSessionCache(chatId);
    } catch (error) {
      console.error("Redis cleanup after chat-end failed:", error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CHAT END ERROR:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
