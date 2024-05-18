'use client';
import { useCallback, useMemo, useState } from 'react';
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

import { edgeTypes } from '../../../lib/edges';
import AllowedUserTableView from './allowed-user-table';
import { TextUpdaterNode } from 'app/dashboard/board/custome-node';
import { Users } from 'lucide-react';

export default function WhiteBoard({
  reactFlowNodes,
  reactFlowConnections
}: {
  reactFlowNodes: Node[];
  reactFlowConnections: Edge[];
}) {
  const [nodes, , onNodesChange] = useNodesState<Node>(reactFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowConnections);
  const nodeTypes = useMemo(() => ({ nodeStyle: TextUpdaterNode }), []);
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  const [selectedNode, setSelectedNode] = useState<string>();
  const [showPanel, setShowPanel] = useState<boolean>(false);
  function onNodeClickHandler(e: any, node: Node) {
    console.log(node);
    setSelectedNode(node.id);
    setShowPanel(true);
  }
  return (
    <>
      <ReactFlow
        contentEditable={false}
        draggable={false}
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        edgeTypes={edgeTypes}
        onNodeClick={onNodeClickHandler}
        onNodesChange={onNodesChange}
        fitView
      >
        <Background />
      </ReactFlow>
      <div className="absolute bottom-0 z-30 overflow-y-hidden pointer-events-none h-2/4 right-4 w-[600px]">
        <div
          className="absolute top-0 right-0 bottom-0 h-full rounded-t-lg border-t border-l border-r overflow-hidden pointer-events-auto bg-card w-full"
          style={{
            transform: showPanel
              ? 'none'
              : 'translateY(calc(100% - 42px)) translateZ(0px)',
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <button
            className="flex items-center py-2 px-4 w-full text-left"
            onClick={() => setShowPanel(false)}
          >
            <div
              className="icon-container icon-md text-2xl"
              aria-hidden="true"
            >
              <Users className=' text-pink-500'/>
            </div>
            <p className="text-base ml-2">User List</p>
            <div
              className="text-current icon-container icon-md text-2xl ml-auto"
              aria-hidden="true"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: showPanel ? 'rotate(0deg)' : 'rotate(180deg)',
                  transition: 'transform 0.3s ease-in-out'
                }}
              >
                <path d="m18 15-6-6-6 6"></path>
              </svg>
            </div>
          </button>
          {selectedNode && showPanel && (
            <AllowedUserTableView spaceId={selectedNode} />
          )}
        </div>
      </div>
    </>
  );
}
