import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { ArrowLeft } from "lucide-react"

import { curatedRoadmaps } from "@/src/constants/roadmaps"


const page = () => {
  return (
    <div className="min-h-screen p-3">
          <Link href={"/tools/ai-roadmap-generator"}>
                            <Button variant="link" className="gap-2  pl-0 cursor-pointer">
                              <ArrowLeft className="h-4 w-4"/>
                              Back to Roadmap DashBoard
                              </Button>
                              </Link>
      <h1 className="text-6xl md:text-6xl font-extrabold mb-4 bg-linear-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent text-center">
          Custom Rodmaps by Amber Hasan
        </h1>

         <div className="space-y-6 max-w-2xl mx-auto">

        {curatedRoadmaps.map((roadmap) => (
          <Link
            key={roadmap.slug}
            href={`/ai-roadmap/curated/${roadmap.slug}`}
            className="block p-6 bg-muted rounded-xl hover:bg-muted/70"
          >
            <h2 className="text-xl font-semibold m-2">
              {roadmap.title}
            </h2>

            <p className="text-muted-foreground">
              {roadmap.description}
            </p>
          </Link>
        ))}

      </div>
    </div>
  )
}

export default page
