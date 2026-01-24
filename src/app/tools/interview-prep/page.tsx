import { getAssessments } from "@/src/actions/interview"
import StatsCards from "@/src/components/StatsCards";
import PerformanceChart from "@/src/components/PerformanceChart";
import QuizList from "@/src/components/QuizList";

const page = async() => {
  const assessments=await getAssessments();
  return (
  
    <div className="min-h-screen">
     <h1 className="text-6xl font-extrabold bg-linear-to-r from-blue-600 via-blue-500 to-cyan-300 bg-clip-text text-transparent mt-5 text-center">
            PERFORMANCE DASHBOARD
        </h1>

        <div className="p-10">
          <StatsCards assessments={assessments}/>
          <PerformanceChart assessments={assessments}/>
          <QuizList assessments={assessments}/>
        </div>
    </div>
  )
}

export default page
