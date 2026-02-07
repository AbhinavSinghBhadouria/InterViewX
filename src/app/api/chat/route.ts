import OpenAI from "openai";

export const runtime="edge";

export async function POST(req:Request){
    const {messages} = await req.json();
    
// Remove id before sending to Groq
const cleanMessages = messages.map((m: any) => ({
  role: m.role,
  content: m.content,
}));

console.log("RAW MESSAGES:", messages);


     const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY!,
    baseURL: "https://api.groq.com/openai/v1",
  });

    const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
  
       messages: cleanMessages,
    
    stream: true,
  });
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      for await (const chunk of completion) {
        const token = chunk.choices[0]?.delta?.content || "";
        controller.enqueue(encoder.encode(token));
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain" },
  });
}