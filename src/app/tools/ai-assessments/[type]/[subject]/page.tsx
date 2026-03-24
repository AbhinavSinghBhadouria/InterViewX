import Quiz from "@/src/components/Quiz";

interface PageProps {
  params: Promise<{
    type: string;
    subject: string;
  }>;
}

const page = async({params}:PageProps) => {
  const {type  ,subject}=await params;
   <h1 className="text-6xl font-extrabold bg-linear-to-r from-blue-600 via-blue-500 to-cyan-300 bg-clip-text text-transparent mt-5 text-center">
            PRACTICE ASSESSMENT
        </h1>
  return (
    <div className="min-h-screen">
       <h1 className="text-6xl font-extrabold bg-linear-to-r from-blue-600 via-blue-500 to-cyan-300 bg-clip-text text-transparent mt-5 text-center">
            PRACTICE ASSESSMENT
        </h1>
      <Quiz type={type} subject={subject}/>
    </div>
  )
}

export default page
