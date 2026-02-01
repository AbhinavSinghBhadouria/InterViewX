
import ToolsHeader from '@/src/components/ui/ToolsHeader'
import ViewResumePage from "@/src/components/ViewResumePage";
import { getResumeById } from "@/src/actions/resume";


export default async function Page(props: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = await props.params;

  if (!resumeId) {
    throw new Error("Resume ID is missing");
  }

    const resume = await getResumeById(resumeId);

  if (!resume) {
    throw new Error("Resume not found");
  }

 
 

  return (
   
 <ViewResumePage resume={resume} resumeId={resumeId} />
 
  );
}
