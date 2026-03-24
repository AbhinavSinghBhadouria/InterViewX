"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { format } from "date-fns"
import QuizResult from './QuizResult'
import { clearAssessments } from '../actions/interview'

const QuizList = ({ assessments }: any) => {
  const router = useRouter()
  const [selectedQuiz, setSelectedQuiz] = useState(null)

  const handleClearHistory = async () => {
    const confirmClear = confirm("Are you sure you want to clear quiz history?")
    if (!confirmClear) return

    try {
      await clearAssessments()
      router.refresh()
    } catch (error) {
      console.error("Error clearing history:", error)
    }
  }

  //for formatting the title stored in database
  function formatSubject(subject: string) {
  return subject
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

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

            <div className="flex justify-center items-center gap-2">
             

              {assessments?.length > 0 && (
                <Button
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={handleClearHistory}
                >
                  Clear History
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {assessments?.map((assessment: any, i: number) => (
              <Card
                key={assessment.id}
                className="cursor-pointer hover:bg-muted/90 transition-colors"
                onClick={() => setSelectedQuiz(assessment)}
              >
                <CardHeader>
                  <CardTitle className="text-orange-600 text-3xl">

                    Quiz {i + 1}
                    <span className=" ml-4 text-amber-500">
                    {formatSubject(assessment.subject)}
                    </span>
                  </CardTitle>

                  <CardDescription className="flex justify-between w-full">
                    <div className="text-green-400 text-2xl font-bold">
                      Score: {assessment.quizScore.toFixed(1)}%
                    </div>

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
          
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default QuizList
