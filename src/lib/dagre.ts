import dagre from "dagre";

const nodeWidth = 260;
const nodeHeight = 140;

export function layoutNodes(nodes:any, edges:any) {

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: "TB", // Top -> Bottom roadmap
    nodesep: 80,
    ranksep: 120
  });

  nodes.forEach((node:any) => {
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight
    });
  });

  edges.forEach((edge:any) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node:any) => {
    const pos = dagreGraph.node(node.id);

    node.position = {
      x: pos.x - nodeWidth / 2,
      y: pos.y - nodeHeight / 2
    };

    return node;
  });
}