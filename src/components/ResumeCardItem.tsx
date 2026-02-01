"use client"
import {  MoreVertical, Notebook, Pen } from 'lucide-react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from 'react'
import { toast } from 'sonner'
import { deleteResumeById } from '../actions/resume'


function ResumeCardItem({resume}:any) {
  const router=useRouter();
   const [openAlert , setOpenAlert]=useState(false);

const handleEdit=()=>{
router.push(`/tools/ai-resume/${resume.id}/edit`);
}
const onDelete=async()=>{
    try {
    await deleteResumeById(resume.id);
    toast.success("Resume deleted successfully");
    setOpenAlert(false);
    router.refresh(); 
  } catch {
    toast.error("Failed to delete resume");
  }
}
  return (
   
    <div className="p-14 mb-5 mt-5 bg-linear-to-b from-blue-200 via bg-blue-500 to-blue-900 ml-5 mr-5  h-[280px] rounded-lg hover:scale-105 transition-all hover:shadow-md">
      <div className="flex items-center justify-center">
      <img src="/resume.png" width={150} height={150}/>
</div>
<div className="bg-blue-950 p-4 mt-10 rounded-lg flex justify-between">
 <h1 className="text-center font-bold">{resume.title}</h1> 
 <DropdownMenu>
  <DropdownMenuTrigger asChild>
     <MoreVertical className="h-4 w-4 cursor-pointer"/>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    
       <DropdownMenuItem onClick={()=>router.push(`/my-resume/${resume.id}`)}>View</DropdownMenuItem>
       <DropdownMenuItem onClick={()=>setOpenAlert(true)}>Delete</DropdownMenuItem>
      <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
      <DropdownMenuItem onClick={()=>router.push(`/my-resume/${resume.id}`)}>Download</DropdownMenuItem>
    
  </DropdownMenuContent>



</DropdownMenu>



<AlertDialog open={openAlert}>
  
    
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete this resume.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={()=>setOpenAlert(false)}>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


</div>
    </div>
      
  
  )
}

export default ResumeCardItem
