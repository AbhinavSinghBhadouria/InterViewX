
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/options";
import db from "../lib/prisma";
import Groq from "groq-sdk";

// -------------------- groq client -------------------- 
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});


interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

//-------generating  quiz

export async function generateQuiz() {

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

  const prompt = `
You are an expert technical interviewer.

Generate 10 technical interview questions for a ${user.industry} professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.

Each question must:
- Be multiple choice
- Have exactly 4 options
- Have one correct answer
- Include a short explanation

Return ONLY valid JSON in this format (no markdown, no extra text):

{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "explanation": "string"
    }
  ]
}
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You generate interview questions." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const text = response.choices[0]?.message?.content;

    if (!text) {
      throw new Error("Empty response from Groq");
    }

    const quiz = JSON.parse(text);
    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}



// saving quiz result
export async function saveQuizResult(
  questions: QuizQuestion[],
  answers: string[],
  score: number
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
    answer: q.correctAnswer,
    userAnswer: answers[index] ?? "",
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

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
The user answered some ${user.industry} interview questions incorrectly.

Here are the details:
${wrongQuestionsText}

Based on these mistakes:
- Identify the underlying knowledge gaps
- Suggest what the user should focus on improving

Keep the response:
- Encouraging
- Specific
- Under 2 sentences
- Do NOT mention mistakes explicitly
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
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}


//-------------------------displaying Interview Progress-----------------

export async function getAssessments(){
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


  try{

   const assessments=await db.assessment.findMany({
     where: {userId:user.id} ,
     orderBy:{
      createdAt: "asc"
     } ,
   }) ;

   return assessments;

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
    }catch(error){
    console.error("error deleting history" ,error)
}

  }
