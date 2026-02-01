"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/options";
import db from "../lib/prisma";
import { revalidatePath } from "next/cache";
import Groq from "groq-sdk";



const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});


//this function is used for improving the summary with AI
export async function improveWithAI(summary:string){



   //check if the user is logged in or not
    const session = await getServerSession(authOptions);
    
      if (!session?.user?._id) {
        throw new Error("Unauthorized");
      }
    
      const authUserId = session.user._id;
    
      const user = await db.user.findUnique({
        where: {authUserId },
      });

  
      if (!summary || summary.trim().length < 10) {
  throw new Error("Summary too short to improve");
}
    
      if (!user) {
        throw new Error("User not found in neon db");
      }

       const prompt = `
You are an expert resume writer.

Improve the following description for a technological industry professional.

Current content:
"${summary}"

Requirements:
- Use strong action verbs
- Include measurable impact where possible
- Highlight relevant technical skills
- Keep it concise but impactful
- Focus on achievements, not responsibilities
- Use tech industry specific keywords

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

//------------------------------------------------------------------------------------------------------------------------------
    //AI RESUME

    //function for creating the entry when the resume is create by the user
    export async function createResume(title:string){

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

      //now create the entry of resume in the db
      const resume=await db.resume.create({
        data: {
          title ,
          userId:user.id
        }
      });
      return resume;
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
      return await db.resume.findMany({
    where: {
      userId: user.id,
    },
     orderBy: {
      createdAt: "desc",
    },
  });


}

//------------------------------------------------------------------------------------
//function for updating personal details in the database


export async function updateResumePersonalDetails(
  resumeId: string,
  data: {
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    address?: string;
    phone?: string;
    email?: string;
  }
) {
  
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    throw new Error("Unauthorized");
  }


  const user = await db.user.findUnique({
    where: {
      authUserId: session.user._id,
    },
  });

  if (!user) {
    throw new Error("User not found in neon db");
  }


  const resume = await db.resume.findUnique({
    where: { id: resumeId },
  });

  if (!resume || resume.userId !== user.id) {
    throw new Error("Not allowed");
  }

  //update the personal details in the resume
  await db.resume.update({
    where: { id: resumeId },
    data,
  });

  return { success: true };
}

//---------------------------------------------------------------------------------------------------------------------------------

export async function updateResumeSummary(
  resumeId: string,
  summary: string
) {
  
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    throw new Error("Unauthorized");
  }


  const user = await db.user.findUnique({
    where: {
      authUserId: session.user._id,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  
  const resume = await db.resume.findUnique({
    where: { id: resumeId },
  });

  if (!resume || resume.userId !== user.id) {
    throw new Error("Not allowed");
  }

  
  await db.resume.update({
    where: { id: resumeId },
    data: {
      summary,
    },
  });

  return { success: true };
}

//--------------------------------------------------------------------------------------------------------------------------------------

//function for updating professional experience summary with AI

export async function improveExperienceWithAI(summary: string) {
  
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    throw new Error("Unauthorized");
  }

  const authUserId = session.user._id;

  
  if (!summary || summary.trim().length < 10) {
    throw new Error("Summary too short to improve");
  }

  const user = await db.user.findUnique({
    where: { authUserId },
  });

  if (!user) {
    throw new Error("User not found in neon db");
  }


  //asking the AI for improved content in html format only
  const prompt = `
You are an expert resume writer for the tech industry.

Improve the following professional experience description and RETURN VALID HTML.

Current content:
"${summary}"

Requirements:
- Use strong action verbs
- Focus on achievements over responsibilities
- Include measurable impact where possible
- Highlight relevant technical skills
- Keep it concise and professional
- Use ONLY valid HTML tags such as <p>, <strong>, <em>, <ul>, <li>
- Do NOT use markdown
- Do NOT add explanations or extra text

Return ONLY the improved HTML.
`;

  
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You improve resume content." },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
    });

    const improvedHtml =
      response.choices[0]?.message?.content?.trim();

    if (!improvedHtml) {
      throw new Error("Empty response from Groq");
    }

    return improvedHtml;
  } catch (error) {
    console.error("Error improving experience:", error);
    throw new Error("Failed to improve experience");
  }
}


//------------------------------------------------------------------------------------------------------------
//function for saving the professonal experience in the database

export async function saveResumeExperience(
  resumeId: string,
  experiences: {
    title: string;
    companyName: string;
    city: string;
    state: string;
    startDate: string;
    endDate?: string;
    workSummary: string;
  }[]
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { authUserId: session.user._id },
  });

  if (!user) throw new Error("User not found");

  const resume = await db.resume.findUnique({
    where: { id: resumeId },
  });

  if (!resume || resume.userId !== user.id) {
    throw new Error("Not allowed");
  }

  
  await db.experience.deleteMany({
    where: { resumeId },
  });


  await db.experience.createMany({
    data: experiences.map((exp) => ({
      ...exp,
      resumeId,
    })),
  });

  return { success: true };
}


//------------------------------------------------------------------------------------------------
//function for saving the education details in the db
export async function saveResumeEducation(
  resumeId: string,
  educations: {
    universityName: string;
    degree: string;
    major: string;
    startDate: string;
    endDate: string;
    description: string;
  }[]
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { authUserId: session.user._id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const resume = await db.resume.findUnique({
    where: { id: resumeId },
  });

  if (!resume || resume.userId !== user.id) {
    throw new Error("Not allowed");
  }

  // 🔥 Remove old education entries
  await db.education.deleteMany({
    where: { resumeId },
  });

  // 🔥 Insert new ones
  await db.education.createMany({
    data: educations.map((edu) => ({
      ...edu,
      resumeId,
    })),
  });

  return { success: true };
}

//------------------------------------------------------------------------------------------------------------------------------------------------
//function for adding skills to the database
export async function saveResumeSkills(
  resumeId: string,
  skills: {
    name: string;
    rating: number;
  }[]
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { authUserId: session.user._id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const resume = await db.resume.findUnique({
    where: { id: resumeId },
  });

  if (!resume || resume.userId !== user.id) {
    throw new Error("Not allowed");
  }

  // 🔥 Remove old skills
  await db.skill.deleteMany({
    where: { resumeId },
  });

  // 🔥 Insert new skills
  await db.skill.createMany({
    data: skills.map((skill) => ({
      name: skill.name,
      rating: skill.rating,
      resumeId,
    })),
  });

  return { success: true };
}

//-----------------------------------------------------------------------------------------------------------
//function for fetching the resume by id
export async function getResumeById(resumeId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { authUserId: session.user._id },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const resume = await db.resume.findUnique({
    where: { id: resumeId },
    include: {
      
      experiences: true,
      educations: true,
      skills: true,
      
    },
  });

  if (!resume || resume.userId !== user.id) {
    throw new Error("Resume not found or not allowed");
  }

  return resume;
}



//------------------------------------------------------------------------------------------------------------------------------------------
export async function deleteResumeById(resumeId: string) {
  if (!resumeId) {
    throw new Error("Resume ID is required");
  }

  try {
    // OPTIONAL: delete related data first if cascading is not enabled
    await db.experience.deleteMany({
      where: { resumeId },
    });

    await db.education.deleteMany({
      where: { resumeId },
    });

    await db.skill.deleteMany({
      where: { resumeId },
    });

    // Delete the resume itself
    await db.resume.delete({
      where: { id: resumeId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw new Error("Failed to delete resume");
  }
}