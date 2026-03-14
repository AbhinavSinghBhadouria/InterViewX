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

  const redisMessages = await getActiveChatMessages(chatId);
  if (redisMessages.length > 0) {
    return NextResponse.json({ messages: redisMessages, source: "redis" });
  }

  // fallback for ended chats or Redis misses: hydrate from Postgres history.
  const dbMessages = await db.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      content: true,
      role: true,
      createdAt: true,
    },
  });

  const messages = dbMessages.map((m) => ({
    id: m.id,
    chatId,
    role: m.role,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
  }));

  return NextResponse.json({ messages, source: "postgres" });

  }


