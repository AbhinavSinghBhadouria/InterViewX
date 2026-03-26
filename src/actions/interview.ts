
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/options";
import db from "../lib/prisma";
import Groq from "groq-sdk";
import { cacheKeys } from "@/src/lib/redis/keys";
import { TTL } from "@/src/lib/redis/ttl";
import { withCache, deleteKey } from "@/src/lib/redis/cache";


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});


interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
   topic: string;
}

//-------generating  quiz------------------------------------------------------------------------------------------------------------------

export async function generateQuiz(type:string  ,subject:string) {

  //getting the user id from the session of next auth
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    throw new Error("Unauthorized");
  }

  const authUserId = session.user._id;

  const user = await db.user.findUnique({
    where: { authUserId },
  });

  if (!user) {
    throw new Error("User not found in neon db");
  }


  let prompt = "";

//generating the assessment based upon the user skills
if(type === "technical"){

prompt = `
You are an expert technical interviewer.

Generate 10 technical interview questions for a ${user.industry} professional${
  user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
}.

The questions should resemble those asked in interviews by companies such as:
Amazon, Microsoft, Adobe, Atlassian, Flipkart, Uber, Goldman Sachs.

Rules:
- Focus on real interview concepts, not trivia.
- Difficulty should be medium to hard.
- Questions should test conceptual understanding.
- Each question must be multiple choice.
- Exactly 4 options.
- Exactly one correct answer.
- Include a "topic" field describing the concept being tested.

Explanation rules:
- Clearly explain WHY the correct answer is correct.
- Mention the key concept involved.
- If relevant, briefly indicate why other options are incorrect.
- Explanation must be 1–2 sentences and under 25 words.

Return ONLY valid JSON:

{
  "questions":[
    {
      "question":"string",
      "options":["string","string","string","string"],
      "correctAnswer":"string",
      "explanation":"string",
      "topic":"string"
    }
  ]
}
`;
}

else if(type === "aptitude"){

prompt = `
You are an expert campus placement test designer.

Generate 10 multiple choice aptitude questions for the subject: ${subject}.

These questions should resemble those asked in campus placement assessments
conducted by companies such as:

TCS, Infosys, Wipro, Capgemini, Cognizant, Accenture, Tech Mahindra and HCL.

Rules:
- Match the difficulty level of Indian campus placement aptitude tests.
- Focus on commonly asked placement topics.
- Each question must have exactly 4 options.
- Exactly one correct answer.
- Include a "topic" field describing the concept tested.

Explanation Rules:
- Clearly explain WHY the correct answer is correct.
- If relevant, briefly indicate why other options are incorrect.
- Explanation must be 1–2 sentences and under 25 words.

Return ONLY valid JSON in this format:

{
  "questions":[
    {
      "question":"string",
      "options":["string","string","string","string"],
      "correctAnswer":"string",
      "explanation":"string",
      "topic":"string"
    }
  ]
}
`;
}

else if(type === "core"){

prompt = `
You are a computer science interviewer.

Generate 10 multiple-choice questions for the subject: ${subject}.

The questions should resemble those asked in technical interview rounds
by companies such as Amazon, Microsoft, Adobe, Goldman Sachs and Atlassian.

Rules:
- Focus on important concepts frequently asked in interviews.
- Difficulty: medium to hard.
- Test conceptual understanding rather than memorization.
- Each question must have exactly 4 options.
- Exactly one correct answer.
- Include a "topic" field describing the concept tested.

Explanation rules:
- Explain the underlying concept clearly.
- Mention the key CS concept (e.g., deadlock, normalization, TCP handshake).
- Keep explanation under 25 words.

Return ONLY valid JSON in this format:

{
  "questions":[
    {
      "question":"string",
      "options":["string","string","string","string"],
      "correctAnswer":"string",
      "explanation":"string",
      "topic":"string"
    }
  ]
}
`;
}

  const extractJsonObject = (raw: string): string => {
    const cleaned = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("No valid JSON object found in model response");
    }

    return cleaned.slice(start, end + 1);
  };

  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [  {role: "system",content:"You are an expert technical interviewer who creates high-quality placement questions. Always return strict JSON. Explanations must clearly explain the concept."} ,
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
         max_tokens: 2000,  
        response_format: { type: "json_object" },
      });

      const text = response.choices[0]?.message?.content;
      const finishReason = response.choices[0]?.finish_reason;

      if (!text) {
        throw new Error("Empty response from Groq");
      }

     if (finishReason === "length") {
  console.log("Retrying due to truncated output...");
  continue;
}

      const jsonString = extractJsonObject(text);
      const parsed = JSON.parse(jsonString);

      if (!parsed || !Array.isArray(parsed.questions)) {
        throw new Error("Invalid quiz schema: questions array missing");
      }

      if (parsed.questions.length !== 10) {
        throw new Error(`Invalid question count: expected 10, got ${parsed.questions.length}`);
      }

      for (const q of parsed.questions) {
       if (!q?.question || !Array.isArray(q?.options) || q.options.length !== 4 || !q?.correctAnswer || !q?.topic) {
       throw new Error("Invalid question structure in model response");
           }}

      return parsed.questions;

    } catch (error) {
      if (attempt === maxAttempts) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz questions");
      }
    }
  }

  throw new Error("Failed to generate quiz questions");
}



// saving quiz result
export async function saveQuizResult(
  questions: QuizQuestion[],
  answers: string[],
  score: number,
  type: string,
  subject: string
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    throw new Error("Unauthorized");
  }

  const authUserId = session.user._id;

  const user = await db.user.findUnique({
    where: { authUserId },
  });

  if (!user) {
    throw new Error("User not found in neon db");
  }

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    topic: q.topic,
    answer: q.correctAnswer,
    userAnswer: answers[index] ?? "",
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  //extracting the weak topics
  const weakTopics = [
  ...new Set(
    questionResults
      .filter(q => !q.isCorrect)
      .map(q => q.topic)
  )
];
  const wrongAnswers = questionResults.filter(q => !q.isCorrect);


//improvement tip
  let improvementTip: string | null = null;

  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        q => `
Question: ${q.question}
Correct Answer: ${q.answer}
User Answer: ${q.userAnswer}
`
      )
      .join("\n");

    const improvementPrompt = `
The user completed an assessment on ${subject} (${type}).

Here are the questions they answered incorrectly:
${wrongQuestionsText}

Identify the knowledge gaps and suggest what they should focus on improving.

Keep the response:
- Encouraging
- Specific
- Under 2 sentences

`;

    try {
      const tipResponse = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a supportive technical mentor." },
          { role: "user", content: improvementPrompt },
        ],
        temperature: 0.6,
      });

      improvementTip =
        tipResponse.choices[0]?.message?.content?.trim() ?? null;

        console.log(improvementTip)
    } catch (error) {
      console.error("Error generating improvement tip:", error);
    }
  }

//saving assessments to the db
  try {
    const assessment = await db.assessment.create({
      data: {
     userId: user.id,
    type,
    subject,
    quizScore: score,
    totalQuestions: questions.length,
    questions: questionResults,
    weakTopics,
    improvementTip,
      },
    });


     //invalidating the cached data
    const key = cacheKeys.assessmentsByUser(user.id);
    await deleteKey(key);


    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}


//-------------------------displaying Interview Progress-----------------

export async function getAssessments(){
  const requestStartedAtMs = Date.now();
  const requestId = crypto.randomUUID();

  //check if the user is authenticated or not

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


  //we will use cache aside pattern for getting the data
  const key = cacheKeys.assessmentsByUser(user.id);

  try{

const { data, source, metrics } = await withCache(
key,
async () => {
return db.assessment.findMany({
where: { userId: user.id },
orderBy: { createdAt: "asc" },
});
},
TTL.ASSESSMENTS_SECONDS
);

console.log("getAssessments source:", source);
const totalMs = Date.now() - requestStartedAtMs;

console.log(
  "LATENCY",
  JSON.stringify({
    action: "getAssessments",
    requestId,
    source,
    totalMs,
    redisGetMs: metrics.redisGetMs,
    producerMs: metrics.producerMs,
    redisSetMs: metrics.redisSetMs,
    cachePathMs: metrics.totalMs,
    key,
    userId: user.id,
  })
);

return data;

  }catch(error){
console.log("Error fetching assessments" ,error);
throw new Error("Failed to fetch assessments");
  }
}



export async function clearAssessments(){
   //getting the user id from the session of next auth
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    throw new Error("Unauthorized");
  }

  const authUserId = session.user._id;

  const user = await db.user.findUnique({
    where: { authUserId },
  });

  if (!user) {
    throw new Error("User not found in neon db");
  }

    try{
    await db.assessment.deleteMany({
    where: {
      userId: user.id,
    },
  });

  //invalidating the cache
  const key = cacheKeys.assessmentsByUser(user.id);
   await deleteKey(key);

    }catch(error){
    console.error("error deleting history" ,error)
}

  }


//-----------------------------------------------------------------------------------------
//function for counting number of assessments

type AssessmentTypeCounts = {
  aptitude: number;
  technical: number;
  core: number;
};

export async function countAssessments(): Promise<AssessmentTypeCounts>{


    //getting the user id from the session of next auth
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    throw new Error("Unauthorized");
  }

  const authUserId = session.user._id;

  const user = await db.user.findUnique({
    where: { authUserId },
  });

  if (!user) {
    throw new Error("User not found in neon db");
  }

  try{
const counts = await db.assessment.groupBy({
  by: ["type"],
  where: {
    userId: user.id
  },
  _count: {
    type: true
  }
});

const normalized: AssessmentTypeCounts = {
  aptitude: 0,
  technical: 0,
  core: 0,
};

for (const entry of counts) {
  const type = entry.type?.toLowerCase();
  if (type === "aptitude" || type === "technical" || type === "core") {
    normalized[type] = entry._count.type;
  }
}

return normalized;

  }catch(err){
    console.error("Error getting assessment count" , err);
    return {
      aptitude: 0,
      technical: 0,
      core: 0,
    };
  }

}