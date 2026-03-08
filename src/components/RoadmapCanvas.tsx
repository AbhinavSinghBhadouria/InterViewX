"use client"

import { useState, useCallback } from 'react';
import { 
  ReactFlow, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TurboNode from './TurboNode';


const nodeTypes={
    turbo:TurboNode
}

const RoadmapCanvas = ({initialNodes , initialEdges}:{initialNodes:any   , initialEdges:any}) => {


   const [nodes, setNodes] = useState(
    initialNodes?.map((node: any) => ({ ...node, type: 'turbo' })) || []
  );
  const [edges, setEdges] = useState(initialEdges || []);
 
  const onNodesChange = useCallback(
    (changes:any) => setNodes((nodesSnapshot:any) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes:any) => setEdges((edgesSnapshot:any) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params:any) => setEdges((edgesSnapshot:any) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <div  className="rounded-lg" style={{ width: '100%', height: '100%' }}>
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
      >
       
     
        {/* @ts-ignore */}
        <Background variant="dots" gap={12}  size={1} />
        <Controls className="text-black" />
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === 'turbo') return '#fde047'; // yellow-300
            return '#e5e7eb'; // gray-200
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
          }}
        />
        </ReactFlow>
        </ReactFlowProvider>
    </div>
  )
}

export default RoadmapCanvas
