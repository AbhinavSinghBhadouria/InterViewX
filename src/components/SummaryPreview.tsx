import React from 'react'

const SummaryPreview = ({resumeInfo}:any) => {
  return (
   <p className="text-sm text-black!">
    {resumeInfo?.summary}
   </p>
  )
}

export default SummaryPreview
