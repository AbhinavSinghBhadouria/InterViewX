"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/options";
import db from "../lib/prisma";
import { revalidatePath } from "next/cache";
import Groq from "groq-sdk";



const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});


//function for creating and saving resume
export async function saveResume(content:any){
    //check if the user is logged in or not
    const session = await getServerSession(authOptions);
    
      if (!session?.user?._id) {
        throw new Error("Unauthorized");
      }
    
      const authUserId = session.user._id;
    
      const user = await db.user.findUnique({
        where: {authUserId },
      });
    
      if (!user) {
        throw new Error("User not found in neon db");
      }
    

      try{
        const resume=await db.resume.upsert({
             where: {
              userId: user.id,
      },
        update: {
           content ,
             },
         create: {
                userId:user.id ,
                content ,
                 },
        });

         revalidatePath("/tools/resume"); //it tells nextjs to refetch and re render data for this route
        return resume;
      }catch(error){
            console.log("Error saving resume" , error);
            throw new Error("Error generating resume")
      }

}

//function for getting the resume

export async function getResume(){
    //checking the user is logged in or not

      const session = await getServerSession(authOptions);
    
      if (!session?.user?._id) {
        throw new Error("Unauthorized");
      }
    
      const authUserId = session.user._id;
    
      const user = await db.user.findUnique({
        where: {authUserId },
      });
    
      if (!user) {
        throw new Error("User not found in neon db");
      }
      return await db.resume.findUnique({
    where: {
      userId: user.id,
    },
  });


}

export async function improveWithAI({current , type}:any){
   //check if the user is logged in or not
    const session = await getServerSession(authOptions);
    
      if (!session?.user?._id) {
        throw new Error("Unauthorized");
      }
    
      const authUserId = session.user._id;
    
      const user = await db.user.findUnique({
        where: {authUserId },
      });
    
      if (!user) {
        throw new Error("User not found in neon db");
      }

       const prompt = `
You are an expert resume writer.

Improve the following ${type} description for a ${user.industry} professional.

Current content:
"${current}"

Requirements:
- Use strong action verbs
- Include measurable impact where possible
- Highlight relevant technical skills
- Keep it concise but impactful
- Focus on achievements, not responsibilities
- Use ${user.industry}-specific keywords

Return ONLY a single improved paragraph.
No explanations.
No bullet points.
No extra text.
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You improve resume content." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const improvedContent =
      response.choices[0]?.message?.content?.trim();

    if (!improvedContent) {
      throw new Error("Empty response from Groq");
    }

    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
    
}