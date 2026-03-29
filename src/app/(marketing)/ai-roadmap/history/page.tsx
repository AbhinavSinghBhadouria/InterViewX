
import { Button } from "@/src/components/ui/button"
import Link from "next/link"
import { ArrowLeft, CalendarDays, ChevronRight, Map, Route, Sparkles } from "lucide-react";
import ClearRoadmapsForm from "@/src/components/ClearRoadmapsForm";
import { getRoadmapHistory } from "@/src/actions/generate-roadmap";




export default async function RoadmapHistoryPage() {
  const roadmaps = await getRoadmapHistory();


  return (
    <div className=" w-full max-w-8xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="rounded-2xl m-10 border border-blue-500/30 bg-black/40 p-4 backdrop-blur-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/tools/ai-roadmap-generator">
            <Button variant="link" className="gap-2 pl-0 cursor-pointer text-blue-200 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Roadmap Dashboard
            </Button>
          </Link>

          <ClearRoadmapsForm />
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:mt-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-300">
            <Route className="h-3.5 w-3.5" />
            Roadmap Archive
          </div>

          <h1 className="text-3xl font-extrabold leading-tight text-transparent bg-linear-to-r from-blue-400 via-cyan-300 to-teal-300 bg-clip-text sm:text-5xl">
            Your Roadmap History
          </h1>

          <p className="text-sm text-blue-100/80 sm:text-base">
            Reopen your generated learning plans and continue your skill journey with confidence.
          </p>

          <div className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-100">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            {roadmaps.length} saved {roadmaps.length === 1 ? "roadmap" : "roadmaps"}
          </div>
        </div>
      </div>

      {roadmaps.length === 0 ? (
        <div className="mt-8 m-10 rounded-2xl border border-dashed border-blue-500/40 bg-black/30 p-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20">
            <Map className="h-7 w-7 text-blue-300" />
          </div>
          <h2 className="text-xl font-semibold text-blue-100">No roadmaps yet</h2>
          <p className="mt-2 text-sm text-blue-200/80">
            Generate your first AI roadmap and every version will be stored here for easy access.
          </p>
          <Link href="/tools/ai-roadmap-generator" className="mt-5 inline-block">
            <Button className="btn-primary cursor-pointer">Generate Roadmap</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 m-10">
          {roadmaps.map((roadmap) => (
            <Link
              key={roadmap.id}
              href={`/ai-roadmap/history/${roadmap.id}`}
              className="group block rounded-xl border border-blue-500/30 bg-[#071224]/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/50 sm:p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-yellow-300 sm:text-lg">
                    {roadmap.title ?? "AI Career Roadmap"}
                  </h2>
                  <div className="mt-2 flex items-center gap-2 text-xs text-amber-300/85 sm:text-sm">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(roadmap.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="mt-0.5 shrink-0 rounded-full border border-blue-400/30 bg-blue-500/10 p-2 transition-colors group-hover:border-cyan-300/60 group-hover:bg-cyan-500/15">
                  <ChevronRight className="h-4 w-4 text-cyan-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
  );
}
