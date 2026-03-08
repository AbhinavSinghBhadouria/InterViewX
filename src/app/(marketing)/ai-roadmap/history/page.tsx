
import { getServerSession } from "next-auth";
import db from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import { authOptions } from '../../../api/auth/[...nextauth]/options';
import { NextResponse } from "next/server";
import { Button } from "@/src/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react";
import ClearRoadmapsForm from "@/src/components/ClearRoadmapsForm";




export default async function ChatHistoryPage() {
  const session = await getServerSession(authOptions);

 

  if (!session?.user?._id) {
     return NextResponse.json(
        {
           message:"User not found in mongodb" ,
           status:404
        }
     )
  }

  //find out the prisma user id from the db
  const user = await db.user.findUnique({
    where: { authUserId: session.user._id },
  });

  if (!user) {
     return NextResponse.json(
        {
           message:"User not found in prisma db" ,
           status:404
        }
     )
  }

  //gettting all the roadmaps of the user from the db in descednig order
  const roadmaps = await db.roadmap.findMany({
    where: {
      userId: user.id,
      
    },
    orderBy: {
      updatedAt: "desc",
    },
  });


  return (
    <div className="p-10 mx-auto">
<div className="flex justify-between">
        <Link href={"/tools/ai-roadmap-generator"}>
                    <Button variant="link" className="gap-2  pl-0 cursor-pointer">
                      <ArrowLeft className="h-4 w-4"/>
                      Back to Roadmap DashBoard
                      </Button>
                      </Link>
     
                      <ClearRoadmapsForm/>

      </div>
<h1 className="text-6xl md:text-6xl font-extrabold bg-linear-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
          Your Roadmap History
        </h1>

      {roadmaps.length === 0 && (
        <p className="text-muted-foreground text-center mt-3">There are no roadmaps yet.</p>
      )}

      <div className="space-y-4 rounded-lg mt-5">
        {roadmaps.map(roadmap => (
          <Link
            key={roadmap.id}
            href={`/ai-roadmap/history/${roadmap.id}`}
            className="block border rounded-lg p-4 hover:bg-muted border-blue-500/30 shadow-[0_0_15px_rgba(0,140,255,0.35)] m-4"
          > 
          <div className="flex justify-between items-center p-3 rounded-lgk">
            <h2 className="font-semibold text-yellow-300 ">
              {roadmap.title ?? "AI Career Roadmap"}
            </h2>
            <p className="text-sm text-amber-700">
              {new Date(roadmap.createdAt).toLocaleString()}
            </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
