
import { Handle, Position } from '@xyflow/react'
import Link from 'next/link'
import React from 'react'

const TurboNode = ({data}:any) => {
  return (
    <div className="rounded-lg border-gray-300 bg-yellow-300 shadow-md p-4 w-64">
      <div className="font-bold text-lg text-red-500">{data.title}</div>
      <p className="text-sm text-black! mt-1 ">{data.description}</p>
      <Link href={data.link} target="_blank" className="text-blue-600 mt-2 underline inline-block">Learn more</Link>
      <Handle type="target" position={Position.Top}/>
        <Handle type="source" position={Position.Bottom}/>


</div>
  )
}

export default TurboNode
