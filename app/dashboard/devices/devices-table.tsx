'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DeviceInfo, SpaceInfo, getSpacesFlow, syncDevices } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Dropdown from '@/components/ui/dropdown';
import { useEdges } from 'reactflow';
import { changeDeviceSpace } from 'app/actions';

export function DevicesTable({
  devices,
  offset,
  spaces
}: {
  devices: DeviceInfo[];
  offset: number | null;
  spaces: SpaceInfo[];
}) {
  const router = useRouter();

  function onClick() {
    router.replace(`/devices?offset=${offset}`);
  }
  const [isLoading, SetIsLoading] = useState<boolean>(false);
  async function onSyncDeviceClicked() {
    SetIsLoading(true);
    await syncDevices();
    SetIsLoading(false);
  }

  return (
    <>
      <Button
        className="mb-4"
        size="sm"
        variant="outline"
        onClick={() => onSyncDeviceClicked()}
        disabled={isLoading}
      >
        {isLoading ? (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          'Sync Device'
        )}
      </Button>
      <form className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[150px]">Id</TableHead>
              <TableHead className="hidden md:table-cell">Name</TableHead>
              <TableHead className="hidden md:table-cell">
                ProductName
              </TableHead>
              <TableHead className="hidden md:table-cell">
                ProviderDeviceID
              </TableHead>
              <TableHead className="hidden md:table-cell">Space</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <DeviceRow key={device.Id} device={device} spaces={spaces} />
            ))}
          </TableBody>
        </Table>
      </form>
      {offset !== null && (
        <Button
          className="mt-4 w-40"
          variant="secondary"
          onClick={() => onClick()}
        >
          Next Page
        </Button>
      )}
    </>
  );
}

function DeviceRow({
  device,
  spaces
}: {
  device: DeviceInfo;
  spaces: SpaceInfo[];
}) {
  const deviceId = device.Id;
  const selectedSpace = spaces.find((space) => space.ID == device.SpaceID);
  const [loading, setLoading] = useState(false);
  const seelctedSpaceName = selectedSpace ? selectedSpace.Name : 'none';
  const spaceNames = spaces
    .filter((space) => space.ID != device.SpaceID)
    .map((space) => space.Name);

  async function onClickHandler(e: any) {
    setLoading(true);
    const clickedSpace = spaces.find(
      (space) => e.target.innerHTML === space.Name
    );
    if (clickedSpace) {
      console.log('space found');
      await changeDeviceSpace(clickedSpace.ID, deviceId);
    } else {
      console.log('Could not find the selected space');
    }
    setLoading(false);
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{device.Id}</TableCell>
      <TableCell className="hidden md:table-cell">{device.Name}</TableCell>
      <TableCell>{device.ProductName}</TableCell>
      <TableCell>{device.ProviderDeviceID}</TableCell>
      <TableCell>
        {loading ? (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <Dropdown
            text={seelctedSpaceName}
            items={spaceNames}
            onClick={onClickHandler}
          />
        )}
      </TableCell>
    </TableRow>
  );
}

export function isLoadingSpinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
