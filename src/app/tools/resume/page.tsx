import React from 'react'
import { getResume } from '@/src/actions/resume';
import ResumeBuilder from '@/src/components/ResumeBuilder';
import { checkUser } from '@/src/lib/checkUser';
import { redirect } from 'next/navigation';


const page = async() => {
    const resume=await getResume();
    const user = await checkUser();
    if(!user) redirect("/login")
    
  return (
    <div className="container mx-auto py-6 min-h-screen">
      <ResumeBuilder initialContent={resume?.content}  user={user}/>
    </div>
  )
}

export default page
