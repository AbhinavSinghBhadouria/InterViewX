"use client"
import React from 'react'
import RoadmapCanvas from './RoadmapCanvas';

const RoadmapViewer = ({roadmap}: {roadmap:any}) => {
 return (
    < div className="p-3">
      
    <div className="grid grid-cols-1 md:grid-cols-3 min-h-screen p-4 gap-2">
  


     <div className="bg-muted/80 p-4 w-fit h-fit rounded-lg space-y-1 ">
      <h2 className="text-yellow-300">{roadmap?.title}</h2>
      <p className="text-white text-xl"><div className="text-amber-500 font-bold">Description: </div>{roadmap?.description}</p>
      <p className="text-xl font-bold"><span className="text-amber-500">Duration: </span>{roadmap.duration}</p>
     </div>


     <div className="md:col-span-2 h-[80vh] w-full">
    <RoadmapCanvas initialNodes={roadmap?.nodes} initialEdges={roadmap?.edges} />
     </div>

    </div>
    </div>
  );

}

export default RoadmapViewer
