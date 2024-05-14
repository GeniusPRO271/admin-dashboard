
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { SelectUser, getUsersAndAllowed } from '@/lib/db';
import { AddUserSpace, deleteUserSpace } from 'app/actions';

import React, { useEffect, useState } from 'react';

function AllowedUserTableView({ spaceId }: { spaceId: string }) {
  useEffect(() => {
    async function getUser() {
      setIsLoading(true);
      const { users, allowed } = await getUsersAndAllowed(spaceId);
      setUsers(users);
      setAllowed(allowed)
      setIsLoading(false);
    }
    getUser();
  }, [spaceId]);
  const [users, setUsers] = useState<SelectUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allowed, setAllowed] = useState<SelectUser[]>([]);

  if (!isLoading && users && allowed) {
    return (
      <>
        <form className="border shadow-sm rounded-lg bg-white h-full w-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="max-w-[150px]">Full Name</TableHead>
                <TableHead className="hidden md:table-cell">Username</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead>Is Allowed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  allowed={allowed}
                  setAllowed={setAllowed}
                  spaceId={Number(spaceId)}
                />
              ))}
            </TableBody>
          </Table>
        </form>
      </>
    );
  } else {
    return (
      <div className="border shadow-sm rounded-lg bg-white h-full w-96 flex justify-center items-center">
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
      </div>
    );
  }
}

function UserRow({
  user,
  spaceId,
  allowed,
  setAllowed
}: {
  user: SelectUser;
  spaceId: number
  allowed: SelectUser[]
  setAllowed: React.Dispatch<React.SetStateAction<SelectUser[]>>
}) {

  async function getAllowed() {
    console.log("getAllowed()")
    setIsLoading(true)
    const { allowed } = await getUsersAndAllowed(spaceId.toString());
    setAllowed(allowed);
    setIsLoading(false);
  }

  const userId = user.id;
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const status = allowed.some((user) => user.id === userId) ? true : false;

  async function HandleAddUserSpace(){
    setIsLoading(true);
    if (status){

      await deleteUserSpace(spaceId, userId)
    } else {

      await AddUserSpace(spaceId, userId);
    }
    await getAllowed()
  }


  return (
    <TableRow>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>
        {isLoading ? (
          <div className="w-full flex justify-center">
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
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <Button onClick={HandleAddUserSpace} disabled={isLoading}>
              {status ? "Remove" : "Add"}
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}

export default AllowedUserTableView;
