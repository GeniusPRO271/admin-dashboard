import type { Edge, Node, NodeTypes } from "reactflow";
import { PositionLoggerNode } from "./PositionLoggerNode";
import {SpaceInfo, getSpacesFlow } from "../db";
import { generateConnections } from "../edges";


function arrangeNodes(roots: SpaceInfo[]): Node[] {
  const nodes: Node[] = [];
  let prevDimensions: { width: number, height: number } = { width: 0, height: 0 };

  roots.forEach((root, rootIndex) => {
    const buildingNodes = traverse(root, 0, rootIndex, prevDimensions);
    nodes.push(...buildingNodes);
  });

  return nodes;
}

function traverse(space: SpaceInfo, depth: number, rootIndex: number, prevDimensions: { width: number, height: number }): Node[] {
  const nodes: Node[] = [];

  const nodeId = space.ID.toString();
  const parentId = space.ParentSpaceID ? space.ParentSpaceID.toString() : undefined;
  const x = prevDimensions.width + rootIndex * 200 + 80;
  const y = depth * 100;

  nodes.push({ id: nodeId, type: 'nodeStyle', data: { label: space.Name, parentId }, position: { x, y } });

  let subWidth = 0;
  let subHeight = 0;

  if (space.SubSpaces) {
    let yOffset = y + 100; // Initial y-offset for child nodes
    space.SubSpaces.forEach(subSpace => {
      const subNodes = traverse(subSpace, depth + 1, rootIndex, prevDimensions);
      nodes.push(...subNodes);

      // Update subWidth to accommodate the widest child node
      const subSpaceWidth = subNodes[subNodes.length - 1].position.x + 100 - x;
      if (subSpaceWidth > subWidth) {
        subWidth = subSpaceWidth;
      }

      // Update subHeight to accommodate the total height of child nodes
      const lastSubNode = subNodes[subNodes.length - 1];
      const subSpaceHeight = lastSubNode.position.y + 100 - y;
      if (subSpaceHeight > subHeight) {
        subHeight = subSpaceHeight;
      }

      // Update y-offset for the next child nodes
      yOffset = Math.max(yOffset, lastSubNode.position.y + 100);
    });


  } else {
    subWidth = 100;
    subHeight = 100;
  }

  if (space.Devices && space.Devices.length > 0) {
    const deviceY = (depth + 1) * 100; // Place devices one level below subspaces
    space.Devices.forEach(device => {
      const deviceNode = {
        id: 'device-' + device.ID.toString(),
        type: 'deviceNode',
        data: { label: device.Name, parentId: nodeId },
        position: { x: x, y: deviceY }
      };
      nodes.push(deviceNode);
    });
  }
  
  // Update prevDimensions with the dimensions of the current rectangle
  prevDimensions.width = x + subWidth;
  prevDimensions.height = y + subHeight;

  return nodes;
}

export async function initSpaces() : Promise<{reactFlowNodes: Node[], connections: Edge[]}>{
    const spaces : SpaceInfo[] = await getSpacesFlow()
    if (spaces.length > 0) {
      const reactFlowNodes = arrangeNodes(spaces);
      const connections = generateConnections(spaces);
      console.log("reactFlowNodes: ", reactFlowNodes)
      console.log("connections: ", connections)
      return {reactFlowNodes, connections}
    } else return {reactFlowNodes:[], connections:[]}

}

export const testInit = [
  { id: '1', type: 'input', data: { label: 'Advanced implementation of AuthController.' }, position: { x: 250, y: 0 } },
  { id: '2', data: { label: 'Advanced development of Dish Controller' }, position: { x: 250, y: 100 } },
  { id: '3', data: { label: "Merge branch 'development/user-dto' into development/dto" }, position: { x: 0, y: 200 } },
  { id: '4', data: { label: "Merge branch 'development/order-dto' into development/dto" }, position: { x: 250, y: 200 } },
  { id: '5', data: { label: "Merge branch 'development/dish-dto' into development/dto" }, position: { x: 500, y: 200 } },
  { id: '6', data: { label: 'Finished implementing the User DTOs as part of the DTO development.' }, position: { x: 0, y: 300 } },
  { id: '7', data: { label: 'Finished implementing the Order DTOs as part of the DTO development.' }, position: { x: 250, y: 300 } },
  { id: '8', data: { label: 'Advanced development of Dish Controller.' }, position: { x: 500, y: 300 } },
  { id: '9', data: { label: 'Start development of Dish Controller' }, position: { x: 250, y: 400 } },
  { id: '10', data: { label: 'Finished implementing the Dish DTOs as part of the DTO development.' }, position: { x: 0, y: 500 } },
  { id: '11', data: { label: 'Revert "Finished implementing the Dish DTOs as part of the DTO development."' }, position: { x: 250, y: 500 } },
  { id: '12', data: { label: 'Finished implementing the Dish DTOs as part of the DTO development.' }, position: { x: 500, y: 500 } },
  { id: '13', data: { label: 'Create Order and Basket Model for Restaurant API' }, position: { x: 250, y: 600 } },
  { id: '14', data: { label: 'Add User, Dish, Rating, and Role models.' }, position: { x: 250, y: 700 } },
] satisfies Node[]


export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  // Add any of your custom nodes here!
} satisfies NodeTypes;



