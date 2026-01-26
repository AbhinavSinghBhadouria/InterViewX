import { Button } from '@/src/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Quiz from '@/src/components/Quiz'

const page = () => {
  return (
    <div className="min-h-screen flex flex-col space-y-2 mx-2">
      <Link href={"/tools/interview-prep"}>
      <Button variant="link" className="gap-2  pl-0">
        <ArrowLeft className="h-4 w-4"/>
        Back to Performance DashBoard
        </Button>
        </Link>

        <div>
   
 <h1 className="text-6xl font-extrabold bg-linear-to-r from-blue-600 via-blue-500 to-cyan-300 bg-clip-text text-transparent mt-5 text-center">
            MOCK INTERVIEW QUESTIONS
        </h1>
          
        </div>

        <Quiz/>
    </div>
  )
}

export default page
