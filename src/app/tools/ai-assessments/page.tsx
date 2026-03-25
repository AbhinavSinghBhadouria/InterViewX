import { checkUser } from "@/src/lib/checkUser";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";



const aptitude = [
  { title: "Logical Reasoning"  , questions: 10 },
  { title: "Quantitative Aptitude" ,  questions: 10 },
  { title: "Verbal Ability" , questions: 10 },

];

const coreSubjects = [
  { title: "DBMS", questions: 10 },
  { title: "Computer Networks",questions: 10 },
  { title: "Operating System", questions: 10 },
];





const Card = ({ title, questions  ,type}: any) => {

  
  const subject = title.toLowerCase().replace(/\s+/g, "-");


  return (
    <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-6 shadow-lg hover:scale-105 transition">
      
      <div className="flex items-start justify-between mb-2">
        <h2 className="text-lg text-yellow-300 font-semibold">{title}</h2>
      
      </div>

      <p className="text-gray-400 text-sm mb-5">No of questions  <span className="text-green-300 font-bold">{questions}</span></p>

       <Link href={`/tools/ai-assessments/${type}/${subject}`}>
        <button className="w-full bg-green-600 hover:bg-green-800 py-2 rounded-lg transition">
          Take Assessment
        </button>
      </Link>

    </div>
  );
};

const Page = async () => {
  const user = await checkUser();
  if (!user) return null;

  return (
    <div className="min-h-screen p-15 text-white  ">
       <div className="flex justify-between items-center">
       <Link href={"/tools/dashboard"}>
            <Button variant="link" className="gap-2 pl-0 cursor-pointer">
              <ArrowLeft className="h-4 w-4"/>
              Back to DashBoard
              </Button>
        </Link> 
       <h1 className="text-6xl font-extrabold bg-linear-to-r from-blue-600 via-blue-500 to-cyan-300 bg-clip-text text-transparent mt-5 text-center mb-5">
            PRACTICE ASSESSMENTS
        </h1>
      
        <Link href={"/tools/ai-assessments/history"}>
        <span className="font-bold bg-blue-500 hover:bg-blue-700 hover:scale-105 transition cursor-pointer rounded-lg text-white w-contain p-4">My Assessment History</span>
        </Link>


        </div>
      {/* Greeting */}
      <div className="text-center mb-10">

        <h1 className="text-3xl font-semibold">
          Hi <span className="text-yellow-500">{user.name}</span>! Ready to test your preparation?
        </h1>
        
      </div>


      {/* Aptitude */}
      <h2 className="text-2xl font-semibold mb-4 text-amber-600">Aptitude</h2>
      <div className="grid md:grid-cols-3 gap-8 mb-10">
        {aptitude.map((item, index) => (
          <Card key={index} title={item.title} questions={item.questions} type="aptitude"/>
        ))}
      </div>


      {/* Core Subjects */}
      <h2 className="text-2xl font-semibold mb-4  text-amber-600">Core Subjects</h2>
      <div className="grid md:grid-cols-3 gap-8 mb-10">
        {coreSubjects.map((item, index) => (
          <Card key={index} title={item.title} questions={item.questions} type="core"/>
        ))}
      </div>


      {/* Technical */}
      <h2 className="text-2xl font-semibold mb-4  text-amber-600">Technical</h2>
      <p className="mb-3">This assessment contains questions related to the skills you mentioned while completing your profile..</p>
    
         <div className="grid grid-cols-3">
          <Card  title="Technical Assessment" questions={10} type="technical" />
      </div>
     

    </div>
  );
};

export default Page;