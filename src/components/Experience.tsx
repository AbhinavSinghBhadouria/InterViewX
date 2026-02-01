"use client"

import { useContext, useEffect } from 'react'
import { useState} from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import RichTextEditor from './RichTextEditor';
import { ResumeInfoContext } from '../context/ResumeInfoContest';
import { saveResumeExperience } from '../actions/resume';
import { toast } from 'sonner';


const formField={
    title: "" ,
    companyName:""  ,
    city:"" ,
    state:"" ,
    startDate:"" ,
    endDate: "" ,
    workSummary: ""
}

type ExperienceEntry = {
  title: string;
  companyName: string;
  city: string;
  state: string;
  startDate: string;
  endDate: string;
  workSummary: string;
};

function Experience({ enableNext }:any) {
     const context = useContext(ResumeInfoContext);
    
      if (!context) {
        throw new Error(
          "PersonalDetailForm must be used within ResumeInfoContext.Provider"
        );
      }
    
    const { resumeId , resumeInfo, setResumeInfo  } = context;
   const [experienceList, setExperiencelIst] = useState<ExperienceEntry[]>(
  resumeInfo?.experiences?.length ? resumeInfo.experiences : [formField]
);
   

  

const handleChange = (
  index: number,
  name: keyof ExperienceEntry,
  value: string
  ) => {
  const newList = [...experienceList];
  newList[index] = {
    ...newList[index],
    [name]: value,
  };
  setExperiencelIst(newList);
};



const AddNewExperience=()=>{
setExperiencelIst([...experienceList, { ...formField }])
    }

    const RemoveExperience=()=>{
       setExperiencelIst(experienceList=>experienceList.slice(0 ,-1)); 
    } 

    const handleRichTextEditor=(
    index: number,
  name: keyof ExperienceEntry,
  value: string
) => {
  const newList = [...experienceList];
  newList[index] = {
    ...newList[index],
    [name]: value,
  };
  setExperiencelIst(newList);
};
  

 

useEffect(() => {
  setResumeInfo( (prev:any) => ({
    ...prev,
    experiences: experienceList,
  }));
}, [experienceList]);

  

const onSave=async(e:any)=>{
  e.preventDefault();
      try{
       await saveResumeExperience(resumeId , experienceList);
        enableNext(true);
        toast.success("Changes saved successfully");
      }catch(err){
        console.error(err);
        toast.error("Error saving changes")
      }
};




  return ( 
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10 shadow-gray-700">
      <h2 className="font-bold text-lg">Professional Experience</h2>
      <p>Add Your Previous Job Experience</p>
      <div>
        {experienceList?.map((item:any , index:number)=>(
                <div key={index}>
                    <div className='grid grid-cols-2 gap-3 vorder p-3 my-5 rounded-lg'>
                        <div>
                            <label className="text-xs">Position Title</label>
                            <Input name="title" required   value={experienceList[index].title} onChange={(e:any)=>handleChange(index, e.target.name as keyof ExperienceEntry, e.target.value )}/>
                        </div>
                        <div>
                            <label className="text-xs">Company Name</label>
                            <Input name="companyName" required  value={experienceList[index].companyName} onChange={(e:any)=>handleChange(index, e.target.name as keyof ExperienceEntry, e.target.value)}/>
                        </div>
                        <div>
                            <label className="text-xs">City</label>
                            <Input name="city" required  value={experienceList[index].city} onChange={(e:any)=>handleChange(index, e.target.name as keyof ExperienceEntry, e.target.value)}/>
                        </div>
                        <div>
                            <label className="text-xs">State</label>
                            <Input name="state" required value={experienceList[index].state} onChange={(e:any)=>handleChange(index, e.target.name as keyof ExperienceEntry, e.target.value)}/>
                        </div>
                        <div>
                            <label className="text-xs">Start Date</label>
                            <Input type="date" required name="startDate" value={experienceList[index].startDate}  onChange={(e:any)=>handleChange(index, e.target.name as keyof ExperienceEntry, e.target.value)}/>
                        </div>
                        <div>
                            <label className="text-xs">End Date</label>
                            <Input type="date" required name="endDate" value={experienceList[index].endDate} onChange={(e:any)=>handleChange(index, e.target.name as keyof ExperienceEntry, e.target.value)}/>
                        </div>
                        <div className="col-span-2 w-full">
                           <RichTextEditor
  value={experienceList[index].workSummary}
  onChange={(value) => handleRichTextEditor(index, "workSummary", value)}
/>
                        </div>
                    </div>
                </div>
        ))}
       
      </div>
     
       <div className="flex justify-between">
        <div className='flex gap-2'>
                          <Button variant="outline" className='text-primary' onClick={RemoveExperience}>- Remove</Button>
              <Button variant="outline" className='text-primary' onClick={AddNewExperience}>+ Add more</Button>
        </div>

        <Button type="submit" onClick={onSave}> Save</Button>
        </div>

    </div>
  )
};


export default Experience
