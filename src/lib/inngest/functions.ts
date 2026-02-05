

import { inngest } from "./client";
import db from "../prisma";
import OpenAI from "openai";

export const runtime = "nodejs";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Function for getting the industry anayltics weekly updates from the inggest

export const generateIndustryInsights = inngest.createFunction(
  { id: "generate-industry-insights", name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" },


  async ({ step  ,event}) => {
    const industry = "tech";

    const prompt = `
Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
{
  "salaryRanges": [
    { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
  ],
  "growthRate": number,
  "demandLevel": "HIGH" | "MEDIUM" | "LOW",
  "topSkills": ["skill1", "skill2"],
  "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
  "keyTrends": ["trend1", "trend2"],
  "recommendedSkills": ["skill1", "skill2"]
}

IMPORTANT: Return ONLY JSON. No markdown. No explanation.
`;

    const text = await step.run("Generate AI Industry Insights", async () => {
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
       messages: [
 {
  role: "system",
  content: `
You are a backend JSON API.

HARD REQUIREMENTS:
- salaryRanges must contain exactly 5 entries
- topSkills must contain AT LEAST 5 entries 
- keyTrends must contain AT LEAST 5 entries
- recommendedSkills must contain AT LEAST 5 entries
- If any list is shorter, DO NOT answer — regenerate internally
- Output ONLY valid JSON
`
} ,
  { role: "user", content: prompt },
],
      });

      return completion.choices[0].message.content ?? "";
    });

    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    let insights: any;
    try {
      insights = JSON.parse(cleanedText);
    } catch {
      throw new Error("Groq returned invalid JSON");
    }




    //validating the data that is coming from the groq api..
    function validateInsights(data: any) {
  if (
    data.salaryRanges.length < 5 ||
    data.topSkills.length < 5 ||
    data.keyTrends.length < 5 ||
    data.recommendedSkills.length < 5
  ) {
    throw new Error("AI returned incomplete structured data");
  }
}

validateInsights(insights); 




// inserting the data coming from the inngest in the database

    await step.run(`Update ${industry} insights`, async () => {
      await db.industryInsight.upsert({
        where: { industry },
        update: {
          ...insights,
          lastUpdated: new Date(),
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),   //the data will get updated after every 7 days
        },
        create: {
          industry,
          ...insights,
          lastUpdated: new Date(),
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    });

    return { ok: true };
  }
);


//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
