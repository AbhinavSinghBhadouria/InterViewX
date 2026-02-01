import React from 'react'

const ProfessionalExperiencePreview = ({resumeInfo}:any) => {
  return (
    <div className="my-6">
        <h3 className="text-center font-bold text-sm mb-2" style={{color:resumeInfo?.themeColor}}>
            Professional Experience
        </h3>
       <hr className="border-[1.5px] my-2 border-black!" />

        {resumeInfo?.experiences?.map((experience :any , index:number)=>{
          return (
                  <div key={index} className='my-2 text-black!'>
                      <p className="text-sm font-bold text-black!">{experience.title}</p>
                      <p className="text-xs flex justify-between text-black!">{experience?.companyName} ,
                         {experience?.city} ,
                          {experience?.state}
                          <span>{experience?.startDate} To {experience?.currentlyWorking ? "Present":experience?.endDate}</span></p>

                         
                         <div className= "resume-preview text-black! text-xs!" dangerouslySetInnerHTML={{__html:experience?.workSummary}}/>
                          
                    </div>

          )

        })}
      
    </div>
  )
}

export default ProfessionalExperiencePreview
