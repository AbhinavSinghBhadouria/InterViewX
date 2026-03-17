"use client"
import { layoutNodes } from '../lib/dagre';

import { useState, useCallback   , useMemo} from 'react';
import { 
  ReactFlow, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge,
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlowProvider 
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TurboNode from './TurboNode';



const nodeTypes={
    turbo:TurboNode
}
const RoadmapCanvas = ({ initialNodes, initialEdges }: { initialNodes:any, initialEdges:any }) => {

const layoutedNodes = useMemo(() => {
  return layoutNodes(
    initialNodes?.map((node:any)=>({...node, type:"turbo"})) || [],
    initialEdges || []
  );
}, [initialNodes, initialEdges]);

const [nodes, setNodes] = useState(layoutedNodes);
const [edges, setEdges] = useState(initialEdges || []);

const onNodesChange = useCallback(
  (changes:any) => setNodes((nodesSnapshot:any) => applyNodeChanges(changes, nodesSnapshot)),
  [],
);

const onEdgesChange = useCallback(
  (changes:any) => setEdges((edgesSnapshot:any) => applyEdgeChanges(changes, edgesSnapshot)),
  [],
);

return (
<div className="rounded-lg" style={{ width: '100%', height: '100%' }}>
  <ReactFlow
    nodes={nodes}
    edges={edges}
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    fitView
    nodeTypes={nodeTypes}
    connectionLineType={ConnectionLineType.SmoothStep}
    defaultEdgeOptions={{
      type: 'smoothstep',
      style: { stroke: '#64748b', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
    }}
  >
    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    <Controls className="text-black" />
    <MiniMap />
    <MiniMap nodeColor={(node) => { if (node.type === 'turbo') return '#fde047'; // yellow-300 
     return '#e5e7eb'; // gray-200
      }}
       maskColor="rgba(0, 0, 0, 0.1)" style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', }} />
  </ReactFlow>
</div>
)
}

export default RoadmapCanvas