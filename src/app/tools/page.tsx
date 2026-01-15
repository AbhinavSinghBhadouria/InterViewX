import React, { Suspense } from 'react'
import ToolsHeader from '@/src/components/ui/ToolsHeader'
import Footer from '@/src/components/ui/Footer'
import {BarLoader} from "react-spinners";


const page = ({children}) => {
  
  return (
   <>
     <ToolsHeader/>
       <div className="flex items-cneter justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Industry Analytics</h1>
       </div>
       <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="gray"/>}>
    {children}
       </Suspense>
  
     

     <Footer/>
    
  </>
    
  )
}

export default page
