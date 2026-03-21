import { getUserOnboardingStatus } from '@/src/actions/user'
import Footer from '@/src/components/ui/Footer'
import ToolsHeader from '@/src/components/ui/ToolsHeader'
import React from 'react'
import { ReactNode } from 'react'


const layout = async({children}:{children:ReactNode}) => {
  const {isOnboarded}=await getUserOnboardingStatus();
  return (
    <div>
      <ToolsHeader isOnboarded={isOnboarded}/>
      {children}
      <Footer/>
    </div>
  )
}

export default layout
