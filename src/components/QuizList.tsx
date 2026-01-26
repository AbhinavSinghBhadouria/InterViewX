"use client"
import { useState} from 'react'
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import {Card,CardContent,CardDescription,CardHeader, CardTitle,} from "@/components/ui/card";
import { Dialog,DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {format} from "date-fns"
import QuizResult from './QuizResult';
import StartNewQuizBtn from './StartNewQuizBtn';


const QuizList = ({assessments}:any) => {
    const router=useRouter();
    const [selectedQuiz , setSelectedQuiz]=useState(null);

  return (
    <>
      <Card className="bg-black mt-6 border border-blue-500/30 shadow-[0_0_15px_rgba(0,140,255,0.35)] rounded-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-title text-3xl md:text-4xl">
              <span className="text-orange-400"> Recent Quizzes</span>
              </CardTitle>
              <CardDescription>
                Review your past quiz performance
              </CardDescription>
            </div>
            <StartNewQuizBtn/>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments?.map((assessment:any, i:number) => (
              <Card
                key={assessment.id}
                className="cursor-pointer hover:bg-muted/90 transition-colors"
                onClick={() => setSelectedQuiz(assessment)}
              >
                <CardHeader>
                  <CardTitle className="text-orange-600 text-3xl">
                    Quiz {i + 1}
                  </CardTitle>
                  <CardDescription className="flex justify-between w-full">
                    <div className="text-green-400 text-2xl font-bold">Score: {assessment.quizScore.toFixed(1)}%</div>
                    <div className="text-yellow-300">
                      {format(
                        new Date(assessment.createdAt),
                        "MMMM dd, yyyy HH:mm"
                      )}
                    </div>
                  </CardDescription>
                </CardHeader>
                {assessment.improvementTip && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {assessment.improvementTip}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>


          <QuizResult
            result={selectedQuiz}
            hideStartNew
            onStartNew={() => router.push("/interview-prep/tools/mock")}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default QuizList
