import Image from 'next/image'
import InterviewCard from '@/src/components/InterviewCard'
import { getCurrentUser } from '@/src/models/User'
import { getInterviewByUserId, getLatestInterviews } from '@/src/lib/action'
import StartInterviewButton from '@/src/components/StartInterviewButton'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { getServerSession } from "next-auth"
import { authOptions } from '../api/auth/[...nextauth]/options'
import { redirect } from "next/navigation"



const page = async() => {

  const session = await getServerSession(authOptions);
    
  if (!session) {
    redirect("/landingPage");  
  }

    if (session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/authtenticatedLandingPage")  
  }
  const user=await getCurrentUser();

  
 


  if(!user) return null;
  const userInterviews=await getInterviewByUserId(user?._id.toString());
  const latestInterviews=await getLatestInterviews({userId:user?._id.toString()}); //since there are two arguments for this function
  if(!userInterviews) return null;
  if(!latestInterviews) return null;

  const hasPastInterviews=userInterviews?.length>0;
  const hasUpcomingInterviews=latestInterviews.length>0;

  return (
   <>

    <Link href={"/authenticatedLandingPage"}>
         <Button variant="link" className="gap-2  pl-0 m-2">
           <ArrowLeft className="h-4 w-4"/>
           Back to DashBoard
           </Button>
           </Link>

   <section className="card-cta m-3">
   <div className="flex flex-col gap-6 max-w-sm">
    <h2>Ace Your Interview with Smart AI Practice & Real-Time Feedback</h2>
    <p className="text-lg">
      Practice on real interview questions and get instant feedback
    </p>

    <StartInterviewButton/>
    {/* <Button className="btn-primary max-sm:w-full flex items-center gap-2">
      <Link href="/interview">Start an interview</Link>
    </Button> */}

   </div>
   
   <Image src="/robot.png" alt="robot image" width={400} height={400}  className="mask-img hidden md:block"></Image>
 
   </section>



    <section className="flex flex-col gap-6 mt-8 border-white">
    <div className="text-4xl font-bold m-2 text-center">Your Interviews : </div>
    <div className="interviews-section flex flex-wrap">
       {
          hasPastInterviews ? (
            userInterviews?.map((interview )=>(
              //@ts-ignore
              <InterviewCard
               interviewId={interview._id.toString()}
               userId={interview.userId.toString()}
               role={interview.role}
               type={interview.type}
               techstack={interview.techstack}
               createdAt={interview.createdAt.toString()}
               key={interview._id.toString()}
              
              />
            ))
           ):      <p className="pl-2 text-center text-green-600">You have not taken any inteviews yet...</p> 
          }
    </div>
   </section>


   <section className="flex flex-col gap-6 mt-8">
     <div className="text-4xl font-bold m-2 text-center">Take an Interview : </div>
    <div className="interview-section flex flex-wrap">

        {
          hasUpcomingInterviews ? (
            latestInterviews?.map((interview)=>(
              <InterviewCard 
                interviewId={interview._id.toString()}
                userId={interview.userId.toString()}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
               createdAt={interview.createdAt.toString()}
               key={interview._id.toString()}
              
              
              
              />
            ))
           ):      <p className="pl-2 text-center text-green-600">There are no new interviews available</p> 
          }

        
    
  </div> 
   </section>
   </>
  )
}

export default page
