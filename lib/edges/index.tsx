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
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
  { id: 'e2-4', source: '2', target: '4', type: 'smoothstep' },
  { id: 'e2-5', source: '2', target: '5', type: 'smoothstep' },
  { id: 'e3-6', source: '3', target: '6', type: 'smoothstep' },
  { id: 'e4-7', source: '4', target: '7', type: 'smoothstep' },
  { id: 'e5-8', source: '5', target: '8', type: 'smoothstep' },
  { id: 'e7-9', source: '7', target: '9', type: 'smoothstep' },
  { id: 'e9-10', source: '9', target: '10', type: 'smoothstep' },
  { id: 'e10-11', source: '10', target: '11', type: 'smoothstep' },
  { id: 'e11-12', source: '11', target: '12', type: 'smoothstep' },
  { id: 'e12-13', source: '12', target: '13', type: 'smoothstep' },
  { id: 'e13-14', source: '13', target: '14', type: 'smoothstep' },
] satisfies Edge[];

export const edgeTypes = {
  // Add your custom edge types here!
} satisfies EdgeTypes;
