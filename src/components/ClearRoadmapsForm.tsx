"use client"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteAllRoadmaps } from "../actions/generate-roadmap";
import ClearRoadmapsButton from "./ClearRoadmapsButton";

const ClearRoadmapsForm = () => {
  const router = useRouter();

 async function action(){
    const res=await deleteAllRoadmaps();
    if(res?.success){
        toast.success("All Roadmaps Cleared Successfully!!")
    router.refresh();
  } else {
    toast.error(res?.error || "Couldn't delete the roadmaps")
  }

  }
  return (
   <form action={action}>
   <ClearRoadmapsButton/>
   </form>
  )
}

export default ClearRoadmapsForm
