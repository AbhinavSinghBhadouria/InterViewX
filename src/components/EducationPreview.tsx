import React from 'react'

const EducationPreview = ({resumeInfo}:any) => {
  return (
   
       <div className="my-6 text-black!">
        <h3 className="text-center font-bold text-sm mb-2 text-black!" style={{color:resumeInfo?.themeColor}}>
            Education
        </h3>
       <hr className="border-[1.5px] my-2 border-black! text-black!" />

        {resumeInfo?.educations?.map((education:any ,index:number)=>(
     <div key={index} className="my-5" >
        <p className="text-sm font-bold text-black!" style={{color: resumeInfo?.themeColor}}>{education.universityName}</p>
        <p className="text-xs justify-between text-black!">{education?.degree} in {education.major}
        <span>{education?.startDate} - {education?.endDate}</span>
        </p>
       
        <p className="text-sm text-black!">
     {education?.description}
        </p>
         </div>
        ))}
 </div>
 
  )
}

export default EducationPreview
