import { inngest } from "./client";
import db from "../prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateIndustryInsights = inngest.createFunction(
  { id: "generate-industry-insights", name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, // Every Sunday 12:00 AM
  async ({ step }) => {
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

IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
Include at least 5 common roles for salary ranges.
Growth rate should be a percentage.
Include at least 5 skills and trends.
`;

    const res = await step.ai.wrap(
      "gemini",
      async (p) => {
        return await model.generateContent(p);
      },
      prompt
    );


    const text =
      (res?.response?.candidates?.[0]?.content?.parts?.[0] as any)?.text?.toString() ||
      "";

    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    let insights: any;
    try {
      insights = JSON.parse(cleanedText);
    } catch (e) {
      throw new Error("Gemini returned invalid JSON");
    }

    await step.run(`Update ${industry} insights`, async () => {
      await db.industryInsight.upsert({
        where: { industry },
        update: {
          ...insights,
          lastUpdated: new Date(),
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        create: {
          industry,
          ...insights,
          lastUpdated: new Date(),
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //one week
        },
      });
    });

    return { ok: true };
  }
);
