"use server"
import { getServerSession } from "next-auth";
import db from "@/src/lib/prisma";
import { authOptions } from '../app/api/auth/[...nextauth]/options';
import {GoogleGenerativeAI} from "@google/generative-ai"
import { AIIndustryInsights } from "../types";

//explicitly validating the api key
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const genAI= new GoogleGenerativeAI(apiKey);
const model=genAI.getGenerativeModel({
 model: "gemini-2.5-flash"
})



export const generateAIInsights= async( industry:string ) : Promise<AIIndustryInsights>=>{
    const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "HIGH" | "MEDIUM" | "LOW",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "POSITIVE" | "NEGATIVE" | "NEUTRAL",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  const result = await model.generateContent(prompt); // giving prompt to the model
  const response = result.response;
  const text = response.text(); //fetching the text from the response
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim(); //cleaning the text

 
  let parsed: AIIndustryInsights;

  try {
    parsed = JSON.parse(cleanedText);
  } catch {
    throw new Error("Invalid JSON returned from Gemini");
  }

  return parsed;
   
}

export async function getIndustryInshights(){
    const session = await getServerSession(authOptions);

       if (!session?.user?._id) {
         throw new Error("Unauthorized");
       
        }

 //mongodb user id from the session
  const authUserId = session.user._id;

  //look for this user id in the neon db
  const user=await db.user.findUnique({
    where:{
        authUserId 
    } ,
    include :{
        industryInsight:true
    }
  });

   if(!user) throw new Error("User not found in neon db");
   

   if(!user.industryInsight){
    //we will generate them using AI
    const insights = await generateAIInsights("tech");

    const industryInsight = await db.industryInsight.upsert({
    where: { industry: "tech" },
        update: {
    ...insights,
  },
  create: {
    industry: "tech",
    ...insights,
    nextUpdate:new Date(Date.now() +7*24*60*60*1000),
  },
});
   

    return industryInsight;
   }
   return user.industryInsight; //if we already had the industry insight

}