import React from 'react'


const SkillsPreview = ({resumeInfo}:any) => {
 return (
    <div className="my-6">
      <h3
        className="text-center font-bold text-sm mb-2"
        style={{ color: resumeInfo?.themeColor }}
      >
        Skills
      </h3>

      <hr className="border-[1.5px] my-2 !border-black" />

      <div className="grid grid-cols-2 py-3 my-4 gap-4">
        {resumeInfo?.skills?.map((skill: any, index: number) => (
          <div key={index} className="flex items-center justify-between w-full">
            <p className="text-xs !text-black font-bold">{skill?.name}</p>

            {/* Gray background */}
            <div className="h-2 w-[120px] rounded !bg-gray-400 overflow-hidden">
              {/* Black fill */}
              <div
                className="h-full !bg-black transition-all duration-300"
                style={{ width: `${(skill.rating / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

}

export default SkillsPreview
