import db from "@/src/lib/prisma";
import Link from 'next/link';
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from 'lucide-react';

import RoadmapViewer from "@/src/components/RoadmapViewer";



export default async function Page({ params }: { params: Promise<{ id: string }> } ) {

  const {id}=await params;
  
  const roadmap = await db.roadmap.findUnique({
    where: {
      id
    }
  })
  console.log(roadmap);


  if (!roadmap) {
    return <div>Roadmap not found</div>
  }
   
     return(
     
     <div className="p-3"> 

       <Link href={"/tools/ai-roadmap-generator"} >
               <Button variant="link" className="gap-2 pl-0 cursor-pointer mb-2">
                 <ArrowLeft className="h-4 w-4"/>
                 Back to Roadmap Generator Dashboard
                 </Button>
                 </Link>
    <RoadmapViewer roadmap={roadmap}/>

     </div>
     )
   
    
  
  
}