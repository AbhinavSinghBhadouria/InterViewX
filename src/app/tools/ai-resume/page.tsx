import React from 'react'

import AddResume from '@/src/components/AddResume';
import { getResume } from '@/src/actions/resume';
import ResumeCardItem from '@/src/components/ResumeCardItem';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/src/components/ui/button";



const page = async() => {

    //getting teh resumes present in the db
    const resumes = await getResume(); 
     

  return (
    <>
    <Link href={"/authenticatedLandingPage"}>
                    <Button variant="link" className="gap-2  pl-0">
                      <ArrowLeft className="h-4 w-4"/>
                      Back to DashBoard
                      </Button>
                      </Link>

    <div className="p-10 md:px-20 lg:px-32 min-h-screen">
         <h1 className="text-6xl font-extrabold bg-linear-to-r from-blue-600 via-blue-500 to-cyan-300 bg-clip-text text-transparent mt-5 text-center">
           My Resume     
        </h1>
         <p className="font-bold text-center mt-2 text-3xl">Expore the AI Resume Studio to create resumes</p>
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10">
          <AddResume/>

           {resumes.map((resume  ,index) => (
         <ResumeCardItem resume={resume} key={index} />
        ))}
         </div>
    </div>
    </>
  )
}

export default page

