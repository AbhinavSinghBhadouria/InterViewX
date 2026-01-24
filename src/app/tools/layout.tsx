import Footer from '@/src/components/ui/Footer'
import ToolsHeader from '@/src/components/ui/ToolsHeader'
import React from 'react'
import { ReactNode } from 'react'


const layout = ({children}:{children:ReactNode}) => {
  return (
    <div>
      <ToolsHeader/>
      {children}
      <Footer/>
    </div>
  )
}

export default layout
