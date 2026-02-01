import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { Brain } from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { useContext } from 'react'
import { ResumeInfoContext } from '../context/ResumeInfoContest'
import { useState } from 'react'
import { updateResumeSummary } from '../actions/resume'
import { toast } from 'sonner'
import { improveWithAI } from '../actions/resume'



const SummaryForm = ({enableNext}:any) => {

  
 

      const context = useContext(ResumeInfoContext);
  
    if (!context) {
      throw new Error(
        "PersonalDetailForm must be used within ResumeInfoContext.Provider"
      );
    }
  
    const { resumeId , resumeInfo, setResumeInfo  } = context;
    const [summary, setSummary] = useState(resumeInfo?.summary || "");
    
    useEffect(()=>{
            if (summary) {
       setResumeInfo({
      ...resumeInfo,
      summary: summary,
    });
  }
    } ,[summary])

    const onSave = async (e: any) => {
    e.preventDefault();
 
    try {
      await updateResumeSummary(resumeId, summary);
        enableNext(true);
      toast.success("Summary saved successfully");
    } catch (err) {
      toast.error("Failed to save summary");
      console.error(err);
    }
  };

  const onImprove=async()=>{

     if (!summary || summary.trim().length < 10) {
    toast.error("Please write at least a few lines before improving with AI");
    return;
  }
     
    try {
        console.log(summary);
    const improved = await improveWithAI(summary);
    
    setSummary(improved);           // update textarea
    toast.success("Summary improved with AI");
  } catch (err: any) {
    toast.error(err.message || "AI improvement failed");
  } 
  }
  return (
        <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10 shadow-gray-700">
      <h2 className="font-bold text-lg">Summary</h2>
      <p>Add summary for your job title</p>

      <form className="mt-7" onSubmit={onSave}>
       

<div className="flex justify-between items-end">
    <label>Add Summary</label>
    <Button   type="button" className="btn-primary" size="sm" onClick={onImprove}><Brain/> Improve with AI</Button>
</div>
 <Textarea className="mt-5" required value={summary} onChange={(e:any)=>setSummary(e.target.value)}/>
    <div className="flex justify-end gap-2">
        <Button className="mt-2">Save</Button>

    </div>
      </form>
      </div>
    
  )
}

export default SummaryForm
