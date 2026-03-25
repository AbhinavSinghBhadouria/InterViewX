import { curatedRoadmaps } from "@/src/constants/roadmaps"
import RoadmapViewer from "@/src/components/RoadmapViewer"
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";


export default async function RoadmapPage({ params }: any) {

      const { slug } = await params;

  const roadmap = curatedRoadmaps.find(
    (r) => r.slug === slug
  )


  if (!roadmap) {
    return <div>Roadmap not found</div>
  }

  return <div className="p-3">
  <Link href={"/ai-roadmap/curated"} >
                   <Button variant="link" className="gap-2 pl-0 cursor-pointer mb-2">
                     <ArrowLeft className="h-4 w-4"/>
                     Back to Curated Roadmaps
                     </Button>
                     </Link>
                     <RoadmapViewer roadmap={roadmap} />
  </div>
}