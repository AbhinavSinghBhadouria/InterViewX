import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import db from "@/src/lib/prisma";

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

    // generating the title for the chat
    const firstUserMessage = messages.find(
      (m: any) => m.role === "user"
    )?.content;

    const title =
      firstUserMessage?.slice(0, 50) || "AI Career Chat";

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
