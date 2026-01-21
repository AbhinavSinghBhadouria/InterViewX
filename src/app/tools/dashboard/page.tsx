import { getIndustryInshights } from '@/src/actions/dashboard';
import { getUserOnboardingStatus } from '@/src/actions/user'
import Footer from '@/src/components/ui/Footer';
import ToolsHeader from '@/src/components/ui/ToolsHeader';
import { redirect } from 'next/navigation'
import React from 'react'
import DashboardView from '../../../components/DashboardView';
import { parseIndustryInsightRow } from '@/src/constants';


const page = async() => {

  const { isOnboarded}  = await getUserOnboardingStatus();

  //if the user is not on boarded then push it to on boarding page
if(!isOnboarded){
  redirect("/tools/onboarding")
}

const row = await getIndustryInshights();  //since our db returns json thereofore we are converting into obj type
  return (
    <div className="container mx-auto">
     
      <DashboardView  insights={parseIndustryInsightRow(row)}
          lastUpdated={row.lastUpdated}
            nextUpdate={row.nextUpdate}/>
     
    </div>
  )
}

export default page
