"use client"
import { Button } from "@/src/components/ui/button"
import  {useRouter} from "next/navigation"

export default function StatsCards({
  resumes,
  assessments,
  roadmaps
}: any) {

  const assessmentsTaken = assessments.length;

  const router=useRouter();

  const avgScore =
    assessments.reduce((acc: number, a: any) => acc + a.quizScore, 0) /
    (assessments.length || 1)

  const stats = [
    {
      title: 'Resumes created',
      value: resumes,
      encouragement: 'Start with your first resume to unlock personalized guidance.'
    },
    {
      title: 'Assessments taken',
      value: assessmentsTaken,
      encouragement: 'Take a quick assessment to discover your strongest growth areas.'
    },
    {
      title: 'Roadmaps generated',
      value: roadmaps.length,
      encouragement: 'Generate your first roadmap and get a step-by-step learning path.'
    }
  ]

  return (

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="min-h-37 bg-black border border-blue-500/30 shadow-[0_0_25px_rgba(0,140,255,0.35)] rounded-lg p-4"
        >
          <p className="text-2xl text-yellow-300! text-center">{stat.title}</p>

          {stat.value > 0 ? (
            <h2 className="mt-3 text-3xl font-semibold text-green-300 text-center">{stat.value}</h2>
          ) : (
            <div className="flex-col space-y-2">
            <p className="mt-3 text-sm text-slate-300 text-center">{stat.encouragement}</p>
            <div className="flex justify-center items-center">
            {
              stat.title=="Resumes created" && <Button className="cursor-pointer" onClick={()=>router.push("/tools/ai-resume")}>Explore Resume Builder</Button>
            }
            {stat.title=="Assessments taken" && <Button className="cursor-pointer" onClick={()=>router.push("/tools/ai-assessments")}>Explore Assessments</Button>}
            {stat.title=="Roadmaps generated" && <Button className="cursor-pointer" onClick={()=>router.push("/tools/ai-roadmap-generator")}>Generate Roadmaps</Button>}



            </div>
             </div>
          )}
        </div>
      ))}

      <div className="min-h-37 bg-black border border-blue-500/30 shadow-[0_0_25px_rgba(0,140,255,0.35)] rounded-lg p-4">
        <p className="text-2xl text-yellow-300! text-center">Avg score</p>

        {assessmentsTaken > 0 ? (
          <h2 className="mt-3 text-3xl font-semibold text-green-300 text-center">{avgScore.toFixed(1)}%</h2>
        ) : (
          <div className="space-y-2">
          <p className="mt-3 text-sm text-slate-300 text-center">
            Complete your first assessment to see your performance trend here.
          </p>
          <div className="flex items-center justify-center">
            <Button className="cursor-pointer" onClick={()=>router.push("/tools/ai-assessments")}>Explore Assessments</Button>
            </div>
            </div>
         
        )}
      </div>
    </div>
  )
}