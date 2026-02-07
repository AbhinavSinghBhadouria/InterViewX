import React from 'react'


const questionList = [
  "I’m confused about my career path, Can you help me choose?",
  "What skills should I focus on to get placed faster?",
  "How can I prepare for internships in the next 3 months?",
  "What are common HR interview questions and how to answer them?",
  "I’m a beginner, Where should I start in tech?"
]
const EmptyState = ({selectedQuestion}:any) => {
  return (
    <div className="text-center">
      <h2 className="text-blue-500">Ask anything to AI career agent</h2>
      <div className="flex-col items-center justify-center m-5">
        {questionList.map((question ,index)=>(
            <h4 key={index} className="p-4 hover:bg-muted transition inline-block w-fit text-center border rounded-lg  m-4 cursor-pointer" onClick={()=>selectedQuestion(question)} >{question}
            </h4>
        ))}
      </div>
    </div>
  )
}

export default EmptyState
