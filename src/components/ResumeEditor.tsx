"use client";

import { useState } from "react";
import FormSection from "@/src/components/FormSection";
import ResumePreview from "@/src/components/ResumePreview";
import { ResumeInfoContext } from "@/src/context/ResumeInfoContest";

export default function ResumeEditor({ resume ,resumeId }: { resume: any , resumeId:string }) {
  const [resumeInfo, setResumeInfo] = useState(resume);
  

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo , resumeId }}>
      <div className=" grid grid-cols-1 md:grid-cols-2 p-10 gap-10 min-h-screen bg-black ">
        {/* Form section */}
        <FormSection />

        {/* Preview section */}
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  );
}
