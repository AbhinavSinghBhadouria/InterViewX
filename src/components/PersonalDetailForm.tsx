"use client";

import React, { useContext } from 'react'
import { ResumeInfoContext } from '../context/ResumeInfoContest';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { updateResumePersonalDetails } from '../actions/resume';


const PersonalDetailForm = ({enableNext}:any) => {

    const context = useContext(ResumeInfoContext);

  if (!context) {
    throw new Error(
      "PersonalDetailForm must be used within ResumeInfoContext.Provider"
    );
  }

  const { resumeId , resumeInfo, setResumeInfo  } = context;
  const handleInputChange=(e:any)=>{
   const {name ,value} = e.target;
  setResumeInfo((prev:any) => ({
  ...prev,
  [name]: value
}));
  }



  const onSave=async(e:any)=>{
     e.preventDefault(); //restricting auto refersh offered by the browser
    

     try{
        await updateResumePersonalDetails(
      resumeId, {
      firstName: resumeInfo.firstName,
      lastName: resumeInfo.lastName,
      jobTitle: resumeInfo.jobTitle,
      address: resumeInfo.address,
      phone: resumeInfo.phone,
      email: resumeInfo.email,
     });

      enableNext(true);
      toast.success("Changes saved successfully");

     }catch(err){
    toast.error("Failed to save details");
    console.error(err);
     }
   
  }

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10 shadow-gray-700">
      <h2 className="font-bold text-lg">Personal Detail</h2>
      <p>Get Started With Basic Information</p>

   <form onSubmit={onSave} method="post" >
    <div className="grid grid-cols-2 mt-5 gap-3">
        <div>
            <label className="text-sm">First Name</label>
            <Input name="firstName" defaultValue={resumeInfo?.firstName} required onChange={handleInputChange} className="mt-2"/>
        </div>
           <div>
            <label className="text-sm">Last Name</label>
            <Input name="lastName" required onChange={handleInputChange} defaultValue={resumeInfo?.lastName} className="mt-2"/>
        </div>
           <div className='col-span-2'>
            <label className="text-sm">Job Title Name</label>
            <Input name="jobTitle" required onChange={handleInputChange} defaultValue={resumeInfo?.jobTitle}  className="mt-2"/>
        </div>
          <div className='col-span-2'>
            <label className="text-sm">Address</label>
            <Input name="address" required onChange={handleInputChange} defaultValue={resumeInfo?.address} className="mt-2"/>
        </div>
         <div>
            <label className="text-sm">Phone</label>
            <Input name="phone" required onChange={handleInputChange} defaultValue={resumeInfo?.phone} className="mt-2"/>
        </div>
           <div>
            <label className="text-sm">Email</label>
            <Input name="email" required onChange={handleInputChange} defaultValue={resumeInfo?.email} className="mt-2"/>
        </div>
    </div>
    <div className="mt-3 flex justify-end"><Button type="submit">Save</Button></div>
   </form>
    </div>
  )
}

export default PersonalDetailForm
