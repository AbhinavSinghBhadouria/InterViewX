"use client"
import  { useState ,useEffect , useRef } from 'react'
import {  Send ,ArrowLeft, Power} from "lucide-react"
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import EmptyState from '@/src/components/EmptyState'
import  { useRouter } from 'next/navigation'
import Markdown from 'react-markdown'
import remarkGfm from "remark-gfm";
import { toast } from 'sonner'
import { useParams } from 'next/navigation'





type messages={
  id:string
  content:string ,
  role:"user" | "assistant"  ,
 
}



const Page = () => {

  const router=useRouter();
  const { chatId } = useParams<{ chatId: string }>(); //getting the chat id from the parameter
  const [userInput , setUserInput]=useState<string>("");
  const [loading , setLoading]=useState(false);
  const [messageList , setMessageList]=useState<messages[]>([]);
  const [isChatEnded, setIsChatEnded] = useState(false);
  const [endingChat, setEndingChat] = useState(false); 
  const chatContainerRef = useRef<HTMLDivElement | null>(null); //for scrolling pupose when new message arrives



 const onSend = async () => {
  if (!userInput.trim()) return;

   if (isChatEnded) {
      toast.error("Chat has already ended");
      return;
    }

  const userMsg = {
    id: crypto.randomUUID(),
    role: "user" as const,
    content: userInput,
  };
  
  

  const aiMsgId = crypto.randomUUID();  //generating the unique id for current message

  setMessageList(prev => [
    ...prev,
    userMsg,
    { id: aiMsgId, role: "assistant", content: "AI is thinking..." },
  ]);

  setUserInput("");
  setLoading(true);

  try {

   const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId ,
        message: userMsg.content, //sending the user's current query
      }),
    });

    if (!res.ok || !res.body) throw new Error("AI request failed");

    const reader = res.body.getReader();  //reading the stream of data returned by the user
    const decoder = new TextDecoder();  //since the stream data is in bytes therefore i am converting it into text

    let done = false;
    let aiText = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      const chunk = decoder.decode(value || new Uint8Array());

      // stop if server accidentally sends HTML
      if (chunk.startsWith("<!DOCTYPE")) throw new Error("Server error response");

      aiText += chunk;

      setMessageList(prev =>
        prev.map(msg =>
          msg.id === aiMsgId ? { ...msg, content: aiText } : msg
        )
      );
    }


  } catch (err) {
    console.error(err);

    // removing broken assistant placeholder
    setMessageList(prev => prev.filter(msg => msg.id !== aiMsgId));
  }

  setLoading(false);
};



  

  const handleEndChat=async()=>{
  
    try{
      if (isChatEnded || endingChat) {
        return;
      }

      if (!chatId) {
        throw new Error("Chat ID is missing");
      }

      setEndingChat(true);

      const res = await fetch("/api/ai-career-chat-agent/chat-end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, messages: messageList })
      });

      if (!res.ok) {
        throw new Error("Failed to end chat");
      }

      toast.success("Chat ended & saved successfully");
      setIsChatEnded(true);

    } catch (err) {
      console.error("Error ending chat:", err);
      toast.error(err instanceof Error ? err.message : "Failed to end chat");
    } finally {
      setEndingChat(false);
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      const el = chatContainerRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 0);
  };

useEffect(() => {
  scrollToBottom();
}, [messageList]); 

  
 


  return (
    <div>
    <div className='bg-muted/60 h-screen flex flex-col '>
  {/* Header */}

     <div className="flex items-center justify-between border-b px-4 py-3 bg-background ">
  
  {/* LEFT */}
  <div>
    <div className="flex items-center gap-3">


    <Button variant="outline" className="cursor-pointer"
    onClick={()=>{
      if(!isChatEnded){
        toast.error("Please end the chat before leaving.");
        return;
      }
       //other wise let the user go back
       router.push("/tools/ai-chat-dashboard") 
    }}
   ><ArrowLeft/></Button>
    <div>

    <h2 className="text-lg font-bold text-yellow-400">
      AI Career Coach
    </h2>
      <div className="text-green-600 font-semibold text-sm flex items-center gap-2">  
    <span className="h-2 w-2 rounded-full bg-green-500 font-bold" />
    Online
   </div>
 
  </div>
</div>
   </div>

  {/* RIGHT */}

 
  <Button variant="destructive" disabled={isChatEnded || endingChat} onClick={handleEndChat} className="cursor-pointer"><Power/> {endingChat ? "Ending.." : "End Chat"}</Button>
 

</div>


  {/* MESSAGES */}
 

  <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-3">

  {messageList.length === 0 && (
    <EmptyState selectedQuestion={(q: string) => setUserInput(q)} />
  )}

  {messageList.map((message) => (
    <div
      key={message.id}
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`px-4 py-2 rounded-lg max-w-[70%] whitespace-pre-wrap break-words ${
          message.role === "user"
            ? "bg-blue-900"
            : "bg-green-800 text-white"
        }`}
      >
        
        <Markdown remarkPlugins={[remarkGfm]}>
  {message.content}
</Markdown>
      </div>
    </div>
  ))}

 
 




</div>

   {/* INPUT */}
  <div className="border-t flex justify-between items-center gap-4 bg-background px-4 py-3">
      <Input
        placeholder="Ask anything about your career..."
        className="flex-1 rounded-lg border px-4 py-2 focus:outline-none"
        value={userInput}
        onChange={(e)=>setUserInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <Button
      onClick={onSend}
  disabled={loading || isChatEnded}
  className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-600 text-white hover:bg-blue-700 transition"
>
  <Send className="h-5 w-5" />
</Button>
   
</div>



    </div>
    </div>
  )
}

export default Page
