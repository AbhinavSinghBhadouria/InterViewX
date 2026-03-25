"use client"
import React from 'react'
import { Button } from './ui/button'
import { Route, Sparkle } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"
import { Input } from './ui/input'
import { useRouter} from 'next/navigation'
import { generateRoadmap } from '../actions/generate-roadmap'

const GenerateRoadmapBtn = () => {
    const router=useRouter();
    const [dialog  , setDialog] = useState(false);
    const [roadmapTitle , setRoadmapTitle]=useState("");
    const [loading , setLoading]=useState(false);

    const onCreate=async ()=>{
         try {
             setLoading(true);
            const roadmap=await generateRoadmap(roadmapTitle);
            if(!roadmap) return null;

            router.push(`/tools/ai-roadmap-generator/${roadmap.id}`);
             setDialog(false);
           
           } catch (err) {
             console.error(err);
           } finally {
             setLoading(false);
           }
    }
  return (
   <>
     <Button className="w-full text-lg py-6 transition-all hover:scale-[1.02] mb-2 cursor-pointer bg-green-400" onClick={()=>setDialog(true)}>
      <Route className="h-4 w-4" /> Generate Roadmap
     </Button>

      <Dialog  open={dialog}>
 
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Roadmap</DialogTitle>
      <DialogDescription>
        <p>Add title for your Roadmap</p>
      <Input className="mt-2" placeholder="Eg, Full StacK Developer" onChange={(e)=>setRoadmapTitle(e.target.value)}/>
      </DialogDescription>
      <div className="flex justify-end ">
        <Button className="btn-secondary cursor-pointer" onClick={()=> setDialog(false)} >Cancel</Button>
        <Button className='btn-primary cursor-pointer' disabled={!roadmapTitle || loading} onClick={onCreate} ><Sparkle/>   {loading ? "Generating..." : "Generate"}</Button>
      </div>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </>
  )
}

export default GenerateRoadmapBtn
