"use server"
import { getServerSession } from "next-auth";
import db from "@/src/lib/prisma";
import { authOptions } from '../app/api/auth/[...nextauth]/options';
import {GoogleGenerativeAI} from "@google/generative-ai"
import { AIIndustryInsights } from "../types";
import { cacheKeys } from "@/src/lib/redis/keys";
import { TTL } from "@/src/lib/redis/ttl";
import { getJSON, setJSON } from "@/src/lib/redis/cache";

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

function getInsightsTtlSeconds(nextUpdate: Date | string | null | undefined): number {
  if (!nextUpdate) {
    return TTL.INSIGHTS_MAX_SECONDS;
  }

  const target = new Date(nextUpdate).getTime();
  const now = Date.now();
  const deltaSeconds = Math.floor((target - now) / 1000);

  if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) {
    return 60;
  }

  return Math.min(deltaSeconds, TTL.INSIGHTS_MAX_SECONDS);
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
      }
    });

   if(!user) throw new Error("User not found in neon db");

    const industry = (user.industry || "tech").toLowerCase();
    const key = cacheKeys.industryInsights(industry);

    //checking redis for data first
    const cached = await getJSON<any>(key);
    if (cached) {
      console.log("getIndustryInshights source:", "cache");
      return cached;
    }

    const existingInsight = await db.industryInsight.findUnique({
      where: { industry },
    });

    if (existingInsight && new Date(existingInsight.nextUpdate).getTime() > Date.now()) {
      //if the time is valid the store the data in redis and return the data
      await setJSON(key, existingInsight, getInsightsTtlSeconds(existingInsight.nextUpdate));
      console.log("getIndustryInshights source:", "origin-db");
      return existingInsight;
    }

    // if missing or stale insights then regenerate and persist.
    const insights = await generateAIInsights(industry);
    const nextUpdate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const now = new Date();

    const refreshedInsight = await db.industryInsight.upsert({
      where: { industry },
      update: {
        ...insights,
        lastUpdated: now,
        nextUpdate,
      },
      create: {
        industry,
        ...insights,
        lastUpdated: now,
        nextUpdate,
      },
    });

    await setJSON(key, refreshedInsight, getInsightsTtlSeconds(refreshedInsight.nextUpdate));
    console.log("getIndustryInshights source:", "origin-ai");
    return refreshedInsight;

}