import { CheckCircle2, Trophy, XCircle } from 'lucide-react';
import { CardContent ,Card } from '@/components/ui/card';
import { CardFooter } from '@/components/ui/card';
import { Button } from './ui/button';

const QuizResult = ({result , hideStartNew=false , onStartNew}:any) => {

  if(!result) return null;
  return (
    <div className="mx-auto">

     <div className="flex justify-center items-center">
    <h1 className="flex items-center gap-2 text-4xl gradient-title ">

      <Trophy  className="h-10 w-10 text-yellow-500"/>
     Your Quiz Results
    </h1>
      </div>

      <div className="text-center space-y-2 m-2">
        <div className="text-5xl font-bold text-green-600 mb-2">{result.quizScore.toFixed(1)}%</div> 
      </div>
  


    <CardContent  >

 {result.improvementTip && (
  <div className="bg-black p-4 rounded-lg">
    <div className="text-lg font-semibold text-yellow-500 mb-2">
      Improvement Tip
    </div>
    <div className='text-green-600 font-semibold'>
      {result.improvementTip}
    </div>
  </div>
)}

 <div>
  <h3 className="text-4xl text-center mt-3">Questions Review</h3>
  {result.questions.map((q:any)=>(
         <div className="border rounded-lg p-4 space-y-2 m-3 bg-black">
          <div className="flex items-start justify-between gap-2">
            <div className="font-medium text-red-600"> <span className="text-red-300">Question</span> :{q.question}</div>
            {q.isCorrect?(
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0"/>
              ):(
              <XCircle className="h-5 w-5 text-red-500 shrink-0"/>
              )}
          </div>

          <div className='text-md'>
             <div>
                        <span className="text-yellow-300">
                  Your answer:
                  </span> { q.userAnswer}</div>
           {!q.isCorrect && <div>
            <span className="text-green-300">Correct answer:</span> {q.answer}</div>}
           </div>

           <div className="texts-sm bg-gray-950 p-2 rounded">
            <div className="font-medium text-green-300">Explanation For The Question:</div> 
            <p>{q.explanation}</p>
         </div>
         </div>
  ))}
 </div>

    </CardContent>


    {!hideStartNew && (
      <CardFooter className="mb-5 flex items-center justify-center">
        <Button onClick={onStartNew}>
          Start New Quiz
        </Button>
      </CardFooter>
    )}
    </div>
  
  )
}

export default QuizResult
