
import OnboardingForm from '@/src/components/OnboardingForm'
import { getUserOnboardingStatus } from '@/src/actions/user'
import { redirect } from 'next/navigation'
import { checkUser } from '@/src/lib/checkUser'
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { ArrowLeft } from 'lucide-react'


const page = async() => {

  await checkUser();

//check if the user if already onboarded
const {isOnboarded}= await getUserOnboardingStatus();

if(isOnboarded){
  redirect("/tools/dashboard");
}


  return (
   <div className="min-h-screen">  
    <Link href={"/authenticatedLandingPage"}>
            <Button variant="link" className="gap-2  pl-0 m-2 cursor-pointer">
              <ArrowLeft className="h-4 w-4"/>
              Back to DashBoard
              </Button>
              </Link>  
      <OnboardingForm/>
    
  </div>
    
  )
}

export default page
