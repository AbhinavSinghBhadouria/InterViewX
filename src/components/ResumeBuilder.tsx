"use client"

import { Download, Save } from "lucide-react"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" 
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { resumeSchema } from '../schema/schema';
import {useForm} from "react-hook-form";
import useFetch from '../hooks/use-fetch';
import { saveResume } from "../actions/resume"
import { useEffect } from "react"
import { Input } from "./ui/input"
import { Controller } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import EntryForm from "./EntryForm"
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Edit } from "lucide-react"
import { Monitor } from "lucide-react"
import { AlertTriangle } from "lucide-react"
import MDEditor from "@uiw/react-md-editor";
import { entriesToMarkdown } from "../lib/helper"
import "../styles/pdf-reset.css"








type PreviewType = "preview" | "edit";


const ResumeBuilder = ({initialContent , user}:any) => {

    const [activeTab , setActiveTab]=useState("edit");  //states for tabs
    const [resumeMode , setResumeMode]=useState<PreviewType>("preview")
    const [previewContent , setPreviewContent]=useState(initialContent);
    const [isGenerating , setIsGenerating]=useState(false);
    
    

   
  const { control, register, handleSubmit, watch, formState:{ errors }} = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  
  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  //for preview

  const formValues=watch();


  useEffect(()=>{
    if(initialContent) setActiveTab("preview")
 
} ,[initialContent])





useEffect(() => {
  const newContent = getCombinedContent();
  setPreviewContent(newContent || initialContent);
}, [formValues ,initialContent]);

//------------------------------------------------------------------------------------------------------------------------------------------------

//FUNCTION FOR CONVERTING THE FORM DATA INTO MARKDOWN FORM

const getContactMarkdown=()=>{
   const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user?.name}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`
      : "";
  };




const getCombinedContent=()=>{
const {summary , skills, experience , education ,projects}=formValues;


return [
    getContactMarkdown(),
      summary && ` Professional Summary\n\n${summary}`,
      skills && ` Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");


};

//----------------------------------------------------------------------------------------------------------------------------------------


const onSubmit = async () => {
    try {
      const formattedContent = previewContent
        .replace(/\n/g, "\n") // Normalize newlines
        .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines
        .trim();

      console.log(previewContent, formattedContent);
      await saveResumeFn(formattedContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

//-------------------------------------------------------------------------------------------------------------------------------------------------------



const generatePDF = async () => {
  setIsGenerating(true);

  try {
    if (typeof window === "undefined") return;

    // calling the API route to generate PDF server-side using Playwright
    const response = await fetch("/api/resume/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Failed to generate PDF" }));
      throw new Error(errorData.error || "Failed to generate PDF");
    }

    // get the PDF blob
    const blob = await response.blob();
    
    // create a download link and trigger download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    document.body.appendChild(a);
    a.click();
    
    // now we will perform the cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("PDF generation error:", error);
    alert(`Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
  } finally {
    setIsGenerating(false);
  }
};



  return (
    <div className="space-y-4 p-6">
       <h1 className="text-6xl font-extrabold bg-linear-to-r from-blue-600 via-blue-500 to-cyan-300 bg-clip-text text-transparent mt-5 text-center">
           AI RESUME STUDIO
        </h1>
    <div  className="flex flex-col md:flex-row justify-between items-center gap-2">
     

     <Link href={"/authenticatedLandingPage"}>
      <Button variant="link" className="gap-2  pl-0">
        <ArrowLeft className="h-4 w-4"/>
        Back to DashBoard
        </Button>
        </Link>


      <div className="space-x-2">
        <Button  className="bg-green-600 hover:bg-green-800" onClick={onSubmit} disabled={isSaving}>
                      {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 font-bold text-white" />
                <span className="font-bold text-white"> Save</span>
              </>
            )}  
        </Button>

           <Button  className="bg-yellow-300 hover:bg-yellow-700" onClick={generatePDF} disabled={isGenerating}>
                      {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading PDF...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 font-bold text-blue-700" />
                <span className="font-bold text-blue-700"> Download PDF</span>
              </>
            )}  
        </Button>


      </div>
    </div>



<Tabs value={activeTab} onValueChange={setActiveTab}  >
  <TabsList>
    <TabsTrigger value="edit">Resume Form</TabsTrigger>
    <TabsTrigger value="preview">Live Preview</TabsTrigger>
  </TabsList>
  <TabsContent value="edit">
    <form className="bg-black p-10 rounded-lg m-4 space-y-8 " onSubmit={handleSubmit(onSubmit)}>

        <div className="space-y-4">
        <h3 className="text-lg font-medium mb-3">Contact information</h3>
        <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-black">
        <div className="space-y-2">
        <label className="text-sm font-medium" >Email</label>

        <Input
        {...register("contactInfo.email")}
        type="email"
        className="mt-2 mb-2"
        placeholder="you@email.com" />

        {errors.contactInfo?.email && (
            <p className="text-sm text-red-500!">
                {errors.contactInfo.email.message}
            </p>
        )}
</div>


<div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+1 234 567 8900"
                   className="mt-2 mb-2"
                  />
                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-500!">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>



<div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    {...register("contactInfo.linkedin")}
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                    className="mt-2 mb-2"
                  />
                  {errors.contactInfo?.linkedin && (
                    <p className="text-sm text-red-500!">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>


                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Twitter / X Profile
                  </label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type="url"
                    placeholder="https://twitter.com/your-handle"className="mt-2 mb-2"
                  />
                  {errors.contactInfo?.twitter && (
                    <p className="text-sm text-red-500!">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>
</div>
 </div>


 {/* //SUMMARY */}

      <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling professional summary..."
                    
                  />
                )}
              />
              {errors.summary && (
                <p className="text-sm text-red-500!">{errors.summary.message}</p>
              )}
            </div>


     {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your key skills..."
                  
                  />
                )}
              />
              {errors.skills && (
                <p className="text-sm text-red-500!">{errors.skills.message}</p>
              )}
            </div>


  {/* Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Experience"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.experience && (
                <p className="text-sm text-red-500!">
                  {errors.experience.message}
                </p>
              )}
            </div>

                        {/* Education * */}
             <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Education"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.education && (
                <p className="text-sm text-red-500!">
                  {errors.education.message}
                </p>
              )}
            </div>


                 {/* Projects */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Project"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.projects && (
                <p className="text-sm text-red-500!">
                  {errors.projects.message}
                </p>
              )}
            </div>


    </form>
    </TabsContent>


   <TabsContent value="preview">
 {activeTab === "preview" && (
            <Button
              variant="link"
              type="button"
              className="mb-2"
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
            >
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Resume
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" />
                  Show Preview
                </>
              )}
            </Button>
          )}


        {activeTab === "preview" && resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose editied markdown if you update the form data.
              </span>
            </div>
          )}

          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
            />
          </div>

          <div className="hidden">
  <div
    id="resume-pdf"
  >
    <MDEditor.Markdown
      source={previewContent}

    />
  </div>
</div>

  </TabsContent> 
</Tabs>
    </div>



    
   
  )
}

export default ResumeBuilder
