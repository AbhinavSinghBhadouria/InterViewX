"use client"
import React from 'react'


const PersonalDetailPreview = ({resumeInfo}:any) => {
  
  return (
    <div className="text-black!">
        <h2 className='font-bold text-xl text-center text-black!' >{resumeInfo?.firstName} {resumeInfo?.lastName}</h2>
        <p className='text-center text-md font-medium text-black!'>{resumeInfo?.jobTitle}</p>
        <p className="text-center font-normal text-xs text-black!">{resumeInfo?.address}</p>

        <div className=" flex items-center justify-between ">
             <span className="text-xs">{resumeInfo?.phone}</span>
             <span className="text-xs">{resumeInfo?.email}</span>

        </div>
        <hr className="border-[1.5px] my-2 border-black!" />
    </div>
  )
}

export default PersonalDetailPreview
