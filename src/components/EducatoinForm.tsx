import { Input } from '@/components/ui/input'
import { useContext, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from './ui/button'
import { ResumeInfoContext } from '../context/ResumeInfoContest';
import { useEffect } from 'react';
import { saveResumeEducation } from '../actions/resume';
import { toast } from 'sonner';


type EducationEntry = {
  universityName: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
  description: string;
};


const defaultEducation: EducationEntry = {
  universityName: "",
  degree: "",
  major: "",
  startDate: "",
  endDate: "",
  description: "",
};

function EducatoinForm({enableNext}:any) {

   const context = useContext(ResumeInfoContext);
    
      if (!context) {
        throw new Error(
          "EducationForm must be used within ResumeInfoContext.Provider"
        );
      }
    
    const { resumeId , resumeInfo, setResumeInfo  } = context;

  const [educationalList, setEducationalList] = useState<EducationEntry[]>(
  resumeInfo?.educations?.length
    ? resumeInfo.educations
    : [defaultEducation]
);

  const onSave=async(e:any)=>{
    e.preventDefault();
  try {
    await saveResumeEducation(resumeId, educationalList);
    enableNext(true);
    toast.success("Education saved successfully");
  } catch (err) {
    console.error(err);
    toast.error("Failed to save education");
  }
  }

 useEffect(() => {
  setResumeInfo( (prev:any) => ({
    ...prev,
    educations: educationalList,
  }));
}, [educationalList]);


  const handleChange=( index: number,
  name: keyof EducationEntry,
  value: string
  ) => {
  const newList = [...educationalList];
  newList[index] = {
    ...newList[index],
    [name]: value,
  };
  setEducationalList(newList);
  }

  const AddNewEducation=()=>{
setEducationalList([...educationalList ,
{
   universityName:"" ,
    degree: ""  ,
    major:"" ,
    startDate : "" ,
    endDate:"" ,
    description : ""
}
])
  }

  const RemoveEducation=()=>{
  setEducationalList( (educationalList:any)=>educationalList.slice(0 ,-1));
  }
  return (
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10 shadow-gray-700">
      <h2 className="font-bold text-lg">Education</h2>
      <p>Add Your Educational Details</p>
      <div>
  {educationalList?.map((item:any ,index:number)=>(
          <div key={index}>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div className="col-span-2">
                <label>Univeristy Name</label>
                <Input name="universityName" value={educationalList[index].universityName}  onChange={(e)=>handleChange (index , e.target.name as keyof EducationEntry , e.target.value)} required></Input>
                </div>
                <div>
                <label>Degree</label>
                <Input required name="degree" value={educationalList[index].degree} onChange={(e)=>handleChange (index , e.target.name as keyof EducationEntry , e.target.value)} ></Input>
                </div> 

                 <div>
                <label>Major</label>
                <Input required  name="major" value={educationalList[index].major}  onChange={(e)=>handleChange (index , e.target.name as keyof EducationEntry , e.target.value)} ></Input>
                </div>

                 <div>
                <label>Start Date</label>
                <Input  required  name="startDate" value={educationalList[index].startDate}  type="date" onChange={(e)=>handleChange (index , e.target.name as keyof EducationEntry , e.target.value)} ></Input>
                </div>

                 <div>
                <label>End Date</label>
                <Input required  name="endDate" value={educationalList[index].endDate} type="date" onChange={(e)=>handleChange (index , e.target.name as keyof EducationEntry , e.target.value)} ></Input>
                </div>

                 <div className="col-span-2">
                <label>Description</label>
                <Textarea required  name="description" value={educationalList[index].description}  onChange={(e)=>handleChange (index , e.target.name as keyof EducationEntry , e.target.value)} ></Textarea>
                </div>

            </div>
          </div>
 ))}
      </div>

       <div className="flex justify-between">
              <div className='flex gap-2'>
                                <Button variant="outline" className='text-primary' onClick={RemoveEducation}>- Remove</Button>
                    <Button variant="outline" className='text-primary' onClick={AddNewEducation}>+ Add more</Button>
              </div>
      
              <Button  type="submit" onClick={onSave}> Save</Button>
              </div>
    </div>
  )
}

export default EducatoinForm

