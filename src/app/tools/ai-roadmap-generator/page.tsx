"use server"

import { authOptions } from "../../api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"
import { MessageSquare, Sparkle   , History } from "lucide-react"
import { ArrowLeft } from "lucide-react"
import { startChat } from "@/src/actions/ai-chat"
import { getUserOnboardingStatus } from "@/src/actions/user"
import { redirect } from "next/navigation"
import GenerateRoadmapBtn from "@/src/components/GenerateRoadmapBtn"


const page = async () => {
 

  const { isOnboarded}  = await getUserOnboardingStatus();
  
  //if the user is not on boarded then push it to on boarding page
  console.log("onboarding status" , isOnboarded);
  if(!isOnboarded){
    redirect("/tools/onboarding")
  }
  
  const session = await getServerSession(authOptions)
  const username = session?.user?.name?.split(" ")[0] || "there" //redering only the first name

  return (
    <div className="min-h-screen px-6 md:px-10 lg:px-20  ">
        <Link href={"/authenticatedLandingPage"}>
            <Button variant="link" className="gap-2  pl-0 cursor-pointer">
              <ArrowLeft className="h-4 w-4"/>
              Back to DashBoard
              </Button>
              </Link>
      
      <div className="text-center mt-10  m-3">
       

        <h1 className="text-6xl md:text-6xl font-extrabold bg-linear-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
          AI Career Roadmap Generator
        </h1>

        <p className="mt-4 text-md md:text-2xl font-medium text-muted-foreground max-w-3xl mx-auto">
         Generate a personalized step-by-step roadmap to achieve your dream career using the power of AI.
        </p>
      </div>

       <div className="text-center mt-3">
      <div className="inline-flex items-center gap-5 bg-muted/30 px-6 py-6 rounded-2xl">

        {/* IMAGE */}
        <div className="rounded-2xl overflow-hidden">
          <img
            src="/ai-roadmap.png"
            width={600}
            height={400}
            alt="AI Career Roadmap Generator Preview"
            className="rounded-2xl object-cover"
          />
        </div>

        {/* CTA */}
        <div className="max-w-md text-center ">
          <h1 className="text-2xl font-bold mb-2 ">
            Hi  <span className="text-blue-500">{username}</span>👋
          </h1>

          <p className="text-muted-sm mb-6">
           Your career journey starts here.
Generate a smart roadmap and discover exactly what to learn next.
          </p>
        
         

     <form action={startChat}>
   
</form> 
           <GenerateRoadmapBtn/>
           <Link href="/ai-roadmap/history">
            <Button className="w-full text-lg py-6 transition-all hover:scale-[1.02] cursor-pointer">
             <History/>View Roadmap History
            </Button>
          </Link>
        <span className="inline-block mt-4 rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
          AI-Generated Career Roadmaps
        </span>
        </div>
      </div>
    </div>
    </div>
  )
}

export default page
