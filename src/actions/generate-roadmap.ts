"use server"

import Groq from "groq-sdk"

import { authOptions } from "../app/api/auth/[...nextauth]/options";
import db from "../lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cacheKeys } from "../lib/redis/keys";
import { TTL } from "../lib/redis/ttl";
import { withCache, deleteKey } from "../lib/redis/cache";

const groq = new Groq({
 apiKey: process.env.GROQ_API_KEY
})



export async function generateRoadmap(title: string) {
 const session = await getServerSession(authOptions);

    //id from mongodb
   const authUserId = session?.user._id;


   //getting the id of the user from prisma
   const user = await db.user.findUnique({
  where: {
    authUserId,
  },
});

if (!user) {
  throw new Error("User not found in database");
}


const prompt = `
You are an API that generates structured data for a React Flow roadmap visualization.

Your task is to generate a comprehensive learning roadmap for the given topic.
The roadmap should contain between 8 and 15 nodes depending on topic complexity.

IMPORTANT CONTEXT:

The topic can belong to different categories such as:

1. Career Roadmaps
Examples:
- Google SDE
- Microsoft SWE
- Amazon SDE Preparation

2. Tech Stack Roadmaps
Examples:
- React Developer
- Backend Developer
- AI Engineer
- Full Stack Developer

3. Core Computer Science Subjects
Examples:
- OOPS (Object Oriented Programming)
- DBMS (Database Management Systems)
- CN (Computer Networks)
-  OS (Operating Systems)
- System Design

4. Skill Based Roadmaps
Examples:
- DSA Mastery
- Competitive Programming

You must understand the context of the given topic and generate the roadmap accordingly.

For example:
- If the topic is "React Developer", generate a frontend development roadmap.
- If the topic is "DBMS", generate a database learning roadmap.
- If the topic is "System Design", generate a backend architecture learning roadmap.
- If the topic is "Google SDE", generate a roadmap for preparing for that company's interviews.

Follow these rules strictly:

1. Return ONLY valid JSON.
2. Do NOT include markdown, explanations, or text outside JSON.
3. Do NOT include backticks.
4. The JSON must strictly follow the schema below.
5. All node IDs must be unique strings.
6. All edges must connect existing node IDs.
7. Use a vertical roadmap structure from fundamentals → advanced.
8. Use meaningful spacing for node positions.
9. Positions must be numeric.
10. The output must be directly usable in React Flow.

JSON Schema:

{
  "roadmapTitle": "string",
  "description": "5-7 lines explaining the roadmap in comprehensive and detailed way",
  "duration": "estimated learning duration",
  "nodes": [
    {
      "id": "string",
      "position": { "x": number, "y": number },
      "data": {
        "title": "string",
        "description": "short explanation",
        "link": "REAL documentation link from approved sources"
      }
    }
  ],
  "edges": [
    {
      "id": "string",
      "source": "nodeId",
      "target": "nodeId"
    }
  ]
}

Graph Rules:

1. The roadmap graph must be a Directed Acyclic Graph (DAG).
2. Do NOT create circular dependencies.
3. Edges must always flow from earlier learning topics to later topics.
4. Avoid crossing edges when possible.
5. Nodes should mostly increase in the y direction (top to bottom).

Rules for positioning:
- Root node should start near {x: 0, y: 0}
- Child nodes should increase in y direction
- Use spacing between nodes to avoid overlap
- Create branching for specialization topics

Learning Resource Rules (VERY IMPORTANT):

Every node must include a working documentation link.

Links must come ONLY from trusted sources such as:

- https://developer.mozilla.org
- https://react.dev
- https://nodejs.org
- https://expressjs.com
- https://www.mongodb.com/docs
- https://nextjs.org/docs
- https://www.typescriptlang.org/docs
- https://docs.github.com
- https://www.prisma.io/docs
- https://tailwindcss.com/docs
- https://vitejs.dev/guide
- https://www.w3schools.com

STRICT RULES:

- Do NOT invent URLs.
- Do NOT guess documentation paths.
- Only include links you are confident exist.
- If unsure, link to the official documentation homepage of that topic.

The JSON must be syntactically valid and parseable by JSON.parse().

Generate a roadmap for this topic:
`


 const completion = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
   {
    role: "user",
    content: prompt + title
   }
  ]
 })



//cleaning the response returned by the AI
const response = completion.choices[0].message.content
if (!response) return null

// remove markdown blocks
const cleaned = response
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim()

// extract JSON object safely
const jsonMatch = cleaned.match(/\{[\s\S]*\}/)

if (!jsonMatch) {
  throw new Error("AI did not return valid JSON")
}

const roadmap = JSON.parse(jsonMatch[0])



//validating the data before storing it to the database
if (!roadmap.nodes || !roadmap.edges) {
  throw new Error("Invalid roadmap structure from AI")
}

if (!Array.isArray(roadmap.nodes) || !Array.isArray(roadmap.edges)) {
  throw new Error("Nodes or edges are not arrays")
}

// normalizing the data before saving it to the database
const normalizedDescription = Array.isArray(roadmap.description)
  ? roadmap.description
      .filter((line: unknown) => typeof line === "string")
      .map((line: string) => line.trim())
      .filter(Boolean)
      .join("\n")
  : typeof roadmap.description === "string"
    ? roadmap.description.trim()
    : null

const normalizedTitle = typeof roadmap.roadmapTitle === "string" && roadmap.roadmapTitle.trim().length > 0
  ? roadmap.roadmapTitle.trim()
  : `${title} Roadmap`

const normalizedDuration = typeof roadmap.duration === "string" && roadmap.duration.trim().length > 0
  ? roadmap.duration.trim()
  : null


 //saving the roadmap to prisma db
 const savedRoadmap = await db.roadmap.create({

  data: {
   title: normalizedTitle,
   description: normalizedDescription,
   duration: normalizedDuration,
   nodes: roadmap.nodes,
   edges: roadmap.edges,
   userId: user?.id //prisma user id
  }
 })
 

 //invalidating the data

   const historyKey = cacheKeys.roadmapsByUser(user.id);
   await deleteKey(historyKey);

 return savedRoadmap


}

export async function getRoadmapHistory() {
  const requestStartedAtMs = Date.now();
  const requestId = crypto.randomUUID();

  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    throw new Error("Unauthorized");
  }

  const authUserId = session.user._id;

  const user = await db.user.findUnique({
    where: { authUserId },
  });

  if (!user) {
    throw new Error("User not found in database");
  }

  const key = cacheKeys.roadmapsByUser(user.id);

  const { data, source, metrics } = await withCache(
    key,
    async () => {
      return db.roadmap.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
      });
    },
    TTL.ROADMAP_LIST_SECONDS
  );

  console.log("getRoadmapHistory source:", source);

  console.log(
    "LATENCY",
    JSON.stringify({
      action: "getRoadmapHistory",
      requestId,
      source,
      totalMs: Date.now() - requestStartedAtMs,
      redisGetMs: metrics.redisGetMs,
      producerMs: metrics.producerMs,
      redisSetMs: metrics.redisSetMs,
      cachePathMs: metrics.totalMs,
      key,
      userId: user.id,
    })
  );

  return data;
}



export async function deleteAllRoadmaps(){
    const session = await getServerSession(authOptions);

    if (!session?.user?._id) {
      return { error: "Not authenticated" };
    }

    const authUserId = session.user._id;

    const dbUser = await db.user.findUnique({
      where: {
        authUserId,
      },
    });

    if (!dbUser) {
      return { error: "User not found in database" };
    }

    try {
      await db.roadmap.deleteMany({
        where: {
          userId: dbUser.id
        }
      });

      const key = cacheKeys.roadmapsByUser(dbUser.id);
      await deleteKey(key);

      revalidatePath('/ai-roadmap/history');
      return { success: true };
    } catch (error) {
      console.error("Error deleting roadmaps:", error);
      return { error: "Failed to delete roadmaps" };
    }


}


