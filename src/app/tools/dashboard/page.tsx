
import { getUserOnboardingStatus } from '@/src/actions/user'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { getUserDashboardData } from '@/src/actions/tools-dashboard'
import { getServerSession } from 'next-auth'
import db from '@/src/lib/prisma'
import { authOptions } from '../../api/auth/[...nextauth]/options'
import StatsCard from './_components/StatsCard'
import WeakConcepts from './_components/WeakConcepts'
import AssessmentScores from './_components/AssessmentScores'
import LastChat from './_components/LastChat'



const page = async() => {

const { isOnboarded}  = await getUserOnboardingStatus();



//if the user is not on boarded then push it to on boarding page
console.log("onboarding status" , isOnboarded);
if(!isOnboarded){
  redirect("/tools/onboarding")
}

const session =await  getServerSession(authOptions);

    //id from mongodb
   const authUserId = session?.user._id;


let data: Awaited<ReturnType<typeof getUserDashboardData>> = {
  resumes: 0,
  assessments: [],
  roadmaps: [],
  lastChat: null,
}

try {

   //getting the id of the user from prisma
   const dbUser = await db.user.findUnique({
  where: {
    authUserId,
  },
});

if (!dbUser) {
  throw new Error("User not found in database");
}

data = await getUserDashboardData(dbUser.id);
} catch (error) {
  console.error("Failed to load dashboard page data", error)
}


  return (
    <>
    <Link href="/authenticatedLandingPage">
          <Button variant="link" className="mb-4 gap-2 pl-0 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        

        <div className="space-y-6">
          <StatsCard
            resumes={data.resumes}
            assessments={data.assessments}
            roadmaps={data.roadmaps}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <WeakConcepts assessments={data.assessments} />
            </div>

            <div className="space-y-6 lg:col-span-5">
              <LastChat chat={data.lastChat} />
              <AssessmentScores assessments={data.assessments} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default page
