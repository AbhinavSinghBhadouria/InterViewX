import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { NextResponse } from 'next/server';
import db from '@/src/lib/prisma';
import { getActiveChatMessages } from '@/src/lib/redis/chat-session';

export async function GET(req:Request){

  const session = await getServerSession(authOptions);
  if (!session?.user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

   const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");
  if (!chatId) {
    return NextResponse.json({ error: "chatId is required" }, { status: 400 });
  }

  //finding the user by chatid from postgres
  const dbUser = await db.user.findUnique({
    where: { authUserId: session.user._id },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  
  const chat = await db.chat.findUnique({ where: { id: chatId } });

   if (!chat || chat.userId !== dbUser.id) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  const messages = await getActiveChatMessages(chatId);
  return NextResponse.json({ messages });

  }


