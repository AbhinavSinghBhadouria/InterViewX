"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

export default function LastChat({ chat }: any) {
  const router=useRouter();

  if (!chat) return (
     <Card
      className="bg-black
      border border-blue-500/30
      shadow-[0_0_10px_rgba(0,140,255,0.35)]
      rounded-xl"
    >
      <CardHeader>
        <CardTitle className="text-yellow-300 text-2xl">
          Recent Chat
        </CardTitle>

        <CardDescription className="text-slate-300">
          You have no chats with AI Career Coach yet. Start a conversation and get personalized guidance
          for your next career move.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button className="w-full sm:w-auto cursor-pointer" onClick={()=>router.push("/tools/ai-chat-dashboard")}>AI Career Coach</Button>
      </CardContent>
    
    </Card>
  )

  const messageCount = Array.isArray(chat.messages) ? chat.messages.length : 0

  return (


    
    <Card
      className="bg-black
      border border-blue-500/30
      shadow-[0_0_10px_rgba(0,140,255,0.35)]
      rounded-xl"
    >
      <CardHeader>
        <CardTitle className="text-yellow-300 text-2xl">
          Recent Chat
        </CardTitle>
    
        <CardDescription>
          {chat.title} <br/>
          Messages: {messageCount}
        </CardDescription>
      </CardHeader>
    
      <CardContent>
    
        {chat.updatedAt ? new Date(chat.updatedAt).toLocaleString() : ""}
    

      </CardContent>
    </Card>

  )
}