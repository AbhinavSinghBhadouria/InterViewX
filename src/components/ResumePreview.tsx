import React, { useContext } from 'react'
import { ResumeInfoContext } from '../context/ResumeInfoContest'
import PersonalDetailPreview from './PersonalDetailPreview';
import SummaryPreview from './SummaryPreview';
import ProfessionalExperiencePreview from './ProfessionalExperiencePreview';
import EducationPreview from './EducationPreview';
import SkillsPreview from './SkillsPreview';


const ResumePreview = () => {

      const context = useContext(ResumeInfoContext);

  if (!context) {
    throw new Error("FormSection must be used within ResumeInfoContext.Provider");
  }
    const {resumeInfo , setResumeInfo}=context;
  return (
    <div className="shadow-lg shadow-gray-700 h-full p-14 border-t-[20px] bg-white text-black " style={{border:resumeInfo?.themeColor}}>
        
        {/* Personal Summary */}
         <PersonalDetailPreview resumeInfo={resumeInfo}/>

{/* Summary */}

<SummaryPreview  resumeInfo={resumeInfo}/>


{/* Professonal Experience */}
<ProfessionalExperiencePreview  resumeInfo={resumeInfo}/>

{/* Education */}

<EducationPreview resumeInfo={resumeInfo}/>



{/* Skills */}

<SkillsPreview resumeInfo={resumeInfo}/>
        
     
      
    </div>
  )
}

export default ResumePreview
