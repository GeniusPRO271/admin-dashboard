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
import { SpaceInfo } from '@/lib/db';
import { deleteSpace, updateSpace } from '../../actions';
import { useRouter } from 'next/navigation';
import Dropdown from '@/components/ui/dropdown';
import { useState } from 'react';

export function SpaceTable({
  spaces,
  offset,
  dropdownSpaces
}: {
  spaces: SpaceInfo[];
  offset: number | null;
  dropdownSpaces: SpaceInfo[]
}) {
  const router = useRouter();

  function onClick() {
    router.replace(`/?offset=${offset}`);
  }

  return (
    <>
      <form className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[150px]">Id</TableHead>
              <TableHead className="hidden md:table-cell">Name</TableHead>
              <TableHead className="hidden md:table-cell">
                Parent Space
              </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {spaces.map((space) => (
              <SpaceRow key={space.ID} space={space} spaces={dropdownSpaces} />
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

function SpaceRow({
  space,
  spaces
}: {
  space: SpaceInfo;
  spaces: SpaceInfo[];
}) {
  const spaceId = space.ID;
  const currentSpace = space;
  const spaceParentId = space.ParentSpaceID;
  const parentSpace = spaces.find((space) => spaceParentId === space.ID);
  const parentSpaceName = parentSpace ? parentSpace.Name : 'Root';
  const [loading, setLoading] = useState(false);

  function getAllSpaceNames(space: SpaceInfo) {
    let names: string[] = [space.Name, parentSpaceName];
    if (!space.SubSpaces) {
      return names;
    }
    for (const subSpace of space.SubSpaces) {
      names = names.concat(getAllSpaceNames(subSpace));
    }
    return names;
  }

  const excludedSpaceNames = getAllSpaceNames(currentSpace);
  const spaceNames = spaces
    .filter((space) => !excludedSpaceNames.includes(space.Name))
    .map((space) => space.Name);

  const deletesSpace  = deleteSpace.bind(null, spaceId)

  const onClickHandler = async (e: any) => {
    setLoading(true);
    const parentSpace = spaces.find(
      (space) => e.target.innerHTML === space.Name
    );
    if (parentSpace) {
      console.log('parent found');
      await updateSpace(spaceId, space.Name, parentSpace.ID);
    } else {
      console.log('Could not find the selected parent sapce');
    }
    setLoading(false);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{space.ID}</TableCell>
      <TableCell className="hidden md:table-cell">{space.Name}</TableCell>
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
        ) : spaceNames.length > 0 ? (
          <Dropdown
            text={parentSpaceName}
            items={spaceNames}
            onClick={onClickHandler}
          />
        ) : (
          <span className="px-5 py-2.5">{parentSpaceName}</span>
        )}
      </TableCell>
      <TableCell>
        <Button
          className="border focus:border-purple-600 hover:bg-card-hover"
          size="lg"
          variant="default"
          formAction={deletesSpace}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}
