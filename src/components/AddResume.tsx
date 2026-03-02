"use client"
import { PlusSquare } from 'lucide-react'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';
import { createResume } from '../actions/resume';

function AddResume() {

  const [openDialog , setOpenDialog]=useState(false);
  const[resumeTitle ,setResumeTitle]=useState("");
    const [loading, setLoading] = useState(false);
    const router=useRouter();

    const onCreate = async () => {
    try {
      setLoading(true);
      const resume = await createResume(resumeTitle);
      setOpenDialog(false);
      router.push(`/tools/ai-resume/${resume.id}/edit`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <div className="p-14 mt-4 mb-4 ml-5 mr-5 flex items-center justify-center bg-white/50 rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dashed" onClick={()=> setOpenDialog(true)} >
            <PlusSquare className='text-black'/>
      </div>
      <p className="text-center">Create New Resume</p>

      <Dialog  open={openDialog}>
 
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create new Resume</DialogTitle>
      <DialogDescription>
        <p>Add a title for your new Resume</p>
      <Input className="mt-2" placeholder="Eg, Full Stack Resume" onChange={(e)=>setResumeTitle(e.target.value)}/>
      </DialogDescription>
      <div className="flex justify-end ">
        <Button className="btn-secondary cursor-pointer" onClick={()=> setOpenDialog(false)} >Cancel</Button>
        <Button className='btn-primary cursor-pointer' disabled={!resumeTitle || loading} onClick={onCreate} >   {loading ? "Creating..." : "Create"}</Button>
      </div>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </div>
  )
}

export default AddResume
