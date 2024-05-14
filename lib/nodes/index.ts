import type { Edge, Node, NodeTypes } from "reactflow";
import { PositionLoggerNode } from "./PositionLoggerNode";
import {SpaceInfo, getSpacesFlow } from "../db";
import { generateConnections } from "../edges";

const generateNodes = (spaces:SpaceInfo[]) => {
  const nodes : Node[] = [];
  const processedSpaces = new Set(); // To keep track of processed spaces

  const traverseSpaces = (space:SpaceInfo, level:number) => {
    const nodeId = space.ID.toString();

    // Check if space has already been processed
    if (processedSpaces.has(nodeId)) {
      return;
    }

    // Calculate x position based on the number of nodes at the same level
    const siblingsAtLevel = nodes.filter(node => node.position.y === level * 100);
    const xGap = 300;
    const xOffset = (siblingsAtLevel.length * xGap) - (xGap * siblingsAtLevel.length / 2);
    const node = {
      id: nodeId,
      data: { label: space.Name },
      position: { x: xOffset, y: level * 100 }, // Adjust position based on level and x offset
    };

    nodes.push(node);
    processedSpaces.add(nodeId);

    if (space.Devices && space.Devices.length > 0) {
      space.Devices.forEach((device) => {
        const deviceId = `device-${device.ID}`;
        const deviceNode = {
          id: deviceId,
          data: { label: device.Name },
          position: { x: xOffset + xGap, y: (level + 1) * 100 }, // Adjust device position based on level and x offset
        };

        nodes.push(deviceNode);
      });
    }

    if (space.SubSpaces && space.SubSpaces.length > 0) {
      space.SubSpaces.forEach((subSpace) => {
        traverseSpaces(subSpace, level + 1); // Increment level for subspaces
      });
    }
  };

  spaces.forEach((space) => {
    traverseSpaces(space, 0); // Start traversal with level 0
  });

  return nodes;
};


export async function initSpaces() : Promise<{reactFlowNodes: Node[], connections: Edge[]}>{
    const spaces : SpaceInfo[] = await getSpacesFlow()
    if (spaces.length > 0) {
      const reactFlowNodes = generateNodes(spaces);
      const connections = generateConnections(spaces);
      return {reactFlowNodes, connections}
    } else return {reactFlowNodes:[], connections:[]}

}

export const testInit = [
  { id: '2', data: { label: 'Floor 1' }, position: { x: 0, y: 0 } },
  {
    id: '3',
    data: { label: 'Floor 2', parentId: '2' },
    position: { x: 0, y: 100 }
  },
  {
    id: '12',
    data: { label: 'Classroom 202', parentId: '3' },
    position: { x: 0, y: 200 }
  },
  {
    id: '4',
    data: { label: 'Floor 3', parentId: '2' },
    position: { x: 150, y: 100 }
  },
  {
    id: '8',
    data: { label: 'Classroom 301', parentId: '4' },
    position: { x: 150, y: 200 }
  },
  {
    id: 'device-1',
    data: { label: 'Smart lock', parentId: '8' },
    position: { x: 450, y: 300 }
  },
  {
    id: '6',
    data: { label: 'Classroom 110', parentId: '2' },
    position: { x: 300, y: 100 }
  },
  {
    id: '11',
    data: { label: 'Classroom 201', parentId: '2' },
    position: { x: 450, y: 100 }
  },
  {
    id: '13',
    data: { label: 'Classroom 204', parentId: '2' },
    position: { x: 600, y: 100 }
  }
] satisfies Node[]


export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;
