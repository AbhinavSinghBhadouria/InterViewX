"use client";
import { useState ,useEffect } from "react";
import useFetch from "../hooks/use-fetch";
import { generateQuiz, saveQuizResult } from "../actions/interview";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "./ui/button";
import { Label } from "@/src/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"
import { toast } from "sonner";
import { Loader, Loader2 } from "lucide-react";
import QuizResult from "./QuizResult";





const Quiz = () => {

//states for handling the quiz question
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);


  const {
    loading:savingResult ,
    fn:saveQuizResultFn ,
    data:resultData ,
    setData:setResultData ,
  }=useFetch(saveQuizResult);


 //we will create a answers length of size equal to quizData and initialize it with null as the user havent answered any question yet
 //as the user will answer questions the null will get replaced by the actual answers of the users
   useEffect(()=>{
    if(quizData){
        setAnswers(new Array(quizData.length).fill(null));
    }
   },[quizData]);  //this will happen once when the quiz will get generated



   //now we will write the function that will populate the answer array with the answer selected by the user from radion buttons
   const handleAnswer=(answer:string)=>{
    const newAnswers=[...answers]; //populating the variable with previous answers
    newAnswers[currentQuestion]=answer;
    setAnswers(newAnswers);  //setting the new array
   }

   //------------------------------------------------------------------------------------------------------------------------------------------------------------

   const handleNext=()=>{
    if(currentQuestion< quizData.length-1){
        setCurrentQuestion(currentQuestion+1);
        setShowExplanation(false);
    }else{
        finishQuiz();
    }
   };

   //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   

   const calculateScore=()=>{
    let correct=0;
    answers.forEach((answer ,index)=>{
        if(answer===quizData[index].correctAnswer){
            correct++;
        }
    });
    return (correct / quizData.length)*100;  //calculating the percentage
   };

   //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
   const finishQuiz=async()=>{
    const score=calculateScore();
    try{
        await saveQuizResultFn(quizData , answers , score)
        toast.success("Quiz completed!")
    }catch(error){
        toast.error("Failed to save the quiz results")
    }
   }

   //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


   const startNewQuiz=()=>{
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn();
    setResultData(null);
   }

   //SHOWING THE RESULTS WHEN THE QUIZ GETS COMPLETED
   if(resultData){
    return (
        <div className="mx-2">
            <QuizResult result={resultData}  onStartNew={startNewQuiz}/>
        </div>
    )
   }

   //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // BEFORE QUIZ START
  if (!quizData ) {
    return (
        <div className="flex items-center justify-center m-4">
      <Card className="w-1/2">
        <CardHeader className="text-center">
          <CardTitle>Ready to test your skills?</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground">
            This mock interview contains 10 industry-specific questions based on
            your skills. Choose the best answer for each question to simulate a
            real interview.
          </p>
        </CardContent>

        <CardFooter>
          <Button
            className="w-full cursor-pointer"
            onClick={generateQuizFn}
            disabled={generatingQuiz}
          >
            {generatingQuiz ? "Generating Questions..." : "Start Quiz"}
          </Button>
        </CardFooter>
      </Card>
      </div>
    );
  }

  const question=quizData[currentQuestion];


  // QUIZ STARTED
  return (
    <div>
     
       <div className="flex items-center justify-center m-4 ">
      <Card className="w-full space-y-2 m-3">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Question {currentQuestion+1} out of {quizData.length} </CardTitle>
        </CardHeader>

        <CardContent >
          <div >
         <span className="text-red-500 text-2xl font-bold">
           {question.question}
</span>
           <RadioGroup
            className="space-y-2 mt-2 " 
            onValueChange={handleAnswer}
            value={answers[currentQuestion]}>
            {
                question.options.map((option:any , index:number)=>(
 <div className="flex items-center gap-3 " key={index}>
    <RadioGroupItem value={option} id={`option-${index}`} />
    <Label htmlFor={`option-${index}`}  className="text-xl font-medium cursor-pointer" >{option}</Label>
  </div>
                ))
            }
</RadioGroup> 


{/* //SHOWING EXPLANATION */}

      </div>
        </CardContent>

        <CardFooter className="space-x-2 justify-between">


{showExplanation && (
    <div className="mt-4 p-4 bg-black rounded-lg">
        <div className="font-medium text-yellow-300">Explanation for the question : </div>
        <div className="text-green-400">{question.explanation}</div>
    </div>
)}

       {!showExplanation && (
            <Button
            onClick={()=>setShowExplanation(true)}
            variant="outline"
            className="cursor-pointer"
            disabled={!answers[currentQuestion]}>
                Show Explanation
            </Button>
        )}

        <Button
        onClick={handleNext}
        className="btn-primary cursor-pointer"
        disabled={!answers[currentQuestion] || savingResult}
        >
            {savingResult && (
                < Loader>
                Saving Result...
                </Loader>
            )}
            {currentQuestion < quizData.length-1
            ? "Next Question"
            : "Finish Quiz"
             }
            </Button>   
        </CardFooter>
      </Card>
      </div>
    </div>
  );
};

export default Quiz;
