"use client"
import React from 'react'
import PersonalDetailForm from './PersonalDetailForm'
import { Button } from './ui/button'
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react'
import { useState } from 'react'
import { useEffect } from 'react'
import SummaryForm from './SummaryForm'
import Experience from './Experience'
import EducatoinForm from './EducatoinForm'
import SkillsForm from './SkillsForm'


const FormSection = () => {
  
  const [activeFormIndex , setActiveFormIndex]=useState(1);
  const [enableNext ,setEnableNext]=useState(false);

  useEffect(() => {
  setEnableNext(false);
}, [activeFormIndex]);


  return (
    <div>
      

      <div className="flex items-center justify-between ">
       

      <div className="flex w-full justify-end gap-2 ">
        {activeFormIndex >1 
        && <Button size="sm" className="cursor-pointer" onClick={()=>setActiveFormIndex(activeFormIndex-1)}> <ArrowLeft/> Back</Button>}
         {activeFormIndex!==5 && <Button className="flex gap-2 cursor-pointer" size="sm" onClick={()=>setActiveFormIndex(activeFormIndex+1)} disabled={!enableNext}> Next <ArrowRight/></Button> }


        </div>

        </div>
     {/* Personal Detail */}
     {activeFormIndex===1 ? <PersonalDetailForm enableNext={(v:any)=>setEnableNext(v)}/> :null}

     {/* summary */}
   
   {activeFormIndex==2 ? <SummaryForm enableNext={(v:any)=>setEnableNext(v)} />:null}

     {/* experience */}
{activeFormIndex===3 ? <Experience enableNext={(v:any)=>setEnableNext(v)} />:null}
     {/* educational Detail */}


{activeFormIndex===4 ? <EducatoinForm enableNext={(v:any)=>setEnableNext(v)} /> :null }
     {/* skills */}

     {activeFormIndex==5 ? <SkillsForm enableNext={(v:any)=>setEnableNext(v)} /> :null}
    </div>
  )
}

export default FormSection
