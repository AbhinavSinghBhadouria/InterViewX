import { CheckCircle2, Trophy, XCircle } from 'lucide-react';
import { CardContent ,Card } from '@/src/components/ui/card';
import { CardFooter } from '@/src/components/ui/card';
import { Button } from './ui/button';
import StartNewQuizBtn from './StartNewQuizBtn';

const QuizResult = ({result , hideStartNew=false , onStartNew}:any) => {

  if(!result) return null;
  return (
    <div className="mx-auto">

     <div className="flex justify-center items-center m-4">
    <div className="flex items-center sm:gap-2 gap-1 text-1xl sm:text-4xl gradient-title ">

    <Trophy  className="h-10 w-10 text-yellow-500"/>
     You Scored :
    </div>
         <div className="ml-2 sm:text-4xl font-bold text-green-600 ">{result.quizScore.toFixed(1)}%</div> 
      </div>

   
  


    <CardContent  >

 {result.improvementTip && (
  <div className="bg-black p-4 rounded-lg m-4">
    <div className="text-lg font-semibold text-yellow-500 mb-2">
      Improvement Tip
    </div>
    <div className='text-green-600 font-semibold'>
      {result.improvementTip}
    </div>
  </div>
)}


 <div className="bg-muted/50 rounded-sm p-4 m-2">
  <div className="text-4xl font-medium text-center mt-3">Questions Review</div>
  {result.questions.map((q:any , index:number)=>(
         <div className="border rounded-lg p-4 space-y-2 m-3 bg-black" key={index}>
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
       <StartNewQuizBtn/>
      </CardFooter>
    )}
    </div>
  
  
  )
}

export default QuizResult
