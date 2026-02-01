import { getResumeById } from "@/src/actions/resume";
import ResumeEditor from "@/src/components/ResumeEditor";



export default async function Page(props: {
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = await props.params;

  if (!resumeId) {
    throw new Error("Resume ID is missing");
  }

  const resume= await getResumeById(resumeId);

  console.log(resume);
 
 

  return (
   
    <>
    
    <ResumeEditor resume={resume} resumeId={resumeId} />
 </>
  );
}
