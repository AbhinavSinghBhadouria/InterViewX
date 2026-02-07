import { getAssessments } from "@/src/actions/interview"
import StatsCards from "@/src/components/StatsCards";
import PerformanceChart from "@/src/components/PerformanceChart";
import QuizList from "@/src/components/QuizList";
import { Button } from '@/src/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const page = async() => {
  const assessments=await getAssessments();
  return (
  
    <div className="min-h-screen">


          <Link href={"/tools/dashboard"}>
            <Button variant="link" className="gap-2  pl-0">
              <ArrowLeft className="h-4 w-4"/>
              Back to DashBoard
              </Button>
              </Link>


     <h1 className="text-6xl font-extrabold bg-linear-to-r from-blue-600 via-blue-500 to-cyan-300 bg-clip-text text-transparent mt-5 text-center">
            PERFORMANCE DASHBOARD
        </h1>

        <div className="container mx-auto mt-10 mb-10">
          <StatsCards assessments={assessments}/>
          <PerformanceChart assessments={assessments}/>
          <QuizList assessments={assessments}/>
        </div>
    </div>
  )
}

export default page
