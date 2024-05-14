import type { Edge, EdgeTypes } from "reactflow";
import { SpaceInfo } from "../db";

export const generateConnections = (spaces:SpaceInfo[]) => {
  const connections : Edge[] = [];
  
  const traverseSpaces = (space:SpaceInfo) => {
    if (space.SubSpaces && space.SubSpaces.length > 0) {
      space.SubSpaces.forEach((subSpace) => {
        connections.push({ id: `${space.ID}->${subSpace.ID}`, source: space.ID.toString(), target: subSpace.ID.toString(), animated: true });
        traverseSpaces(subSpace);
      });
    }

    if (space.Devices && space.Devices.length > 0) {
      space.Devices.forEach((device) => {
        connections.push({ id: `${space.ID}->device-${device.ID}`, source: space.ID.toString(), target: `device-${device.ID}`, animated: true });
      });
    }
  };

  spaces.forEach((space) => {
    traverseSpaces(space);
  });

  return connections;
};


export const initialEdges = [
  { id: '2->3', source: '2', target: '3', animated: true },
  { id: '3->12', source: '3', target: '12', animated: true },
  { id: '2->4', source: '2', target: '4', animated: true },
  { id: '4->8', source: '4', target: '8', animated: true },
  {
    id: '8->device-1',
    source: '8',
    target: 'device-1',
    animated: true
  },
  { id: '2->6', source: '2', target: '6', animated: true },
  { id: '2->11', source: '2', target: '11', animated: true },
  { id: '2->13', source: '2', target: '13', animated: true },
  { id: '3->12', source: '3', target: '12', animated: true },
  { id: '4->8', source: '4', target: '8', animated: true },
  {
    id: '8->device-1',
    source: '8',
    target: 'device-1',
    animated: true
  }
] satisfies Edge[];

export const edgeTypes = {
  // Add your custom edge types here!
} satisfies EdgeTypes;
