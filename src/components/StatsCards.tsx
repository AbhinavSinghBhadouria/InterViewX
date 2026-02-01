import { Brain, Target, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


const StatsCards = ({assessments}:any) => {
  const getAverageScore=()=>{
     if(!assessments?.length) return 0;
     //here sum is the accumulator
      const total =assessments.reduce((sum :number, assessment:any)=> sum+assessment.quizScore  ,0

      );
      return (total / assessments.length).toFixed(1);

    };

    
  const getLatestAssessment = () => {
    if (!assessments?.length) return null;
    return assessments[0];
  };

    const getTotalQuestions = () => {
    if (!assessments?.length) return 0;
    return assessments.reduce(
      (sum:number, assessment:any) => sum + assessment.questions.length,
      0
    );
  };
  return (
    <div className="grid gap-2 md:grid-cols-3 p-2">
     
 <Card className="w-89 bg-black
  border border-blue-500/30
  shadow-[0_0_25px_rgba(0,140,255,0.35)]
  rounded-x">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl text-blue-300">Average Score</CardTitle>
          <Trophy className="h-6 w-6 text-yellow-300" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-400">{getAverageScore()}%</div>
          <p className="text-xs ">
            Across all assessments
          </p>
        </CardContent>
      </Card>
   

    <Card className="w-90  bg-black
  border border-blue-500/30
  shadow-[0_0_15px_rgba(0,140,255,0.35)]
  rounded-x" >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl text-blue-300">
            Questions Practiced
          </CardTitle>
          <Brain className="h-6 w-6 text-yellow-300" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-400">{getTotalQuestions()}</div>
          <p className="text-xs t">Total questions</p>
        </CardContent>
      </Card>

      <Card className="w-90  bg-black
  border border-blue-500/30
  shadow-[0_0_15px_rgba(0,140,255,0.35)]
  rounded-x">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl text-blue-300">Latest Score</CardTitle>
          <Target className="h-6 w-6 text-yellow-300" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-400">
            {getLatestAssessment()?.quizScore.toFixed(1) || 0}%
          </div>
          <p className="text-xs ">Most recent quiz</p>
        </CardContent>
      </Card>


   
      
    
    </div>
  )
}

export default StatsCards
