import { getServerSession } from "next-auth";

 import db from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import { authOptions } from '../../../../api/auth/[...nextauth]/options';
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NextResponse } from "next/server";
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{
    chatId: string;
  }>;
};


export default async function ChatHistoryDetail({ params }: Props) {
  const session = await getServerSession(authOptions);
  const { chatId } = await params;

  if (!chatId) {
    return NextResponse.json(
        {
            message:"Chat not found"   ,
            status:404
        }
    )
  }



  if (!session?.user?._id) {
 return NextResponse.json(
        {
            message:"user not found in mongodb"   ,
            status:404
        }
    )
  }
   
  //finding the user in prisma db
  const user = await db.user.findUnique({
    where: { authUserId: session.user._id },
  });

  if (!user) {
     return NextResponse.json(
        {
            message:"user not found in prismdb"   ,
            status:404
        }
    )
  }

  
  

  const chat = await db.chat.findUnique({
    where: { id: chatId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },  //bringing messages by ascending order
      },
    },   
  });


console.log("CHAT:", chat?.id, chat?.userId);
  if (!chat || chat.userId !== user.id) {
    return NextResponse.json(
        {
            message:"chat not found"   ,
            status:404
        }
    )
  }

  return (
    <div className="p-6 mx-auto">

        <Link href={"/ai-chat/history"}>
                            <Button variant="link" className="gap-2  pl-0">
                              <ArrowLeft className="h-4 w-4"/>
                              Back to Chat History
                              </Button>
                              </Link>

      <h1 className="text-3xl font-bold mb-1 text-center">
        {chat.title ?? "AI Career Chat"}
      </h1>
      <p className="text-sm text-center text-yellow-400! mb-6">
        {new Date(chat.createdAt).toLocaleString()}
      </p>

      <div className="space-y-3 m-4">
        {chat.messages.map(msg => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-blue-900 text-white ml-auto"
                : "bg-green-800 text-white"
            } max-w-[70%]`}
          >
            <Markdown remarkPlugins={[remarkGfm]}>
  {msg.content}
</Markdown>
          </div>
        ))}
      </div>
    </div>
  );
}
