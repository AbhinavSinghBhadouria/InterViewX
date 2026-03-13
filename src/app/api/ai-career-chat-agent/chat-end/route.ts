import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import db from "@/src/lib/prisma";
import { groq } from "@/src/lib/groq";
import { retrieveTranscriptFromVectorDb } from "@/src/lib/retrieveTranscript";

async function generateTitleFromTranscript(transcriptLines: string[]) {
  if (!transcriptLines.length) {
    return "AI Career Chat";
  }

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
  if (!rawTitle) {
    return "AI Career Chat";
  }

  return rawTitle.replace(/^['"\s]+|['"\s]+$/g, "").slice(0, 80) || "AI Career Chat";
}

export async function POST(req: Request) {   //api called when the user ends the chat
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }


    const { chatId, messages } = await req.json();

    //do not store anything in the db if the chat didnt happen
    if(!messages.length){ 
      return NextResponse.json({success:true});
    }

    if (!chatId || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

   //finding the prisma is of the user with the help of authid
    const dbUser = await db.user.findUnique({
      where: {
        authUserId: session.user._id,
      },
    });

    if (!dbUser) {  //user not found in prisma
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }


    //get the chat using chat id
    const chat = await db.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat || chat.userId !== dbUser.id) {
      return NextResponse.json(
        { error: "Chat not found" },
        { status: 404 }
      );
    }

    if (chat.isEnded) {
      return NextResponse.json(
        { error: "Chat already ended" },
        { status: 400 }
      );
    }

    // save all the messages in the database 
    await db.message.createMany({
      data: messages.map((m: any) => ({
        chatId,
        role: m.role,
        content: m.content,
      })),
    });

    // generate title from full transcript stored in vector DB
    let title = "AI Career Chat";
    try {
      const transcriptLines = await retrieveTranscriptFromVectorDb(chatId);
      if (transcriptLines.length > 0) {
        title = await generateTitleFromTranscript(transcriptLines);
      }
    } catch (error) {
      console.error("TITLE GENERATION ERROR:", error);
      const firstUserMessage = messages.find((m: any) => m.role === "user")?.content;
      title = firstUserMessage?.slice(0, 50) || "AI Career Chat";
    }

    // ending the chat
    await db.chat.update({
      where: { id: chatId },
      data: {
        title,
        isEnded: true,
      },
    });

    return NextResponse.json({ success: true });

  } catch (err) {

    console.error("CHAT END ERROR:", err);
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );

  }
}
