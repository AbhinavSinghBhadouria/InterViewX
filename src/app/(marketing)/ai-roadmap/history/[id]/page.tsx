import RoadmapViewer from "@/src/components/RoadmapViewer";
import db from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import Link from 'next/link';
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from 'lucide-react';


export default async function Page({params}:  {params: Promise<{id:string}> }){
  
    const {id} = await params;

    //now fetch the the roadmap with this if

    const roadmap = await db.roadmap.findUnique({
        where: {
            id
        }
    })

    if(!roadmap) return notFound();



  return (
  <div>
     <Link href={"/ai-roadmap/history"} >
                   <Button variant="link" className="gap-2 pl-0 cursor-pointer mb-2">
                     <ArrowLeft className="h-4 w-4"/>
                     Back to Roadmap History 
                     </Button>
                     </Link>
                     
    <RoadmapViewer roadmap={roadmap}/>

    </div>
  )
}


