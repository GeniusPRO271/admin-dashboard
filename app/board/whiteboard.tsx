'use client';
import { useCallback, useState } from 'react';
import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  OnConnect,
  Node,
  Edge,
  Panel
} from 'reactflow';

import 'reactflow/dist/style.css';

import { nodeTypes } from '../../lib/nodes';
import { edgeTypes } from '../../lib/edges';
import AllowedUserTableView from './allowed-user-table';
import { ArrowLeft } from '@/components/icons';
import { useRouter } from 'next/navigation';

export default function WhiteBoard({
  reactFlowNodes,
  reactFlowConnections
}: {
  reactFlowNodes: Node[];
  reactFlowConnections: Edge[];
}) {
  const [nodes, , onNodesChange] = useNodesState<Node>(reactFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowConnections);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  const [selectedNode, setSelectedNode] = useState<string>();
  const [showPanel, setShowPanel] = useState<boolean>(false);
  function onNodeClickHandler(e: any, node: Node) {
    console.log(node);
    setSelectedNode(node.id);
    setShowPanel(true)
  }
  const router = useRouter()
  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      edges={edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClickHandler}
      fitView
    >
      <Background />
      <Controls />
      <Panel position="top-left">
        <div className='border-transparent border rounded-lg bg-slate-200 p-2 cursor-pointer' onClick={() => router.back()}>
            <ArrowLeft/>
        </div>
      </Panel>
      {selectedNode && showPanel && (
        <Panel position="bottom-right" className="h-3/6 w-fit">
          <div className={`w-fit h-full text-right`}>
            <span className='cursor-pointer bg-white ' onClick={() => setShowPanel(false)}>
              x
            </span>
            <AllowedUserTableView spaceId={selectedNode} />
          </div>
        </Panel>
      )}
    </ReactFlow>
  );
}
