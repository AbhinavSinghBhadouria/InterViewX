"use client"
import React from 'react'
import { ResumeInfoContext } from '@/src/context/ResumeInfoContest'
import { Button } from './ui/button'
import ResumePreview from './ResumePreview'
import { useState } from 'react'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'


const ViewResumePage = ({resume , resumeId}:{resume:any , resumeId:string}) => {
      const [resumeInfo, setResumeInfo] = useState(resume);

      const handleDownload=()=>{
        window.print();
      }

      const handleShare = async () => {
  if (navigator.share) {
    await navigator.share({
      title: "My Resume",
      text: "Check out my resume!",
      url: window.location.href,
    });
  } else {
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  }
};

  return (
     <ResumeInfoContext.Provider value={{resumeInfo , setResumeInfo ,resumeId}}>
    <div id="no-print">
        <Link href={"/tools/ai-resume"}>
            <Button variant="link" className="gap-2  pl-0">
              <ArrowLeft className="h-4 w-4"/>
              Back to Resume DashBoard
              </Button>
              </Link>

      <div className="my-10 mx-10 md:mx-20 ">
        <h2 className="text-center text-2xl font-medium">Congrats!! Your AI Generated Resume Is Ready.</h2>
        <p className="text-center">You’re all set! Download your resume now or share your unique resume link with friends and family.</p>
        <div className="flex justify-end gap-3 mx-44 my-10 w-">
          <Button onClick={handleDownload}>Download</Button>
          <Button onClick={handleShare}>Share</Button>
        </div>
        
      </div>
     
    </div>
    <div>
    <div id="print-area">
            <ResumePreview/>
        </div>
</div>
    </ResumeInfoContext.Provider>
  )
}

export default ViewResumePage
