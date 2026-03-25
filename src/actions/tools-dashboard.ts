import db from "../lib/prisma";

export async function getUserDashboardData(userId:string){
    try {
        const [ resumes , assessments , roadmaps , lastChat]=await Promise.all([


            db.resume.count({
                where:{userId: userId}
            }) ,
        
            db.assessment.findMany({
                where: { userId:userId}  ,
                orderBy: {createdAt :"desc"} ,
                take:5

            }) ,

            db.roadmap.findMany({
                where: {userId:userId}
            
            }),

            db.chat.findFirst({
                where:{
                    userId:  userId  ,
                    isEnded:true 
                } ,
                orderBy:{updatedAt : "desc"} ,
                include:{
                    messages:true
                }

            })
        ])

        return {
            resumes,
            assessments,
            roadmaps,
            lastChat
        }
    } catch (error) {
        console.error("Failed to load dashboard data", error);
        return {
            resumes: 0,
            assessments: [],
            roadmaps: [],
            lastChat: null
        }
    }
}