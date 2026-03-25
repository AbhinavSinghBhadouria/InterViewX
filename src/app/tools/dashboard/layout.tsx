import React, { Suspense } from 'react'
import { ReactNode } from 'react'
import ClipLoader from "react-spinners/ClipLoader";
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft } from 'lucide-react';



//until the data for the children is fetched we will use loading indicator

export default function layout({children}:{ children: ReactNode }) {
  return ( 
   <>
  
    <div className="min-h-screen">
    <div className="px-5">
       <div className="flex items-center justify-center mb-5" >
        <h1 className="text-6xl font-extrabold bg-linear-to-r from-blue-600 via-blue-500 to-cyan-300 bg-clip-text text-transparent mt-5">
            Personalized Dashboard
        </h1>
        </div>
       
       <Suspense fallback={
         <div className="flex justify-center items-center min-h-100">
         <ClipLoader size={100} color="#ffffff"  />
           </div>
       }>
          {children}
        </Suspense>
    </div>
    </div>
  
    </>
  )
}

