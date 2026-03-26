import { getIndustryInshights } from '@/src/actions/dashboard';
import { getUserOnboardingStatus } from '@/src/actions/user'
import { redirect } from 'next/navigation'
import React from 'react'
import DashboardView from '../../../components/DashboardView';
import { parseIndustryInsightRow } from '@/src/constants';
import Link from 'next/link'
import { Button } from '@/src/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const page = async() => {

const { isOnboarded}  = await getUserOnboardingStatus();

//if the user is not on boarded then push it to on boarding page
console.log("onboarding status" , isOnboarded);
if(!isOnboarded){
  redirect("/tools/onboarding")
}

const row = await getIndustryInshights();  //since our db returns json thereofore we are converting into obj type
  return (
<>
     
     <Link href={"/tools/dashboard"}>
            <Button variant="link" className="gap-2 pl-0 cursor-pointer">
              <ArrowLeft className="h-4 w-4"/>
              Back to DashBoard
              </Button>
        </Link>
    <div className="container mx-auto">
       
     
      <DashboardView  insights={parseIndustryInsightRow(row)}
          lastUpdated={row.lastUpdated}
            nextUpdate={row.nextUpdate}/>
     
    </div>
    </>
  )
}

export default page
