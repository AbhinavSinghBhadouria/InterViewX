import React, { useState  ,useEffect , useContext} from 'react'
import { Input } from './ui/input'
import { ResumeInfoContext } from '../context/ResumeInfoContest';
import { Rating } from '@smastrom/react-rating'
import { Button } from './ui/button';
import { saveResumeSkills } from '../actions/resume';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'

import '@smastrom/react-rating/style.css'

type SkillEntry = {
  name: string;
  rating: number;
};

const defaultSkill: SkillEntry = {
  name: "",
  rating: 0,
};




const SkillsForm = ({enableNext}:any) => {
  const [rating, setRating] = useState(0) 
   const router=useRouter();
const context = useContext(ResumeInfoContext);

  if (!context) {
    throw new Error(
      "SkillsForm must be used within ResumeInfoContext.Provider"
    );
  }

  const { resumeInfo, setResumeInfo  , resumeId} = context;

  const [skillsList, setSkillsList] = useState<SkillEntry[]>(
    resumeInfo?.skills?.length ? resumeInfo.skills : [defaultSkill]
  );

  useEffect(() => {
    setResumeInfo((prev: any) => ({
      ...prev,
      skills: skillsList,
    }));
  }, [skillsList]);


    const handleChange = (
    index: number,
    name: keyof SkillEntry,
    value: any
  ) => {
    const newList = [...skillsList];
    newList[index] = {
      ...newList[index],
      [name]: value,
    };

    setSkillsList(newList);
  };


  const AddNewSkill=()=>{
   setSkillsList([...skillsList ,{
    name: "" ,
    rating:0
   }])
}
const RemoveSkill=()=>{
  setSkillsList(skillsList=>skillsList.slice(0 ,-1));

}

const onSave=async(e:any)=>{
e.preventDefault();
 try {
    await saveResumeSkills(resumeId, skillsList);
    enableNext(true);
    toast.success("Changes saved successfully")
  } catch (err) {
    console.error(err);
    toast.error("Error saving changes")
  }
}



    
  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10 shadow-gray-700">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Your Key Skills</p>

      <div>
        {skillsList?.map((item , index)=>(
            <div key={index} className="flex justify-between border rounded-lg p-3 mb-2">
                <div>
                    <label className="tex-xs mb-4">Name</label>
                    <Input  className="w-full" value={item.name} onChange={(e:any)=>handleChange(index , "name" ,e.target.value)}  />
                    </div>
                    <Rating style={{ maxWidth: 120 }} value={item.rating} onChange={(v:any)=>handleChange(index , "rating" , v)} />

                </div>
        ))}
      </div>
       <div className="flex justify-between">
                    <div className='flex gap-2'>
                                      <Button variant="outline" className='text-primary' onClick={RemoveSkill}>- Remove</Button>
                          <Button variant="outline" className='text-primary' onClick={AddNewSkill}>+ Add more</Button>
                    </div>
            
                    <Button  type="submit" onClick={onSave}> Save</Button>
                            <Button className="btn-primary" onClick={()=>router.push(`/my-resume/${resumeId}`)}>Finish</Button>
                    </div>
      </div>
  )
}

export default SkillsForm
